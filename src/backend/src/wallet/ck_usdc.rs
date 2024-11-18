// #[macro_use]
// extern crate ic_cdk;
use ic_cdk_macros::query;
use ic_cdk_macros::update;
use std::cell::RefCell;

use crate::CK_USDC_STATE;
use candid::{candid_method, CandidType, Nat, Principal};
use ic_cdk::caller;
use ic_ledger_types::Tokens;
use icrc_ledger_types::{
    icrc1::{
        account::Account,
        transfer::{BlockIndex, Memo, NumTokens, TransferArg, TransferError},
    },
    icrc2::{
        allowance::{Allowance, AllowanceArgs},
        approve::{ApproveArgs, ApproveError},
        transfer_from::{TransferFromArgs, TransferFromError},
    },
};
use serde::{Deserialize, Serialize};

use crate::wallet::error::{Error, USDCResult};
use crate::wallet::icpswap::*;
use crate::wallet::log::*;
use crate::wallet::owners::*;
use crate::wallet::swaps::*;
use crate::wallet::token::*;

// thread_local! {
//     static CK_USDC_STATE: RefCell<State> = RefCell::default();
// }

const DEFAULT_SWAP_TOKEN_CANISTER_ID: &str = "xevnm-gaaaa-aaaar-qafnq-cai";

#[derive(CandidType, Default, Serialize, Deserialize)]
pub struct CkUsdcState {
    owners: Owners,
    swaps: Swaps,
    logs: Logs,
}

// #[init]
// fn init() {
//     CK_USDC_STATE.with(|state| {
//         let mut state = state.borrow_mut();
//         state.owners.add_owner(ic_cdk::caller());
//     });
// }

// #[post_upgrade]
// fn post_upgrade() {
//     CK_USDC_STATE.with(|state| {
//         let mut state = state.borrow_mut();
//         state.owners.add_owner(ic_cdk::caller());
//     });
// }

fn is_owner() -> USDCResult<()> {
    let is_owner = CK_USDC_STATE.with(|state| {
        let state = state.borrow();
        state.owners.is_owner(ic_cdk::caller())
    });

    if !is_owner {
        return Err(Error::Forbidden);
    }

    Ok(())
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct GetErrorLogsArgs {
    pub start: Option<usize>,
    pub length: Option<usize>,
}

#[query]
#[candid_method(query)]
fn get_logs(data: GetErrorLogsArgs) -> Vec<Log> {
    CK_USDC_STATE.with(|state| {
        let state = state.borrow();
        state.logs.get_logs(data.start, data.length)
    })
}

#[query]
#[candid_method(query)]
fn get_owners() -> Vec<Principal> {
    CK_USDC_STATE.with(|state| {
        let state = state.borrow();
        state.owners.get_owners()
    })
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AddOwnerArgs {
    owner: Principal,
}

#[update]
#[candid_method(update)]
fn add_owner(data: AddOwnerArgs) -> USDCResult<()> {
    is_owner()?;

    let is_owner_exists = CK_USDC_STATE.with(|state| {
        let state = state.borrow();
        state.owners.is_owner(data.owner)
    });

    if is_owner_exists {
        return Err(Error::OwnerAlreadyExists);
    }

    CK_USDC_STATE.with(|state| {
        let mut state = state.borrow_mut();
        state.owners.add_owner(data.owner);
        state
            .logs
            .add_log(LogLevel::Info, format!("Owner added: {:?}", data.owner));
    });

    Ok(())
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct RemoveOwnerArgs {
    owner: Principal,
}

#[update]
#[candid_method(update)]
fn remove_owner(data: RemoveOwnerArgs) -> USDCResult<()> {
    is_owner()?;

    let is_owner_exists = CK_USDC_STATE.with(|state| {
        let state = state.borrow();
        state.owners.is_owner(data.owner)
    });

    if !is_owner_exists {
        return Err(Error::OwnerNotFound);
    }

    CK_USDC_STATE.with(|state| {
        let mut state = state.borrow_mut();
        state.owners.remove_owner(data.owner);
        state
            .logs
            .add_log(LogLevel::Info, format!("Owner removed: {:?}", data.owner));
    });

    Ok(())
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AddSwapArgs {
    token0: Principal,
    token1: Principal,
    pool_canister: Principal,
}

#[update]
#[candid_method(update)]
async fn add_swap(data: AddSwapArgs) -> USDCResult<()> {
    is_owner()?;

    let is_exists = CK_USDC_STATE.with(|state| {
        let state = state.borrow();
        state.swaps.exists(&data.token0, &data.token1)
    });

    if is_exists {
        return Err(Error::SwapAlreadyExists);
    }

    CK_USDC_STATE.with(|state| {
        let mut state = state.borrow_mut();
        state
            .swaps
            .add_swap(data.token0, data.token1, data.pool_canister);
        state.logs.add_log(
            LogLevel::Info,
            format!("Swap added: {:?} -> {:?}", data.token0, data.token1),
        );
    });

    Ok(())
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct RemoveSwapArgs {
    token0: Principal,
    token1: Principal,
}

#[update]
#[candid_method(update)]
fn remove_swap(data: RemoveSwapArgs) -> USDCResult<()> {
    is_owner()?;

    let is_swap_exists = CK_USDC_STATE.with(|state| {
        let state = state.borrow();
        state.swaps.exists(&data.token0, &data.token1)
    });

    if !is_swap_exists {
        return Err(Error::SwapNotFound);
    }

    CK_USDC_STATE.with(|state| {
        let mut state = state.borrow_mut();
        state.swaps.remove_swap(&data.token0, &data.token1);
        state.logs.add_log(
            LogLevel::Info,
            format!("Swap removed: {:?} -> {:?}", data.token0, data.token1),
        );
    });

    Ok(())
}

#[query]
#[candid_method(query)]
fn get_swaps() -> Vec<(Principal, Principal)> {
    CK_USDC_STATE.with(|state| {
        let state = state.borrow();
        state.swaps.get_swaps()
    })
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PayArgs {
    pub amount: NumTokens,
    pub token: Principal,
    pub to_merchant: Principal,
    pub memo: u64,
}

// #[update]
// #[candid_method(update)]
// async fn get() -> String {
//
//
// }

#[update]
#[candid_method(update)]
async fn pay(data: PayArgs) -> USDCResult<()> {
    let swap_token = Principal::from_text(DEFAULT_SWAP_TOKEN_CANISTER_ID).unwrap();

    let pool_canister_id = CK_USDC_STATE.with(|state| {
        let state = state.borrow();
        state
            .swaps
            .get_pool_canister_id(&data.token, &swap_token)
            .copied()
    });

    let pool_canister_id = match pool_canister_id {
        Some(id) => id,
        None => return Err(Error::SwapTokenNotFound),
    };

    let transfer_from_args = TransferFromArgs {
        amount: data.amount.clone(),
        from: Account {
            owner: ic_cdk::caller(),
            subaccount: None,
        },
        to: Account {
            owner: ic_cdk::id(), // the canister id
            subaccount: None,
        },
        fee: None,
        memo: Some(Memo::from(data.memo)),
        spender_subaccount: None,
        created_at_time: None,
    };

    ic_cdk::call::<(TransferFromArgs,), (core::result::Result<BlockIndex, TransferFromError>,)>(
        data.token,
        "icrc2_transfer_from",
        (transfer_from_args.clone(),),
    )
    .await
    .map_err(|(_, message)| {
        CK_USDC_STATE.with(|state| {
            state.borrow_mut().logs.add_log(
                LogLevel::Error,
                format!(
                    "Failed to call icrc2_transfer_from ({:?}): {:?}",
                    transfer_from_args, message
                ),
            );
        });

        Error::IcCdkError { message }
    })?
    .0
    .map_err(|e| {
        CK_USDC_STATE.with(|state| {
            state.borrow_mut().logs.add_log(
                LogLevel::Error,
                format!(
                    "Failed to call icrc2_transfer_from ({:?}): {:?}",
                    transfer_from_args, e
                ),
            );
        });

        Error::IcCdkError {
            message: format!("{:?}", e),
        }
    })?;

    // Check allowance
    let allowance_args = AllowanceArgs {
        account: Account {
            owner: ic_cdk::id(),
            subaccount: None,
        },
        spender: Account {
            owner: pool_canister_id.clone(),
            subaccount: None,
        },
    };

    let allowance = ic_cdk::call::<(AllowanceArgs,), (Allowance,)>(
        data.token,
        "icrc2_allowance",
        (allowance_args.clone(),),
    )
    .await
    .map_err(|(_, message)| {
        CK_USDC_STATE.with(|state| {
            state.borrow_mut().logs.add_log(
                LogLevel::Error,
                format!(
                    "Failed to call icrc2_allowance ({:?}): {:?}",
                    allowance_args, message
                ),
            );
        });

        Error::IcCdkError { message }
    })?
    .0;

    // Set allowance
    if allowance.allowance.lt(&data.amount) {
        let approve_args = ApproveArgs {
            spender: Account {
                owner: pool_canister_id,
                subaccount: None,
            },
            amount: data.amount.clone() * Nat::from(1_000 as u64),
            from_subaccount: None,
            memo: None,
            created_at_time: None,
            expected_allowance: None,
            expires_at: None,
            fee: None,
        };

        ic_cdk::call::<(ApproveArgs,), (core::result::Result<Nat, ApproveError>,)>(
            data.token,
            "icrc2_approve",
            (approve_args.clone(),),
        )
        .await
        .map_err(|(_, message)| {
            CK_USDC_STATE.with(|state| {
                state.borrow_mut().logs.add_log(
                    LogLevel::Error,
                    format!(
                        "Failed to call icrc2_approve ({:?}): {:?}",
                        approve_args, message
                    ),
                );
            });

            Error::IcCdkError { message }
        })?
        .0
        .map_err(|e| {
            CK_USDC_STATE.with(|state| {
                state.borrow_mut().logs.add_log(
                    LogLevel::Error,
                    format!("Failed to call icrc2_approve ({:?}): {:?}", approve_args, e),
                );
            });

            Error::IcCdkError {
                message: format!("{:?}", e),
            }
        })?;
    }

    // Deposit to pool
    let fee = get_fee(data.token).await.map_err(|(_, message)| {
        CK_USDC_STATE.with(|state| {
            state.borrow_mut().logs.add_log(
                LogLevel::Error,
                format!("Failed to call get_fee ({:?}): {:?}", data.token, message),
            );
        });

        Error::IcCdkError { message }
    })?;

    let deposit_from_args = DepositFromArgs {
        token: data.token.to_string(),
        amount: data.amount.clone(),
        fee,
    };

    let deposit_from_result = deposit_from(pool_canister_id, deposit_from_args.clone())
        .await
        .map_err(|(_, message)| {
            CK_USDC_STATE.with(|state| {
                state.borrow_mut().logs.add_log(
                    LogLevel::Error,
                    format!(
                        "Failed to call icpswap deposit_from ({:?}): {:?}",
                        deposit_from_args, message
                    ),
                );
            });

            Error::IcCdkError { message }
        })?;

    let deposit_amount = match deposit_from_result {
        IcpResult::ok(deposit_from_result) => deposit_from_result,
        IcpResult::err(e) => {
            CK_USDC_STATE.with(|state| {
                state.borrow_mut().logs.add_log(
                    LogLevel::Error,
                    format!(
                        "Failed to call icpswap deposit_from ({:?}): {:?}",
                        deposit_from_args, e
                    ),
                );
            });

            return Err(Error::IcCdkError {
                message: format!("{:?}", e),
            });
        }
    };

    // Swap token
    let swap_args = SwapArgs {
        amount_in: deposit_amount.to_string(),
        amount_out_minimum: Nat::from(0 as u64).to_string(),
        zero_for_one: true,
    };

    let swap_result = swap(pool_canister_id, swap_args.clone())
        .await
        .map_err(|(_, message)| {
            CK_USDC_STATE.with(|state| {
                state.borrow_mut().logs.add_log(
                    LogLevel::Error,
                    format!(
                        "Failed to call icpswap swap ({:?}): {:?}",
                        swap_args, message
                    ),
                );
            });

            Error::IcCdkError { message }
        })?;

    let swapped_amount = match swap_result {
        IcpResult::ok(swap_result) => swap_result,
        IcpResult::err(e) => {
            CK_USDC_STATE.with(|state| {
                state.borrow_mut().logs.add_log(
                    LogLevel::Error,
                    format!("Failed to call icpswap swap ({:?}): {:?}", swap_args, e),
                );
            });

            return Err(Error::IcCdkError {
                message: format!("{:?}", e),
            });
        }
    };

    // Withdraw from pool
    let fee = get_fee(swap_token).await.map_err(|(_, message)| {
        CK_USDC_STATE.with(|state| {
            state.borrow_mut().logs.add_log(
                LogLevel::Error,
                format!("Failed to call get_fee ({:?}): {:?}", swap_token, message),
            );
        });

        Error::IcCdkError { message }
    })?;

    let withdraw_args = WithdrawArgs {
        token: swap_token.to_string(),
        amount: swapped_amount.clone(),
        fee: fee.clone(),
    };

    let withdraw_result = withdraw(pool_canister_id, withdraw_args.clone())
        .await
        .map_err(|(_, message)| {
            CK_USDC_STATE.with(|state| {
                state.borrow_mut().logs.add_log(
                    LogLevel::Error,
                    format!(
                        "Failed to call icpswap withdraw ({:?}): {:?}",
                        withdraw_args, message
                    ),
                );
            });

            Error::IcCdkError { message }
        })?;

    let withdraw_amount = match withdraw_result {
        IcpResult::ok(withdraw_result) => withdraw_result,
        IcpResult::err(e) => {
            CK_USDC_STATE.with(|state| {
                state.borrow_mut().logs.add_log(
                    LogLevel::Error,
                    format!(
                        "Failed to call icpswap withdraw ({:?}): {:?}",
                        withdraw_args, e
                    ),
                );
            });

            return Err(Error::IcCdkError {
                message: format!("{:?}", e),
            });
        }
    };

    // Transfer to merchant
    let transfer_args = TransferArg {
        amount: withdraw_amount.clone() + fee.clone(),
        fee: Some(fee),
        to: Account {
            owner: data.to_merchant.clone(),
            subaccount: None,
        },
        memo: Some(Memo::from(data.memo)),
        from_subaccount: None,
        created_at_time: None,
    };

    ic_cdk::call::<(TransferArg,), (core::result::Result<BlockIndex, TransferError>,)>(
        swap_token,
        "icrc1_transfer",
        (transfer_args.clone(),),
    )
    .await
    .map_err(|(_, message)| {
        CK_USDC_STATE.with(|state| {
            state.borrow_mut().logs.add_log(
                LogLevel::Error,
                format!(
                    "Failed to call icrc1_transfer ({:?}): {:?}",
                    transfer_args, message
                ),
            );
        });

        Error::IcCdkError { message }
    })?
    .0
    .map_err(|e| {
        CK_USDC_STATE.with(|state| {
            state.borrow_mut().logs.add_log(
                LogLevel::Error,
                format!(
                    "Failed to call icrc1_transfer ({:?}): {:?}",
                    transfer_args, e
                ),
            );
        });

        Error::IcCdkError {
            message: format!("{:?}", e),
        }
    })?;

    Ok(())
}
