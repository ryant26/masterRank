#!/usr/bin/env bash
set -e

# Run from the root DIR

awsKey=$1
awsSecret=$2
env=$3
buildNumber=$4
region='us-east-1'
heroApiServerRpository_ecs='634663920785.dkr.ecr.us-east-1.amazonaws.com/heroapiserver'
socketServerRepository_ecs='634663920785.dkr.ecr.us-east-1.amazonaws.com/socketserver'
scriptsDir=shared/buildScripts

if [ env == prod ]
then
    cluster_ecs='Fireteam'
    heroApiService_ecs='heroapiserver'
    socketServerService_ecs='socketserver'
    s3Bucket='fireteam.gg'
    buildTag='prod'
else
    cluster_ecs='Fireteam-test'
    heroApiService_ecs='heroapiserver-test'
    socketServerService_ecs='socketserver-test'
    s3Bucket='test.fireteam.gg'
    buildTag='test'
fi

heroApiServerTag_ecs=$heroApiServerRpository_ecs:$buildTag$buildNumber
socketServerTag_ecs=$socketServerRepository_ecs:$buildTag$buildNumber

echo "Authenticating Docker..."
eval $(aws ecr get-login --no-include-email --region $region)

echo "Bundling"
cd react/
npm install
npm run build
cd ../

$scriptsDir/push_static.sh react/dist/ $s3Bucket
$scriptsDir/deploy_cf.sh $env

echo ===================================
echo ===== Static Assets deployed ======
echo ===================================

$scriptsDir/build_and_push_container.sh heroApiServer $heroApiServerRpository_ecs :$buildTag$buildNumber
$scriptsDir/build_and_push_container.sh socketServer $socketServerRepository_ecs :$buildTag$buildNumber

echo ===================================
echo ======== ECS Images Pushed ========
echo ===================================

$scriptsDir/ecs_deploy.sh -k $awsKey -s $awsSecret -r $region -c $cluster_ecs -n $heroApiService_ecs -i $heroApiServerTag_ecs -t 300
$scriptsDir/ecs_deploy.sh -k $awsKey -s $awsSecret -r $region -c $cluster_ecs -n $socketServerService_ecs -i $socketServerTag_ecs -t 300

echo ===================================
echo ======= Deployment Complete =======
echo ===================================