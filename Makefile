.DEFAULT_GOAL := help
.PHONY: setup start_services build start_dev start stop test_ci help
		
LOGGING ?= TRUE

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

setup: ## Setup gitmodules
	-@ git submodule update --init --recursive

start_services: ## Start supporting services
	docker-compose up -d localstack
	./.scripts/docker/wait-healthy.sh localstack 120
	docker-compose up -d mongo
	./.scripts/docker/wait-healthy.sh editor_mongo 60

build: ## Build docker image
	docker-compose build editor-article-store

start_dev: start_services ## Start services in dev mode
	RUN_ENV=dev ${MAKE} build 
	docker-compose up -d editor-article-store s3-file-watcher transformer
ifeq ($(LOGGING), TRUE)
	docker-compose logs -f editor-article-store s3-file-watcher
endif

start: start_services ## Start services in prod mode
	RUN_ENV=prod ${MAKE} build
	docker-compose up -d editor-article-store

test_ci: start ## Run CI tests locally
	npm install
	npm run test
	npm run test:functional

stop:	## Stop all services
	rm -rf tmp
	docker-compose down
