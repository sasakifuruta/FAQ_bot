import os
import boto3
from opensearchpy import OpenSearch
from requests_aws4auth import AWS4Auth

def get_opensearch_client():
    region = os.environ["AWS_REGION"]
    host = os.environ["OPENSEARCH_ENDPOINT"].replace("https://", "")

    credentials = boto3.Session().get_credentials()
    awsauth = AWS4Auth(
        credentials.access_key,
        credentials.secret_key,
        region,
        "es",
        session_token=credentials.token,
    )

    return OpenSearch(
        hosts=[{"host": host, "port": 443}],
        http_auth=awsauth,
        use_ssl=True,
        verify_certs=True,
    )
