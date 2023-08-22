#!/bin/bash

if lsof -Pi :4943 -sTCP:LISTEN -t >/dev/null; then
  echo "Port 4943 is in use. Killing the process..."
  dfx stop
  kill -INT $(lsof -t -i :4943)
  while lsof -Pi :4943 -sTCP:LISTEN -t >/dev/null; do
    sleep 1
  done
  echo "Process terminated."
fi

echo "Starting the necessary commands..."
dfx stop && dfx start --clean --background
dfx deploy backend
npm start

echo "Script execution completed."
