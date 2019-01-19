FROM jupyter/scipy-notebook:87210526f381

RUN conda install -y \
  pytorch \
  torchvision
