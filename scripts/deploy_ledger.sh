dfx identity new minter
dfx identity use minter
export MINTER_PRINCIPAL_ID=$(dfx identity get-principal)
export MINTER_ACCOUNT_ID=$(dfx ledger account-id)

dfx identity use default
export USER_PRINCIPAL=$(dfx identity get-principal)
export USER_ACCOUNT_ID=$(dfx ledger account-id)

dfx start --background --clean

dfx deploy --network local --specified-id ryjl3-tyaaa-aaaaa-aaaba-cai icp_ledger --argument '
  (variant {
    Init = record {
      token_name = opt "Local ICP";
      token_symbol = opt "LICP";
      minting_account = "'${MINTER_ACCOUNT_ID}'";
      initial_values = vec {
        record {
          "'${USER_ACCOUNT_ID}'";
          record {
            e8s = 100_000_000_000 : nat64;
          };
        };
      };
      send_whitelist = vec {};
      transfer_fee = opt record {
        e8s = 10_000 : nat64;
      };
    }
  })
' --mode=reinstall -y

dfx deploy --network local --specified-id mxzaz-hqaaa-aaaar-qaada-cai ckbtc_ledger --argument '
  (variant {
    Init = record {
      token_name = "Local ckBTC";
      token_symbol = "LCKBTC";
      minting_account = record {
        owner = principal "'${MINTER_PRINCIPAL_ID}'";
      };
      initial_balances = vec {
        record {
          record {
            owner = principal "'${USER_PRINCIPAL}'";
          };
          100_000_000_000;
        };
      };
      metadata = vec {};
      transfer_fee = 10;
      archive_options = record {
        trigger_threshold = 2000;
        num_blocks_to_archive = 1000;
        controller_id = principal "'${MINTER_PRINCIPAL_ID}'";
      }
    }
  })
' --mode=reinstall -y

dfx deploy --network local --specified-id ss2fx-dyaaa-aaaar-qacoq-cai cketh_ledger --argument '
  (variant {
    Init = record {
      token_name = "Local ckETH";
      token_symbol = "LCKETH";
      minting_account = record {
        owner = principal "'${MINTER_PRINCIPAL_ID}'";
      };
      initial_balances = vec {
        record {
          record {
            owner = principal "'${USER_PRINCIPAL}'";
          };
          100_000_000_000;
        };
      };
      metadata = vec {};
      transfer_fee = 10;
      archive_options = record {
        trigger_threshold = 2000;
        num_blocks_to_archive = 1000;
        controller_id = principal "'${MINTER_PRINCIPAL_ID}'";
      }
    }
  })
' --mode=reinstall -y

dfx deploy --network local --specified-id xevnm-gaaaa-aaaar-qafnq-cai ckusdc_ledger --argument '
  (variant {
    Init = record {
      token_name = "Local ckUSDC";
      token_symbol = "LCKUSDC";
      minting_account = record {
        owner = principal "'${MINTER_PRINCIPAL_ID}'";
      };
      initial_balances = vec {
        record {
          record {
            owner = principal "'${USER_PRINCIPAL}'";
          };
          100_000_000_000;
        };
      };
      metadata = vec {};
      transfer_fee = 10;
      archive_options = record {
        trigger_threshold = 2000;
        num_blocks_to_archive = 1000;
        controller_id = principal "'${MINTER_PRINCIPAL_ID}'";
      }
    }
  })
' --mode=reinstall -y
