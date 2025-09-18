#!/bin/bash
cd /home/kavia/workspace/code-generation/artist-management-dashboard-27340-27360/music_management_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

