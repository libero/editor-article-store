start_services:
	docker-compose build
	docker-compose up -d
	# we neeed to replace this with a health check
	sleep 20
start_dev: start_services
	npm run dev
start:
	npm run build
	npm start
stop:
	rm -rf tmp
	docker-compose down