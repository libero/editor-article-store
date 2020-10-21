.PHONY: start_services start_dev start stop

start_services:
	docker-compose build s3-file-watcher
	docker-compose up -d localstack
	./.scripts/docker/wait-healthy.sh localstack 120
	docker-compose up -d s3-file-watcher mongo
	./.scripts/docker/wait-healthy.sh editor_mongo 60

build:
	docker-compose build editor-article-store

start_dev: start_services
	RUN_ENV=dev ${MAKE} build
	docker-compose up -d editor-article-store
	docker-compose logs -f editor-article-store s3-file-watcher

start: start_services
	RUN_ENV=prod ${MAKE} build
	docker-compose up -d editor-article-store

test_ci: start
	npm install
	cp ./resources/articles/elife-54296-vor-r1.zip ./tmp/kryiaBucket
	npm run test

test: start_dev
	npm install
	cp ./resources/articles/elife-54296-vor-r1.zip ./tmp/kryiaBucket
	npm run test

stop:
	rm -rf tmp
	docker-compose down