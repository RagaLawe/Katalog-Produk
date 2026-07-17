#!/bin/bash
cd /home/z/my-project
# Detach completely: new session, redirect stdio, no controlling terminal
nohup setsid bun run dev > /home/z/my-project/dev.log 2>&1 < /dev/null &
PID=$!
# Save PID for later management
echo $PID > /home/z/my-project/.zscripts/dev.pid
echo "Started dev server PID=$PID"
# Wait briefly for it to come up
sleep 5
if kill -0 $PID 2>/dev/null; then
  echo "Process still alive after 5s"
else
  echo "Process died"
fi
