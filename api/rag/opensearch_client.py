import os
import boto3
from opensearchpy import OpenSearch
from requests_aws4auth import AWS4Auth
from opensearchpy.connection import RequestsHttpConnection
from urllib.parse import urlparse


def get_opensearch_client():
    """
    OpenSearchクライアントを取得する関数。
    
    環境変数 OPENSEARCH_ENDPOINT からエンドポイントを取得し、
    スキーム（http/https）に応じて適切な設定でOpenSearchクライアントを初期化する。
    
    - HTTPSの場合: AWS OpenSearch Service用の認証（AWS4Auth）を使用
    - HTTPの場合: ローカルOpenSearch用の設定を使用
    
    Returns:
        OpenSearch: 初期化されたOpenSearchクライアントインスタンス
        
    Raises:
        KeyError: OPENSEARCH_ENDPOINT環境変数が設定されていない場合
    """
    print("get_opensearch_client called")

    endpoint = os.environ["OPENSEARCH_ENDPOINT"]
    parsed = urlparse(endpoint)

    scheme = parsed.scheme          # http / https
    host = parsed.hostname          # opensearch / xxxx.amazonaws.com
    port = parsed.port

    print(f"endpoint:{endpoint}")
    print(f"scheme:{scheme}, host:{host}, port:{port}")

    # =========================
    # AWS OpenSearch Service
    # =========================
    if scheme == "https":
        session = boto3.Session()
        region = session.region_name

        credentials = session.get_credentials().get_frozen_credentials()
        awsauth = AWS4Auth(
            credentials.access_key,
            credentials.secret_key,
            region,
            "es",
            session_token=credentials.token,
        )

        print("AWS OpenSearch mode")

        client = OpenSearch(
            hosts=[{"host": host, "port": port or 443}],
            http_auth=awsauth,
            use_ssl=True,
            verify_certs=True,
            connection_class=RequestsHttpConnection,
            timeout=30,
            max_retries=3,
            retry_on_timeout=True,
        )

    # =========================
    # Local OpenSearch
    # =========================
    else:
        print("Local OpenSearch mode")

        client = OpenSearch(
            hosts=[{"host": host, "port": port or 9200}],
            use_ssl=False,
            verify_certs=False,
            timeout=30,
            max_retries=3,
            retry_on_timeout=True,
        )

    print("client created")
    return client
