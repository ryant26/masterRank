#!/usr/bin/env bash
set -e

testEnv="E263LWRBD290J6"
prodEnv="E16S3PLCVBU99G"

if [ $1 == prod ]
then
    echo "Deploying prod Cloud front instance..."
    env=$prodEnv
else
    echo "Deploying test Cloud front instance..."
    env=$testEnv
fi

aws cloudfront create-invalidation --distribution-id $env --paths /index.html