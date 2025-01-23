#!/bin/bash
echo "Starting backend application..."
nohup java -jar /home/ec2-user/backend-app/Donghae_zip-0.0.1-SNAPSHOT.jar > /home/ec2-user/backend-app/app.log 2>&1 &
