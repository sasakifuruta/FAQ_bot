# infra/dynamo.py
import os
import boto3
from dotenv import load_dotenv

load_dotenv()

def get_dynamodb_resource():
    return boto3.resource(
        "dynamodb",
        region_name=os.environ.get("AWS_REGION", "ap-northeast-1"),
        endpoint_url=os.environ.get("DYNAMODB_ENDPOINT"),
        aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID", "dummy"),
        aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY", "dummy"),
    )
