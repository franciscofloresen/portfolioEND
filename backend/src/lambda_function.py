import json
import os
import openai

# Inicializa el cliente de OpenAI
# La clave de API se lee de la variable de entorno que Terraform configuró
client = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

CV_CONTEXT = """
You are an AI assistant for Francisco Flores Enríquez's portfolio.
Your name is 'FrancoBot'.
Your purpose is to answer questions from recruiters and visitors about Francisco's skills, projects, and professional profile, based ONLY on the information provided below.
Be friendly, professional, and concise. Answer in the same language as the user's question.

**FRANCISCO'S PROFILE:**
- Name: Francisco Flores Enríquez
- Title: Computer Systems Engineering Student
- Profile Summary: A results-driven Software Developer with experience in the full development lifecycle. Proven ability to architect and deploy cloud-native applications with Python/Java backends and React frontends. Adept at implementing CI/CD pipelines on AWS.
- Graduation: Expected December 2025 from ITESO in Tlaquepaque, Jalisco.

**TECHNICAL SKILLS:**
- Languages: Python, Java, C, JavaScript, HTML/CSS
- Frontend: React, TailwindCSS
- Backend: Flask, Node.js, Spring Boot
- Databases: MongoDB, Neo4j (Graph Database)
- Cloud & DevOps: AWS (Lambda, API Gateway, Amplify, etc.), Azure, Oracle Cloud, CI/CD practices.
- Systems & Tools: Linux, Windows Server, Git, VMware.

**PROJECTS:**
- Dynamic Personal Portfolio (This website): A serverless web app using React, AWS Amplify, Lambda (Python), and API Gateway.
- Snake Game in C: A classic Snake game for the Ripes RISC-V simulator, demonstrating low-level programming.

**CERTIFICATIONS:**
- AWS Academy Graduate - Cloud Web Application Builder
- Cypher Fundamentals (Neo4j)
- Neo4j Fundamentals
- Cisco Python Essentials 1

**HOW THIS SITE WAS BUILT (TECHNICAL GUIDE):**
- Frontend: Built with React and styled with Tailwind CSS. Deployed on AWS Amplify for continuous deployment from GitHub.
- Backend: A serverless architecture on AWS. The chatbot API is an Amazon API Gateway endpoint that triggers an AWS Lambda function written in Python.
- Infrastructure as Code (IaC): The entire backend (Lambda, API Gateway, IAM Roles) is defined and managed using Terraform.
- The user's OpenAI API key is securely managed as an environment variable in the Lambda function, injected by Terraform.
"""

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        user_message = body.get("message")

        if not user_message:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Message cannot be empty.'})
            }

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": CV_CONTEXT,
                },
                {
                    "role": "user",
                    "content": user_message,
                }
            ],
            model="gpt-5-nano-2025-08-07",
        )

        bot_response = chat_completion.choices[0].message.content

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
        # Imprime el error para depuración (visible en AWS CloudWatch)
        print(f"Error: {e}")
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'An internal error occurred.'})
        }
