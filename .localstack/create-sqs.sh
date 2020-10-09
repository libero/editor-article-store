echo 'creating SQS queue'
awslocal sqs create-queue --queue-name KryiaUploadQueue
echo 'SQS queue created'
echo 'setting up bucket notifications'
awslocal s3api put-bucket-notification-configuration --bucket kryia --notification-configuration file://notification.json
echo 'hi' >> file.txt
awslocal s3 cp file.txt s3://kryia
awslocal sqs receive-message --queue-url http://localhost:4566/000000000000/KryiaUploadQueue
echo 'bucket notifications ready'
