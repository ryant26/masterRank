#!/usr/bin/env bash
set -e

# !!!!!! Must be run from the repo root !!!!!!!!!

dirName=$1
repoName=$2
tagName=$3

echo "Creating temp directories for docker build context ..."
mkdir dockerTemp
cd dockerTemp

echo "Copying all files from shared/ and" $dirName
cp -r ../shared .
cp -r ../$dirName .
mv shared/Dockerfile .
mv $dirName/.dockerignore .

echo "Building microservice:" $dirName
echo "Building docker image using tag:" $repoName$tagName

docker build -t $repoName$tagName --build-arg microservice=$dirName .

echo "Attempting to push image to repo:" $repoName
docker push $repoName$tagName

echo "Cleaning up ..."
cd ../
rm -rf dockerTemp/