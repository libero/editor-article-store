start:
	docker-compose build
	docker-compose up -d
	npm run build
	#we neeed to replace this with a health check
	sleep 20
	- npm start
stop:
	rm -rf tmp
	docker-compose down