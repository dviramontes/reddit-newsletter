# `reddit-newsletter/k8s`

> kubernetes setup for publishing and syncing newsletter subscriptions

### Requirements

- [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- [Docker](https://docs.docker.com/get-docker/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

### Setup

- `minikube start`
- `minikube docker-env` # follow the setup in the output

### Create cronjob(s)

from project root

- `eval $(minikube -p minikube docker-env)`
- `make build workers` # allows for minikube to pick changes to our images
- `kubectl -f ./k8s/update-cronjob.yaml`
- `kubectl -f ./k8s/publish-cronjob.yaml`
