# Connecting to a running docdb with mongodb

The elife `docdb` clusters are only acccessible via `ec2` instances on the same VPC as the clusters. To gain access to the cluster locally you will need to create a [tunnel](https://www.ssh.com/ssh/tunneling/example) through `bastion` to the cluster. 

The following instructions are based on AWS's official docs found [here](https://docs.aws.amazon.com/documentdb/latest/developerguide/connect-from-outside-a-vpc.html).

## SSH Port Forwarding with bastion 

Open an terminal window/ tab

`ssh -L <localPort>:<docdbClusterUrl>:<docdbClusterPort> elife@bastion.elifesciences.org`

eg:

`ssh -L 27017:documentdbcluster-aaabbbb1111ab1.cluster-aaaabbbb11aabb.us-east-1.docdb.amazonaws.com:27017 elife@bastion.elifesciences.org`

This should open a new ssh connection to `bastion` within that terminal window/tab so leave that open. Exiting this will close the tunnel.

## Connecting to the cluster with local mongo via cli


In a new terminal window/tab connect to the cluster with mongo using:

`mongo --tls --tlsAllowInvalidHostnames --tlsAllowInvalidCertificates --username <docdbClusterUser> --password <docdbClusterPassword>`

eg:

`mongo --tls --tlsAllowInvalidHostnames --tlsAllowInvalidCertificates --username root --password mySuperSecretClusterPassword`

note: if you set `<localPort>` to something else when tunneling through to the cluster then you will need to add the arg `--port <localPort>`


