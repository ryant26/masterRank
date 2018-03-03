#! /bin/bash
set -e

dir=$1
endpoint=$2

# Delete Current Files
echo "Deleting Current Files"
aws s3 rm "s3://"$endpoint --recursive

# Assume that the aws CLI is already logged in
echo "Deploying static files from "$dir" to S3 bucket: "$endpoint
aws s3 cp $dir "s3://"$endpoint --acl public-read --recursive --exclude "*.map" --exclude ".*"