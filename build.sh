#!/bin/bash

# 1. 프론트엔드 빌드
echo "Starting frontend build..."
# shellcheck disable=SC2164
cd src/main/frontend
npm ci
npm run build

# 2. 빌드된 정적 파일 복사
echo "Copying built files to backend static directory..."
cp -r build ../resources/static

# 3. 백엔드 빌드
echo "Starting backend build..."
cd ../../..
./mvnw clean package -DskipTests

echo "Build completed successfully!"