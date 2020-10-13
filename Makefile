start_services:
	docker-compose build
	docker-compose up -d localstack
	./.scripts/docker/wait-healthy.sh localstack 120
	docker-compose up -d s3-file-watcher postgres mongo
	./.scripts/docker/wait-healthy.sh editor_postgres 60
	./.scripts/docker/wait-healthy.sh editor_mongo 60
start_dev: start_services
	npm run dev
start: start_services
	npm run build
	npm start
stop:
	rm -rf tmp
	docker-compose down