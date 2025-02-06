#!/bin/bash

APP_DIR="/home/ec2-user/app"
JAR_FILE="$APP_DIR/Donghae_zip-0.0.1-SNAPSHOT.jar"
LOG_FILE="/home/ec2-user/app/server.log"

echo "Starting application..."

# 실행 중인 프로세스 종료 (이전 실행 중인 애플리케이션을 종료)
if pgrep -f "$JAR_FILE" > /dev/null
then
    echo "Stopping existing application..."
    pkill -f "$JAR_FILE"
    sleep 5  # 프로세스가 완전히 종료될 때까지 대기
fi

# 애플리케이션 실행
nohup java -jar $JAR_FILE > $LOG_FILE 2>&1 &

echo "Application started successfully."
