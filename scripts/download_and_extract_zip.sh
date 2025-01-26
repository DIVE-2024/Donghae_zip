#!/bin/bash

# S3에서 ZIP 파일 다운로드
aws s3 cp s3://codepipeline-ap-northeast-2-551819632284/deployment-package.zip /home/ec2-user/app/

# 압축 해제
unzip -o /home/ec2-user/app/deployment-package.zip -d /home/ec2-user/app/

# 압축 해제 후 ZIP 파일 삭제
rm /home/ec2-user/app/deployment-package.zip

echo "S3 ZIP 파일 다운로드 및 압축 해제 완료"
