.PHONY: dcu dcd start build worker service

dcu:
	docker-compose up -d
	docker-compose logs -f

dcd:
	docker-compose down

start:
	npm run dev

build:
	npm run build

worker:
	docker build -t reddit-newsletter/worker -f Dockerfile.worker .

service:
	docker build -t reddit-newsletter/service -f Dockerfile.service .
