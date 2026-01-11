FROM public.ecr.aws/lambda/python:3.11

WORKDIR /var/task

COPY requirements.txt .

# Amazon Linux 用のビルドツールをインストール
RUN yum -y update && \
    yum install -y gcc gcc-c++ make cmake python3-devel && \
    yum clean all

# pip install
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY app.py .
COPY rag/ ./rag
COPY repository/ ./repository
COPY infra/ ./infra

CMD ["app.handler"]
