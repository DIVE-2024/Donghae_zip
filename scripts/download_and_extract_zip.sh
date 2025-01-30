#!/bin/bash
set -e  # 오류 발생 시 즉시 스크립트 중단

# 변수 정의
S3_BUCKET="codepipeline-ap-northeast-2-551819632284"
ZIP_FILE="deployment-package.zip"
APP_DIR="/home/ec2-user/app"
DEPLOY_DIR="/home/ec2-user/deploy"

# 디렉터리 생성 (없으면 생성)
mkdir -p "$APP_DIR"
mkdir -p "$DEPLOY_DIR"

# S3에서 ZIP 파일 다운로드
echo "🚀 Downloading ZIP file from S3: $ZIP_FILE..."
if aws s3 cp "s3://$S3_BUCKET/$ZIP_FILE" "$DEPLOY_DIR/"; then
    echo "✅ S3 다운로드 성공: $DEPLOY_DIR/$ZIP_FILE"
else
    echo "❌ S3 다운로드 실패. 스크립트 종료."
    exit 1
fi

# ZIP 파일 존재 확인 후 압축 해제
if [ -f "$DEPLOY_DIR/$ZIP_FILE" ]; then
    echo "📦 Unzipping $ZIP_FILE to $APP_DIR..."
    unzip -o "$DEPLOY_DIR/$ZIP_FILE" -d "$APP_DIR/"
    echo "✅ 압축 해제 완료: $APP_DIR/"
else
    echo "❌ ZIP 파일이 존재하지 않음. 스크립트 종료."
    exit 1
fi

# 필요하면 압축 파일 삭제 (선택 사항)
# rm "$DEPLOY_DIR/$ZIP_FILE"

echo "🎉 S3 ZIP 파일 다운로드 및 이동 완료!"
