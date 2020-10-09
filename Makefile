start:
	docker-compose build
	docker-compose up -d
	sleep 20
	npm run build
	- npm start
stop:
	rm -rf tmp
	docker-compose down