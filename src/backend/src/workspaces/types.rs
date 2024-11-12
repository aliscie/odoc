use std::borrow::Cow;
use ic_cdk::caller;
use ic_websocket_cdk::{CanisterWsCloseResult, CanisterWsGetMessagesArguments, CanisterWsGetMessagesResult, CanisterWsMessageArguments, CanisterWsMessageResult, CanisterWsOpenArguments, CanisterWsOpenResult, WsHandlers, WsInitParams};
use crate::{ WORK_SPACES};
use num::ToPrimitive;


// use crate::state::{init_state, read_state};
use alloy_consensus::{SignableTransaction, TxEip1559, TxEnvelope};
use alloy_primitives::{hex, Signature, TxKind, U256};
use candid::{CandidType, Decode, Deserialize, Encode, Nat, Principal};
use evm_rpc_canister_types::{
    BlockTag, EthMainnetService, EthSepoliaService, EvmRpcCanister, GetTransactionCountArgs,
    GetTransactionCountResult, MultiGetTransactionCountResult, RequestResult, RpcService,
};
use ic_cdk::api::management_canister::ecdsa::{EcdsaCurve, EcdsaKeyId};
use ic_cdk::{init, update};
use ic_ethereum_types::Address;
use num::{BigUint, Num};
use std::str::FromStr;
use ic_stable_structures::Storable;
use ic_stable_structures::storable::Bound;

pub const EVM_RPC_CANISTER_ID: Principal =
    Principal::from_slice(b"7hfb6-caaaa-aaaar-qadga-cai");
// 7hfb6-caaaa-aaaar-qadga-cai
pub const EVM_RPC: EvmRpcCanister = EvmRpcCanister(EVM_RPC_CANISTER_ID);


#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct WorkSpace {
    pub id: String,
    pub name: String,
    pub chats: Vec<String>,
    pub files: Vec<String>,
    pub members: Vec<Principal>,
    pub admins: Vec<Principal>,
    pub creator: Principal,
}

#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct WorkSpaceVec {
    pub workspaces: Vec<WorkSpace>,
}


impl Storable for WorkSpaceVec {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl WorkSpace {
    pub fn new(name: String, id: String) -> Result<Self, String> {
        let new_work_space = WorkSpace {
            id,
            name: name.clone(),
            chats: vec![],
            files: vec![],
            members: vec![caller()],
            admins: vec![caller()],
            creator: caller(),
        };
        new_work_space.pure_save();
        Ok(new_work_space.clone())
    }

    pub fn get(name: String) -> Option<Self> {
        WORK_SPACES.with(|store| {
            let work_spaces = store.borrow();
            let all_workspaces: Vec<WorkSpace> = work_spaces.iter()
                .flat_map(|(_, ws_vec)| ws_vec.workspaces.clone())
                .collect();
            all_workspaces
                .into_iter()
                .find(|ws| ws.name == name)
        })
    }
    pub fn pure_save(&self) {
        WORK_SPACES.with(|store| {
            let mut work_spaces = store.borrow_mut();
            let mut ws_vec = work_spaces.get(&self.id).unwrap_or_else(|| WorkSpaceVec { workspaces: vec![] });
            ws_vec.workspaces.retain(|ws| ws.id != self.id);
            ws_vec.workspaces.push(self.clone());
            work_spaces.insert(self.id.clone(), ws_vec);
        });
    }
    pub fn delete(&self) -> Result<Self, String> {
        WORK_SPACES.with(|store| {
            let mut work_spaces = store.borrow_mut();
            if let Some(mut ws_vec) = work_spaces.get(&self.id) {
                ws_vec.workspaces.retain(|ws| ws.id != self.id);
                Ok(self.clone())
            } else {
                Err("Workspace not found".to_string())
            }
        })
    }


    pub fn save(&self) -> Result<Self, String> {
        // Get the existing workspace by ID
        let old_work_space = Self::get(self.id.clone());

        // Check if the caller is allowed to update this workspace
        if let Some(ref old_work_space) = old_work_space {
            if old_work_space.creator != caller() || !old_work_space.admins.contains(&caller()) {
                return Err("You are not allowed to update this workspace".to_string());
            }
        }

        // Access the WORK_SPACES and either update or insert
        self.pure_save();

        Ok(self.clone())
    }
}


pub fn estimate_transaction_fees() -> (u128, u128, u128) {
    /// Standard gas limit for an Ethereum transfer to an EOA.
    /// Other transactions, in particular ones interacting with a smart contract (e.g., ERC-20), would require a higher gas limit.
    const GAS_LIMIT: u128 = 21_000;

    /// Very crude estimates of max_fee_per_gas and max_priority_fee_per_gas.
    /// A real world application would need to estimate this more accurately by for example fetching the fee history from the last 5 blocks.
    const MAX_FEE_PER_GAS: u128 = 50_000_000_000;
    const MAX_PRIORITY_FEE_PER_GAS: u128 = 1_500_000_000;
    (GAS_LIMIT, MAX_FEE_PER_GAS, MAX_PRIORITY_FEE_PER_GAS)
}

#[derive(CandidType, Deserialize, Debug, Default, PartialEq, Eq)]
pub struct InitArg {
    pub ethereum_network: Option<EthereumNetwork>,
    pub ecdsa_key_name: Option<EcdsaKeyName>,
}

#[derive(CandidType, Deserialize, Debug, Default, PartialEq, Eq, Clone, Copy)]
pub enum EthereumNetwork {
    Mainnet,
    #[default]
    Sepolia,
}

impl EthereumNetwork {
    pub fn chain_id(&self) -> u64 {
        match self {
            EthereumNetwork::Mainnet => 1,
            EthereumNetwork::Sepolia => 11155111,
        }
    }
}

#[derive(CandidType, Deserialize, Debug, Default, PartialEq, Eq, Clone)]
pub enum EcdsaKeyName {
    #[default]
    TestKeyLocalDevelopment,
    TestKey1,
    ProductionKey1,
}

impl From<&EcdsaKeyName> for EcdsaKeyId {
    fn from(value: &EcdsaKeyName) -> Self {
        EcdsaKeyId {
            curve: EcdsaCurve::Secp256k1,
            name: match value {
                EcdsaKeyName::TestKeyLocalDevelopment => "dfx_test_key",
                EcdsaKeyName::TestKey1 => "test_key_1",
                EcdsaKeyName::ProductionKey1 => "key_1",
            }
                .to_string(),
        }
    }
}

pub fn validate_caller_not_anonymous() -> Principal {
    let principal = ic_cdk::caller();
    if principal == Principal::anonymous() {
        panic!("anonymous principal is not allowed");
    }
    principal
}

pub fn nat_to_u64(nat: Nat) -> u64 {
    nat.0
        .to_u64()
        .unwrap_or_else(|| ic_cdk::trap(&format!("Nat {} doesn't fit into a u64", nat)))
}

pub fn nat_to_u256(value: Nat) -> U256 {
    let value_bytes = value.0.to_bytes_be();
    assert!(
        value_bytes.len() <= 32,
        "Nat does not fit in a U256: {}",
        value
    );
    let mut value_u256 = [0u8; 32];
    value_u256[32 - value_bytes.len()..].copy_from_slice(&value_bytes);
    U256::from_be_bytes(value_u256)
}

