#!/bin/bash
set -e  # 오류 발생 시 즉시 종료

LOG_FILE="/home/ec2-user/deployment.log"
SCRIPT_DIR="/home/ec2-user/donghae_app/scripts"

echo "$(date) - Setting execute permissions for scripts..." | tee -a $LOG_FILE

# ✅ 파일 소유자를 `ec2-user`로 변경
echo "$(date) - Changing ownership of script files..." | tee -a $LOG_FILE
sudo chown -R ec2-user:ec2-user "$SCRIPT_DIR"

# ✅ 실행 권한 설정 (실패 시 오류 출력)
echo "$(date) - Changing script permissions..." | tee -a $LOG_FILE
sudo chmod +x "$SCRIPT_DIR"/*.sh || { echo "$(date) - ERROR: Failed to set execute permissions!" | tee -a $LOG_FILE; exit 1; }

echo "$(date) - Permissions set successfully!" | tee -a $LOG_FILE
exit 0