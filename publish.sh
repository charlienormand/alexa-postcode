#!/usr/bin/env bash

#   Publish to AWS Lambda using the AWS Command Line Interface (CLI)
#   Lambda function must already exist.  Modify the function-name value on line 14.
#   To install the CLI, see
#   https://developer.amazon.com/public/community/post/Tx1UE9W1NQ0GYII/Publishing-Your-Skill-Code-to-Lambda-via-the-Command-Line-Interface#
#


rm index.zip
cd src
zip -X -r ../index.zip *
cd ..
aws lambda update-function-code --function-name alexaPostcode --zip-file fileb://index.zip
