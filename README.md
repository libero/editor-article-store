# Libero Editor Article Store

Service for storing and managing articles.

## Getting Started

Getting up and running is rather straightforward, you just need to install the requried dependencies, compile the code 
and then start it.

On first run you'll need to initialize and update the git submodule which has some of the required `.sh` scripts used in thee `Makefile` as well as install the required npm packages
```
git submodule init
git submodule update --recursive
```

Then to build and start the services just run:

```
make start_dev
```

## Usage

You can interact with the service via your browser...

```
http://localhost:8080/articles/'
```

Or using another program such as cURL to fire requests at the API.

```
curl -i -H "Accept: application/json" 'localhost:8080/articles/12345'
```

## Configuration

You can configure the application either through environment vars...

```
ARTICLE_ROOT=/path/to/my/articles npm run start
```

Or via the command line...

```
npm run start -- --article-root ./path/to/my/articles
```

**Note:** That both of the above are eqivilent, but command line arguments take precendence over environment vars!

## Docker

You can build the service into a container and run that locally if you prefer.

```
docker build . -t editor-article-store:local --no-cache
```

And once built, you can run the container using...

```
docker run editor-article-store:local
```

And of course, you can run container with some local files....

```
docker run --env ARTICLE_ROOT=/articles -v /path/to/articles/:/articles editor-article-store:local
```
