#!/bin/bash
set -euf -o pipefail

ENVIRONMENT="${1:-}"

if [ -z "${ENVIRONMENT}" ]
then
  echo 'Usage: ./deploy.sh $ENVIRONMENT [--region $REGION]'
  exit 1
fi

ARTIFACT_S3_BUCKET="sami-cloudformation-artifacts"
OUTPUT_TEMPLATE="cloudformation-generated.yml"

echo "Packaging..."
aws cloudformation package \
  --template-file "cloudformation.yml" \
  --output-template-file $OUTPUT_TEMPLATE \
  --s3-bucket $ARTIFACT_S3_BUCKET \
  --s3-prefix "${ENVIRONMENT}"

rm -rf lambdas/dist

echo "Deploying..."
aws cloudformation deploy \
  --template-file $OUTPUT_TEMPLATE \
  --stack-name "${ENVIRONMENT}-style-transfer" \
  --parameter-overrides "Environment=${ENVIRONMENT}" \
  --capabilities CAPABILITY_NAMED_IAM \
  "${@:2}"

rm -f $OUTPUT_TEMPLATE
