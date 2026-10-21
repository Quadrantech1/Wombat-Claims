#!/bin/bash

set -e
echo "🚀 Starting IPG Automation Tests..."
echo "environment: TAG = $TAG"
echo "environment: ENV = $ENV"
echo "environment: WORKERS = $WORKERS"
echo "environment: TEST_PROJECT = $TEST_PROJECT"
echo "environment: VM_NUMBER = $VM_NUMBER"
echo "environment: GREEN_BLUE = $GREEN_BLUE"

# Default values if the env is empty
: "${TAG:=@Smoke}"
: "${ENV:=qas}"
: "${WORKERS:=1}"
: "${VM_NUMBER:=0}"
: "${GREEN_BLUE:=live}"

cd /app/
npm install
npx -g playwright install    

# Build command with conditional project parameter
if [ -n "$TEST_PROJECT" ] && [ "$TEST_PROJECT" != "" ]; then
    echo "command: npm run test tag=$TAG env=$ENV workers=$WORKERS project=$TEST_PROJECT"
    set +e
    npm run test tag="$TAG" env="$ENV" workers="$WORKERS" project="$TEST_PROJECT"
else
    echo "command: npm run test tag=$TAG env=$ENV workers=$WORKERS"
    set +e
    npm run test tag="$TAG" env="$ENV" workers="$WORKERS"
fi

if [ $? -ne 0 ]; then
    echo "npm test failed, but continuing..."
    # Or handle the error in a different way
fi
set -e

sleep 30s
mkdir -p /tmp/report/test-results
mkdir -p /tmp/report/playwright-report  
mkdir -p /tmp/report/allure-results
mkdir -p /tmp/report/logs

cp -r /app/test-results/* /tmp/report/test-results/ 2>/dev/null || echo "No test-results to copy"
cp -r /app/playwright-report/* /tmp/report/playwright-report/ 2>/dev/null || echo "No playwright-report to copy"
cp -r /app/allure-results/* /tmp/report/allure-results/ 2>/dev/null || echo "No allure-results to copy"
cp -r /app/logs/* /tmp/report/logs/ 2>/dev/null || echo "No logs to copy"

echo "moving reports"
echo "Automation Tests were executed successfully."

