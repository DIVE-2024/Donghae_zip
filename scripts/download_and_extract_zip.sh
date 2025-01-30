#!/bin/bash
set -e  # 오류 발생 시 스크립트 중단

# 변수 정의
S3_BUCKET="codepipeline-ap-northeast-2-551819632284"
ZIP_FILE="deployment-package.zip"
APP_DIR="/home/ec2-user/app"
DEPLOY_DIR="/home/ec2-user/build/deploy"

# 디렉터리 생성 (없으면 생성)
mkdir -p $APP_DIR
mkdir -p $DEPLOY_DIR

# S3에서 ZIP 파일 다운로드
echo "Downloading ZIP file from S3..."
aws s3 cp s3://$S3_BUCKET/$ZIP_FILE $APP_DIR/

# ZIP 파일을 `build/deploy/`로 이동
mv $APP_DIR/$ZIP_FILE $DEPLOY_DIR/

# 압축 해제 (필요하면 이 과정 유지)
unzip -o $DEPLOY_DIR/$ZIP_FILE -d $APP_DIR/

# 압축 해제 후 ZIP 파일 유지 (CodeBuild에서 필요하면 삭제 X)
# 만약 삭제해야 한다면 아래 주석 해제
# rm $DEPLOY_DIR/$ZIP_FILE

echo "S3 ZIP 파일 다운로드 및 이동 완료"
