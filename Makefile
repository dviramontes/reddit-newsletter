.PHONY: dcu dcd

dcu:
	docker-compose up -d
	docker-compose logs -f

dcd:
	docker-compose down
