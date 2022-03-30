# ⚠️ Under new stewardship

eLife have handed over stewardship of Libero Edtior to The Coko Foundation. You can now find the updated code repository at https://gitlab.coko.foundation/libero/editor-article-store and continue the conversation on Coko's Mattermost chat server: https://mattermost.coko.foundation/

For more information on why we're doing this read our latest update on our new technology direction: https://elifesciences.org/inside-elife/daf1b699/elife-latest-announcing-a-new-technology-direction

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

To get an article into the application try running:

```
docker exec localstack awslocal s3 cp /resources/articles/elife-54296-vor-r1.zip s3://kryia/
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

OR via docker-compose `environment` configuration

```
  editor-article-store:
    build:
      context: './'
      target: ${RUN_ENV:-prod}
    image: editor-article-store:${IMAGE_TAG:-local}
    volumes:
      - ./src/:/app/src
    environment:
      - AWS_REGION=us-east-1
```

## XML import listener

The article store service also runs an article import service in parallel which can be used to ingest XML articles and assets in the form of a .zip file and deposit them into a target S3 bucket and DB collection. The import service relies on the source S3 bucket being hooked up to an SQS messaging system and the dropped .zip file having a specific naming format.

- The `awsBucketInputEventQueueUrl` config value which can be set through the envvar `AWS_BUCKET_INPUT_EVENT_QUEUE_URL` and is used to point the listener towards an SQS notification queue. The messages recieved will have the source S3 bucket information for the service to know where to pull the .zip from. The application currently requires the credentials for accessing the Libero Editor S3 bucket and source bucket to be the same (these are set via `AWS_ACCESS_KEY` and `AWS_SECRET_ACCESS_KEY`)

- All new article .zip files must follow the naming convention `${prefix}-${ARTICLE_ID}-${....other}-${ARTICLE_VERSION}` eg: `elife-00000-vor-r1.zip` would be picked up as `{ articleId: '00000', version: 'r1' }`

### Transform on import

As part of the import process, you may wish to send the extracted XML to an external service to be transformed before storing it within the article-stores DB. By default, this functionality is turned OFF but it can be toggled and configured with the following options.

- The `importTransformEnabled` config option toggles whether transform on import is enabled. This can be set with the `IMPORT_TRANSFORM_ENABLED` envvar.

- The `importTransformUrl` config option configures where the xml is set to via a `POST` request. The application expects a `plain/text` return type which should be the XML you wish to store in string format. This can be set with the `IMPORT_TRANSFORM_URL` envvar.


## Running tests

The unit tests can be run locally via `npm run test`

To run the whole suite, the following command is all that is required - `make test_ci`

To run the functional tests locally - `make start_dev` to launch the services + API, followed by `docker exec localstack awslocal s3 cp /resources/articles/elife-54296-vor-r1.zip s3://kryia/` to seed the required data. Then simply run `npm run test:functional`

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
