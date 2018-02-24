#! /bin/bash
set -e

dir=$1
endpoint=$2

# Assume that the aws CLI is already logged in
echo "Deploying static files from "$dir" to S3 bucket: "$endpoint
aws s3 cp $dir "s3://"$2 --acl public-read --recursive --exclude "*.map" --exclude ".*"

# Get all files older than yesterday and remove them (yesterday to avoid problems at midnight)
aws s3 ls "s3://"$endpoint | grep $(date -v-1d +%Y-%m-%d) -v | grep -E $(date +%Y-%m-%d) -v | grep -oE '\S+\.\S+\.\S+' | while read filename
do
    aws s3 rm "s3://"$endpoint/$filename
done
