# --- Proveedor y Configuración de AWS ---
provider "aws" {
  region = var.aws_region
}

# --- Preparación del Paquete Lambda ---
# Este recurso se encarga de empaquetar las dependencias de Python
resource "null_resource" "install_dependencies" {
  triggers = {
    requirements_hash = filemd5("${path.module}/src/requirements.txt")
  }

  provisioner "local-exec" {
    command = "pip install -r ${path.module}/src/requirements.txt -t ${path.module}/src/packages"
  }
}

# Empaqueta el código fuente y las dependencias en un archivo .zip
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/src"
  output_path = "${path.module}/lambda.zip"
  depends_on  = [null_resource.install_dependencies]
}


# --- IAM Role para la Función Lambda ---
resource "aws_iam_role" "lambda_exec_role" {
  name = "portfolio-chatbot-api-role"

  assume_role_policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole",
      Effect    = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# Asigna la política básica de ejecución (para logs)
resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# --- NUEVA POLÍTICA PARA ACCESO A INTERNET ---
# Esta política permite a la Lambda hacer llamadas salientes a APIs externas
resource "aws_iam_policy" "lambda_outbound_policy" {
  name        = "AWSLambdaVPCAccessExecutionRole"
  description = "Policy to allow Lambda to access resources in a VPC and the internet"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = [
          "ec2:CreateNetworkInterface",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DeleteNetworkInterface",
          "ec2:AssignPrivateIpAddresses",
          "ec2:UnassignPrivateIpAddresses"
        ],
        Resource = "*"
      }
    ]
  })
}

# Asigna la nueva política de acceso a internet a nuestro rol
resource "aws_iam_role_policy_attachment" "lambda_outbound_attachment" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = aws_iam_policy.lambda_outbound_policy.arn
}


# --- Recurso de la Función Lambda ---
resource "aws_lambda_function" "chatbot_lambda" {
  function_name    = "portfolio-chatbot-api"
  role             = aws_iam_role.lambda_exec_role.arn
  handler          = "lambda_function.lambda_handler"
  runtime          = "python3.12"
  timeout          = 30

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  environment {
    variables = {
      OPENAI_API_KEY = var.openai_api_key,
      PYTHONPATH     = "/var/task:/var/task/packages" # Asegura que Python encuentre las librerías
    }
  }

  # Esta configuración es necesaria para que la política de red funcione
  vpc_config {
    subnet_ids         = []
    security_group_ids = []
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_outbound_attachment
  ]
}

# --- API Gateway (HTTP API) ---
resource "aws_apigatewayv2_api" "chatbot_api" {
  name          = "PortfolioChatbotAPI"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["POST", "OPTIONS"]
    allow_headers = ["Content-Type"]
  }
}

# ... (El resto del archivo permanece igual) ...

# Integración entre API Gateway y la Función Lambda
resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id           = aws_apigatewayv2_api.chatbot_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.chatbot_lambda.invoke_arn
}

# Ruta para el endpoint del chat (ej: /chat)
resource "aws_apigatewayv2_route" "chat_route" {
  api_id    = aws_apigatewayv2_api.chatbot_api.id
  route_key = "POST /chat"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

# Etapa de despliegue por defecto ($default)
resource "aws_apigatewayv2_stage" "default_stage" {
  api_id      = aws_apigatewayv2_api.chatbot_api.id
  name        = "$default"
  auto_deploy = true
}

# Permiso para que API Gateway invoque la Función Lambda
resource "aws_lambda_permission" "api_gateway_permission" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.chatbot_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.chatbot_api.execution_arn}/*/*"
}

# --- Salida ---
output "api_endpoint" {
  description = "The endpoint URL for the API Gateway"
  value       = aws_apigatewayv2_api.chatbot_api.api_endpoint
}
