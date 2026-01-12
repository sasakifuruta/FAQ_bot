# infra/dynamo.py
import os
import boto3
from dotenv import load_dotenv

load_dotenv()

def get_dynamodb_resource():
    """
    DynamoDBリソースを取得する。
    
    環境変数から設定を読み込み、DynamoDBリソースを初期化する。
    ローカル開発環境ではDYNAMODB_ENDPOINTを設定することで
    ローカルのDynamoDBに接続できる。
    
    Returns:
        boto3.resource: DynamoDBリソースインスタンス
    """
    return boto3.resource(
        "dynamodb",
        region_name=os.environ.get("AWS_REGION", "ap-northeast-1"),
        endpoint_url=os.environ.get("DYNAMODB_ENDPOINT"),
        aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID", "dummy"),
        aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY", "dummy"),
    )
