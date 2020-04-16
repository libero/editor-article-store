# Libero Editor Article Store

Service for storing and managing articles.

## Getting Started

Getting up and running is rather straightforward, you just need to install the requried dependencies, compile the code 
and then start it.

```
npm install
npm run build
num start
```

## Docker

You can also bundle the service into a container and run that locally if you prefer.

```
docker build . -t editor-article-store:local --no-cache
```

And once built, you can run the container using...

```
docker run editor-article-store:local
```
