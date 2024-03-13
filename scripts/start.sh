#!/bin/bash

# Start dfx in the background
echo "Starting dfx in the background..."
dfx start --background --clean

output=$(dfx canister status user_canister 2>&1)

# Search for the specific error message in the output
if echo "$output" | grep -q "Cannot find canister id. Please issue 'dfx canister create user_canister'"; then
  echo "Canister 'user_canister' does not exist, creating and deploying..."
  dfx canister create user_canister
  dfx deploy user_canister
  dfx deploy internet_identity
else
  echo "Canister 'user_canister' exists or another error occurred. No action taken."
  echo "$output"
fi

# Start your project with yarn at the end
echo "Starting project with yarn..."
yarn start
