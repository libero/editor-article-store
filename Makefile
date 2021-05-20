.PHONY: start_services start_dev start stop test_ci test build

start_services:
	docker-compose up -d localstack
	./.scripts/docker/wait-healthy.sh localstack 120
	docker-compose up -d mongo
	./.scripts/docker/wait-healthy.sh editor_mongo 60

build:
	docker-compose build editor-article-store

start_dev: start_services
	RUN_ENV=dev ${MAKE} build 
	docker-compose up -d editor-article-store s3-file-watcher transformer
	docker-compose logs -f editor-article-store s3-file-watcher

start: start_services
	RUN_ENV=prod ${MAKE} build
	docker-compose up -d editor-article-store

test_ci: start
	npm install
	npm run test
	npm run test:functional

test: start_dev
	npm install
stop:
	rm -rf tmp
	docker-compose down