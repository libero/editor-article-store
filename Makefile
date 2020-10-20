.PHONY: start_services start_dev start stop

start_services:
	docker-compose build
	docker-compose up -d localstack
	./.scripts/docker/wait-healthy.sh localstack 120
	docker-compose up -d s3-file-watcher mongo
	./.scripts/docker/wait-healthy.sh editor_mongo 60
start_dev: start_services
	npm run dev &
	sleep 30
	cp ./resources/articles/elife-54296-vor-r1.zip ./tmp/kryiaBucket
start: start_services
	npm run build
	npm start
test: start_dev
	npm run test
stop:
	rm -rf tmp
	docker-compose down