# repository/docs.py
from boto3.dynamodb.conditions import Key
from infra.dynamo import get_dynamodb_resource
from dotenv import load_dotenv

load_dotenv()

TABLE_NAME = "docs"

def get_doc_meta(doc_id: str) -> dict | None:
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