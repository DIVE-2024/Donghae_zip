#!/bin/bash
echo "Stopping existing backend application..."
pkill -f 'java -jar' || echo "No running backend application found."
