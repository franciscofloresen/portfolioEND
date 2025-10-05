variable "aws_region" {
  description = "The AWS region to deploy resources in."
  type        = string
  default     = "us-east-1"
}

variable "function_name" {
  description = "The name for the Lambda function."
  type        = string
  default     = "portfolio-chatbot-api"
}

variable "api_name" {
  description = "The name for the API Gateway."
  type        = string
  default     = "PortfolioChatbotAPI"
}

variable "openai_api_key" {
  description = "Your secret API key for OpenAI."
  type        = string
  sensitive   = true # Esto oculta el valor en los logs de Terraform
}

