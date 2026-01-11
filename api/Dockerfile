FROM public.ecr.aws/lambda/python:3.11

WORKDIR /var/task

COPY requirements.txt .
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*
RUN pip install -r requirements.txt

COPY app.py .
COPY app.py .
COPY rag/ ./rag
COPY repository/ ./repository
COPY infra/ ./infra

CMD ["app.handler"]
