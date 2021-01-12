# `reddit-newsletter/k8s`

> kubernetes setup for reddit cronjob

### Requirements

- [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- [Docker](https://docs.docker.com/get-docker/)

### Setup

- `minikube start`
- `minikube docker-env` # follow the setup in the output

### Create cronjob(s)

from project root

- `eval $(minikube -p minikube docker-env)`
- `make build workers` # do this again so that minikube registers our worker image
- `kubectl -f ./k8s/update-cronjob.yaml`
- `kubectl -f ./k8s/publish-cronjob.yaml`
