#! /bin/bash
set -e

dir=$1
endpoint=$2

# Assume that the aws CLI is already logged in
echo "Deploying static files from "$dir" to S3 bucket: "$endpoint
aws s3 cp $dir "s3://"$2 --acl public-read --recursive --exclude "*.map" --exclude ".*"