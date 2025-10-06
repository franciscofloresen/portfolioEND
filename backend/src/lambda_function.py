import json
import os
from openai import OpenAI

# Initialize the OpenAI client
# The API key is read from the environment variable set by Terraform
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# The specific model we are using
MODEL = "gpt-5-nano-2025-08-07"

def lambda_handler(event, context):
    """
    Handles API Gateway requests, sends the user's message to the OpenAI API,
    and returns the model's response.
    """
    try:
        # 1. Parse the user's message from the request body
        body = json.loads(event.get("body", "{}"))
        user_message = body.get("message")

        if not user_message:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Message not found in request body'})
            }

        # 2. Create the system prompt with your CV information
        system_prompt = """
        You are a highly specialized AI assistant for Francisco Flores Enríquez's personal portfolio.
        Your ONLY purpose is to answer questions about Francisco's skills, projects, and professional background based on the CV information provided, or to explain how this portfolio website was built.
        You MUST politely refuse to answer any questions that fall outside of this scope. Do not provide code, jokes, general knowledge, or any other information not directly related to Francisco's portfolio.

        If a user asks a question unrelated to Francisco or this portfolio, you must respond with a polite refusal, such as: "I can only answer questions about Francisco Flores and his portfolio. Do you have a question about his skills or projects?"

        --- FRANCISCO'S CV ---
        - Name: Francisco Flores Enríquez
        - Title: Computer Systems Engineering Student
        - Profile: Results-driven Software Developer with experience in the full development lifecycle. Can architect and deploy cloud-native applications with Python/Java backends and React frontends. Adept at CI/CD on AWS.
        - Skills:
          - Languages: Python, Java, C, JavaScript, HTML/CSS
          - Frontend: React, TailwindCSS
          - Backend: Flask, Node.js, Spring Boot
          - Databases: MongoDB, Neo4j
          - Cloud & DevOps: AWS, Azure, Oracle Cloud, CI/CD
          - Tools: Linux, Git, VMware
        - Projects:
          - Personal Portfolio (this site): Serverless app with React on AWS Amplify, backend using API Gateway, Lambda (Python).
          - Snake Game in C: Classic game for a Ripes RISC-V simulator.
        - Certifications: AWS Cloud Web Application Builder, Neo4j Fundamentals, Cisco Python Essentials.
        - Languages: Spanish (Native), English (Advanced B2/C1).

        --- HOW THIS SITE WAS BUILT ---
        - Frontend: React with TailwindCSS, deployed on AWS Amplify for CI/CD and hosting.
        - Backend: Serverless architecture on AWS. The chatbot UI calls an Amazon API Gateway endpoint.
        - API Gateway triggers an AWS Lambda function written in Python.
        - The Lambda function uses the OpenAI API (model gpt-5-nano) to generate responses.
        - All infrastructure (Lambda, API Gateway, IAM roles) is managed as code using Terraform.
        """

        # Combine the system prompt and the user message for the new Responses API
        full_prompt = f"{system_prompt}\n\nUSER QUESTION: {user_message}"

        # 3. Call the new GPT-5 Responses API
        response = client.responses.create(
            model=MODEL,
            input=full_prompt,
            reasoning={"effort": "low"},      # Optimized for speed and cost
            text={"verbosity": "medium"}     # Provides a balanced response length
        )

        # 4. Extract the response text
        bot_response = response.output_text

        # 5. Return the successful response
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps({'response': bot_response})
        }

    except Exception as e:
        # Log the error for debugging in CloudWatch
        print(f"Error: {e}")
        # Return a generic error message to the user
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps({'error': 'An internal error occurred in the Lambda function.'})
        }
