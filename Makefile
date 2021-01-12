.PHONY: dcu dcd start build workers service

dcu:
	docker-compose up -d
	docker-compose logs -f

dcd:
	docker-compose down

start:
	npm run dev

build:
	npm run build

workers:
	docker build -t reddit-newsletter/update-worker -f Dockerfile.update .
	docker build -t reddit-newsletter/publish-worker -f Dockerfile.publish .

service:
	docker build -t reddit-newsletter/service -f Dockerfile.service .
