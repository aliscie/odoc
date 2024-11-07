use std::borrow::Cow;
use std::collections::{HashMap};


use candid::{CandidType, Decode, Deserialize, Encode, Principal};
use ic_cdk::{caller};
use serde::Serialize;
use ic_stable_structures::{
    storable::Bound, DefaultMemoryImpl, StableBTreeMap, Storable,
};
use crate::{CONTRACTS_STORE, CustomContract};

use crate::storage_schema::ContractId;
use crate::tables::Table;


#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, CandidType, Serialize, Deserialize)]
pub enum Contract {
    SharesContract(ContractId),
    // CustomContract(Table),
}

#[derive(PartialEq, Clone, Debug, CandidType, Deserialize)]
pub enum StoredContract {
    // SharesContract(SharesContract),
    CustomContract(CustomContract),
}

#[derive(Clone, Debug, Default, CandidType, Deserialize)]
pub struct StoredContractVec {
    pub stored_contracts: Vec<StoredContract>,
}


impl Storable for StoredContractVec {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap_or_else(|e| {
            ic_cdk::trap(&format!("Failed to encode StoredContractVec: {:?}", e));
        }))
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap_or_else(|e| {
            ic_cdk::trap(&format!("Failed to decode StoredContractVec: {:?}", e));
        })
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: 999999,
        is_fixed_size: false,
    };
}

impl Contract {
    pub fn get_all_contracts() -> Option<HashMap<ContractId, StoredContract>> {
        let mut contract_map = HashMap::new();

        CONTRACTS_STORE.with(|contracts_store| {
            let caller_contracts = contracts_store.borrow();
            if let Some(contracts) = caller_contracts.get(&caller().to_string()) {
                for contract in contracts.stored_contracts.iter() {
                    if let StoredContract::CustomContract(custom_contract) = contract {
                        contract_map.insert(custom_contract.id.clone(), StoredContract::CustomContract(custom_contract.check_view_permission()));
                    }
                }
            }


        });
        Some(contract_map)
    }

    pub fn get_contract(author: String, contract_id: String) -> Option<StoredContract> {
        CONTRACTS_STORE.with(|contracts_store| {
            let caller_contracts = contracts_store.borrow();
            let stored_contract_vec = caller_contracts.get(&author)?.stored_contracts.clone();

            // Convert Vec<StoredContract> to HashMap<ContractId, StoredContract>
            let mut contract_map = HashMap::new();
            for (index, contract) in stored_contract_vec.into_iter().enumerate() {
                contract_map.insert(index.to_string(), contract);
            }

            let contract = contract_map.get(&contract_id)?.clone();
            if let StoredContract::CustomContract(custom_contract) = contract {
                return Some(StoredContract::CustomContract(custom_contract.check_view_permission()));
            }
            Some(contract.clone())
        })
    }
}
