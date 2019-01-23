#!/bin/bash
set -euf -o pipefail

failure=0

for file in $(grep -irl AWSTemplateFormatVersion . | grep .yml)
do
  aws cloudformation validate-template --template-body "file://$file" || failure=1
done

exit $failure
