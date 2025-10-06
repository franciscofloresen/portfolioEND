# --- Variables ---
# Las variables se definen en variables.tf

# --- Creación del Paquete ZIP para la Función Lambda ---

# Empaqueta el código fuente de la función Lambda
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/src/"
  output_path = "${path.module}/lambda.zip"
}

# --- Rol y Permisos de IAM para la Función Lambda ---

# Define el rol que asumirá la función Lambda
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

# Adjunta la política básica de ejecución de Lambda para permitir la escritura de logs
# Para una función Lambda que no está en una VPC, esto es suficiente para tener acceso a internet.
resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# --- Recurso de la Función Lambda ---

resource "aws_lambda_function" "chatbot_lambda" {
  filename      = data.archive_file.lambda_zip.output_path
  function_name = "portfolio-chatbot-api"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = "lambda_function.lambda_handler"
  runtime       = "python3.12"
  timeout       = 30 # Aumentado para dar tiempo a la API de responder

  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  environment {
    variables = {
      OPENAI_API_KEY = var.openai_api_key
    }
  }
}

# --- API Gateway (HTTP API) ---

# Crea la HTTP API
resource "aws_apigatewayv2_api" "chatbot_api" {
  name          = "PortfolioChatbotAPI"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["POST", "OPTIONS"]
    allow_headers = ["Content-Type"]
  }
}

# Crea la integración entre la API y la función Lambda
resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id           = aws_apigatewayv2_api.chatbot_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.chatbot_lambda.invoke_arn
  payload_format_version = "2.0"
}

# Define la ruta /chat que apunta a la integración de Lambda
resource "aws_apigatewayv2_route" "chat_route" {
  api_id    = aws_apigatewayv2_api.chatbot_api.id
  route_key = "POST /chat"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

# Crea el "stage" por defecto para desplegar la API
resource "aws_apigatewayv2_stage" "default_stage" {
  api_id      = aws_apigatewayv2_api.chatbot_api.id
  name        = "$default"
  auto_deploy = true
}

# Da permiso a API Gateway para invocar la función Lambda
resource "aws_lambda_permission" "api_gateway_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.chatbot_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.chatbot_api.execution_arn}/*/*"
}

# --- Salidas ---

output "api_endpoint" {
  description = "The endpoint URL for the API Gateway"
  value       = aws_apigatewayv2_api.chatbot_api.api_endpoint
}
