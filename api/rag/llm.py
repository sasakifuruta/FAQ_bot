from openai import OpenAI

client = OpenAI()

def generate_answer(prompt: str) -> str:
    """
    LLMを使用してプロンプトに対する回答を生成する。
    
    OpenAIのgpt-4.1-miniモデルを使用してテキスト生成を行う。
    
    Args:
        prompt (str): LLMに送信するプロンプト
        
    Returns:
        str: LLMが生成した回答テキスト
    """
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content
