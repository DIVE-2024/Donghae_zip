#!/bin/bash
set -e  # 오류 발생 시 즉시 종료

LOG_FILE="/home/ec2-user/deployment.log"
DEPLOY_DIR="/home/ec2-user/donghae_app"

echo "$(date) - Starting deployment setup..." | tee -a $LOG_FILE

# ✅ 배포 루트 확인
DEPLOY_ROOT="/opt/codedeploy-agent/deployment-root"

# ✅ 최신 배포 경로 찾기 (가장 최근 생성된 배포 ID 가져오기)
LATEST_DEPLOY_ID=$(ls -1tr "$DEPLOY_ROOT" | tail -n 1)
LATEST_DEPLOY_PATH="$DEPLOY_ROOT/$LATEST_DEPLOY_ID"

if [ -z "$LATEST_DEPLOY_ID" ]; then
    echo "$(date) - ERROR: No deployment found in $DEPLOY_ROOT!" | tee -a $LOG_FILE
    exit 1
fi

echo "$(date) - Found deployment root ID: $LATEST_DEPLOY_ID" | tee -a $LOG_FILE
echo "$(date) - Deployment root path: $LATEST_DEPLOY_PATH" | tee -a $LOG_FILE

# ✅ 배포 아카이브 경로 설정
DEPLOY_ARCHIVE_PATH="$LATEST_DEPLOY_PATH/deployment-archive"

if [ ! -d "$DEPLOY_ARCHIVE_PATH" ]; then
    echo "$(date) - ERROR: Deployment archive directory not found!" | tee -a $LOG_FILE
    exit 1
fi

echo "$(date) - Deployment archive path: $DEPLOY_ARCHIVE_PATH" | tee -a $LOG_FILE

# ✅ 배포 ZIP 파일 확인
ZIP_FILE="$DEPLOY_ARCHIVE_PATH/deployment-package.zip"

if [ ! -f "$ZIP_FILE" ]; then
    echo "$(date) - ERROR: Deployment package ZIP not found!" | tee -a $LOG_FILE
    exit 1
fi

echo "$(date) - Found deployment ZIP file: $ZIP_FILE" | tee -a $LOG_FILE

# ✅ 기존 애플리케이션 삭제 후 압축 해제
if [ -d "$DEPLOY_DIR" ]; then
    echo "$(date) - Removing existing application directory: $DEPLOY_DIR" | tee -a $LOG_FILE
    sudo rm -rf "$DEPLOY_DIR"
fi

echo "$(date) - Creating application directory: $DEPLOY_DIR" | tee -a $LOG_FILE
sudo mkdir -p "$DEPLOY_DIR"
sudo chown -R ec2-user:ec2-user "$DEPLOY_DIR"

echo "$(date) - Extracting ZIP file to $DEPLOY_DIR" | tee -a $LOG_FILE
sudo unzip -o "$ZIP_FILE" -d "$DEPLOY_DIR"

# ✅ 압축 해제 후 ZIP 파일 삭제
echo "$(date) - Removing deployment package ZIP after extraction" | tee -a $LOG_FILE
sudo rm -f "$ZIP_FILE"

# ✅ TAR 파일 삭제 (필요 없는 경우)
BUNDLE_TAR="$LATEST_DEPLOY_PATH/bundle.tar"
if [ -f "$BUNDLE_TAR" ]; then
    echo "$(date) - Removing bundle.tar file" | tee -a $LOG_FILE
    sudo rm -f "$BUNDLE_TAR"
fi

# ✅ JAR 파일 이동
JAR_FILE=$(ls -1t "$DEPLOY_DIR"/Donghae_zip-*.jar 2>/dev/null | head -n 1)
TARGET_JAR_PATH="$DEPLOY_DIR/Donghae_zip-0.0.1-SNAPSHOT.jar"

if [ -f "$JAR_FILE" ]; then
    echo "$(date) - Moving JAR file to $TARGET_JAR_PATH" | tee -a $LOG_FILE
    sudo mv "$JAR_FILE" "$TARGET_JAR_PATH"
    sudo chown ec2-user:ec2-user "$TARGET_JAR_PATH"
else
    echo "$(date) - ERROR: JAR file not found!" | tee -a $LOG_FILE
    exit 1
fi

echo "$(date) - Deployment successful!" | tee -a $LOG_FILE
exit 0
