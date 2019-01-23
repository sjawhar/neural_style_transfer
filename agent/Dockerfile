FROM anibali/pytorch:cuda-9.0

RUN conda install -y \
        boto3 \
 && rm -rf /opt/conda/pkgs/*

WORKDIR /app
COPY src .
ENTRYPOINT ["python", "batch.py"]
