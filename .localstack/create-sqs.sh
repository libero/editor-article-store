echo 'creating SQS queue'
awslocal sqs create-queue --queue-name KryiaUploadQueue
echo 'SQS queue created'
