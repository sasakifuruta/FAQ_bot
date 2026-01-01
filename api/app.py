# app.py
# from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
from mangum import Mangum
# from rag.qa import ask_question

app = FastAPI()


# origins = [
#     "http://localhost:5173",# Remix dev サーバー
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


class AskRequest(BaseModel):
    question: str
    top_k: int = 5


# @app.on_event("startup")
# def on_startup():
#     try:
#         init_index()
#     except Exception as e:
#         print(f"[WARN] index init failed: {e}")


@app.post("/api/ask")
def ask(req: AskRequest):
    result = ask_question(
        question=req.question,
        top_k=req.top_k,
        message="received"
    )
    return result


# =====================
# Lambda用入り口
# =====================


@app.get("/hello")
def hello():
    return {"message": "hello from lambda"}

# Lambda用ハンドラ（デプロイ用）
handler = Mangum(app)

# ローカル開発用：uvicornで立ち上げてブラウザやcurlで確認
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)