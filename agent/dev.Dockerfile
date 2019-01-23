FROM jupyter/scipy-notebook:87210526f381

RUN conda install -y \
        boto3 \
        pytorch \
        torchvision \
 && rm -rf /opt/conda/pkgs/*

