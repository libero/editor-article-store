echo 'creating SQS queue'
awslocal sqs create-queue --queue-name KryiaUploadQueue
pwd
ls
awslocal s3api put-bucket-notification-configuration --bucket kryia --notification-configuration file://notification.json
echo 'SQS queue created'
