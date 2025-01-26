#!/bin/bash

echo "Starting application..."

APP_DIR="/home/ec2-user/app"
JAR_FILE="$APP_DIR/Donghae_zip-0.0.1-SNAPSHOT.jar"
LOG_FILE="$APP_DIR/app.log"

# 애플리케이션 실행
nohup java -jar $JAR_FILE > $LOG_FILE 2>&1 &

echo "Application started successfully."
