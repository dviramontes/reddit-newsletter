# `reddit-newsletter/k8s`
> kubernetes setup for reddit cronjob 

### Requirements

- minikube
- docker

### Setup

- `minikube start`
- `minikube docker-env` # follow the setup in the output

### Create cronjob

from project root
- `eval $(minikube -p minikube docker-env)`
- `make build worker` # do this again so that minikube registers our worker image
- `kubectl -f ./k8s/cronjob.yaml` 
