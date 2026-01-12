# repository/docs.py
from boto3.dynamodb.conditions import Key
from infra.dynamo import get_dynamodb_resource
from dotenv import load_dotenv

load_dotenv()

TABLE_NAME = "docs"


def list_doc_ids() -> list[str]:
    """
    DynamoDBからすべてのドキュメントIDのリストを取得する。
    
    SKが"META"のアイテムをスキャンし、PKから"DOC#"プレフィックスを
    除去したドキュメントIDのリストを返す。
    
    Returns:
        list[str]: ドキュメントIDのリスト
    """
    dynamodb = get_dynamodb_resource()
    table = dynamodb.Table(TABLE_NAME)

    response = table.scan(
        ProjectionExpression="PK",
        FilterExpression="SK = :meta",
        ExpressionAttributeValues={":meta": "META"}
    )

    items = response.get("Items", [])
    return [item["PK"].replace("DOC#", "") for item in items]


def get_doc_meta(doc_id: str) -> dict | None:
    """
    指定されたドキュメントIDのメタデータを取得する。
    
    Args:
        doc_id (str): 取得するドキュメントのID
        
    Returns:
        dict | None: ドキュメントのメタデータ。存在しない場合はNone
    """
    dynamodb = get_dynamodb_resource()
    table = dynamodb.Table(TABLE_NAME)

    pk = f"DOC#{doc_id}"

    response = table.get_item(
        Key={
            "PK": pk,
            "SK": "META"
        }
    )

    return response.get("Item")


def get_doc_chunks(doc_id: str) -> list[dict]:
    """
    指定されたドキュメントIDのすべてのチャンクを取得する。
    
    DynamoDBからPKが"DOC#{doc_id}"でSKが"CHUNK#"で始まる
    すべてのアイテムをクエリし、SK順にソートして返す。
    
    Args:
        doc_id (str): 取得するドキュメントのID
        
    Returns:
        list[dict]: チャンク情報のリスト。SK順にソートされている
    """
    dynamodb = get_dynamodb_resource()
    table = dynamodb.Table(TABLE_NAME)

    pk = f"DOC#{doc_id}"

    response = table.query(
        KeyConditionExpression=
            Key("PK").eq(pk) & Key("SK").begins_with("CHUNK#")
    )

    items = response.get("Items", [])

    # SK順に並べる（CHUNK#0001 → 0002 …）
    items.sort(key=lambda x: x["SK"])

    return items