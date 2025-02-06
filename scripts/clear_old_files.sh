#!/bin/bash
set -e  # 오류 발생 시 즉시 종료

LOG_FILE="/home/ec2-user/deployment.log"
APP_DIR="/home/ec2-user/donghae_app"

echo "$(date) - Clearing old deployment files..." | tee -a $LOG_FILE

# 기존 애플리케이션 디렉토리 삭제 (파일이 존재하면 삭제)
if [ -d "$APP_DIR" ]; then
    echo "$(date) - Deleting existing application directory: $APP_DIR" | tee -a $LOG_FILE
    sudo rm -rf "$APP_DIR"
fi

# 새로운 애플리케이션 디렉토리 생성
sudo mkdir -p "$APP_DIR"
sudo chown -R ec2-user:ec2-user "$APP_DIR"

echo "$(date) - Old files cleared successfully!" | tee -a $LOG_FILE
