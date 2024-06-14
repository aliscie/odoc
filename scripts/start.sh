#!/bin/bash

# Start dfx in the background
echo "Starting dfx in the background..."
dfx start --background
#dfx start --background --clean

output=$(dfx canister status backend 2>&1)

# Search for the specific error message in the output
if echo "$output" | grep -q "Cannot find canister id. Please issue 'dfx canister create backend'"; then
  echo "Canister 'backend' does not exist, creating and deploying..."
  dfx canister create backend
  dfx deploy backend
  dfx deploy internet_identity
else
  echo "Canister 'backend' exists or another error occurred. No action taken."
  echo "$output"
fi

# Start your project with yarn at the end
echo "Starting project with yarn..."
yarn start
