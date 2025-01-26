#!/bin/bash

echo "Stopping existing application..."

# 실행 중인 Java 프로세스 종료
pkill -f 'java -jar' || echo "No running application found."

echo "Application stopped successfully."
