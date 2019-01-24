# Neural Style Transfer Pipeline

To deploy using the AWS CLI, run `/deploy.sh $ENVIRONMENT`. `$ENVIRONMENT` is one of "production", "staging", "testing", or "development". This will deploy a stack called `$ENVIRONMENT-style-transfer`.

Note that some templates in the stack contain Mappings which control instance sizing and autoscaling parameters based on the selected environment (e.g. maybe you don't want 25 containers running in dev). However, only the "production" mappings have been added so far. You will probably need to redefine and extend these mappings to suite your needs.
