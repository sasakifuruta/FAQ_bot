import os
import boto3
from opensearchpy import OpenSearch
from requests_aws4auth import AWS4Auth
from opensearchpy.connection import RequestsHttpConnection

def get_opensearch_client():
    session = boto3.Session()
    region = session.region_name
    host = os.environ["OPENSEARCH_ENDPOINT"].replace("https://", "")

    credentials = session.get_credentials().get_frozen_credentials()
    awsauth = AWS4Auth(
        credentials.access_key,
        credentials.secret_key,
        region,
        "es",
        session_token=credentials.token,
    )

    client = OpenSearch(
        hosts=[{"host": host, "port": 443}],
        http_auth=awsauth,
        use_ssl=True,
        verify_certs=True,
        connection_class=RequestsHttpConnection
        timeout=30,            # ← リクエスト全体のタイムアウトを延長
        max_retries=3,
        retry_on_timeout=True
    )
    return client
