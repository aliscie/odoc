use candid::{encode_one, Principal};
use ic_cdk::api::management_canister::main::CanisterId;
// use pocket_ic::PocketIc;

// #[cfg(test)]
// mod tests {
//     use std::collections::HashMap;
//     use crate::PaymentContract;
//     use ring;
//     use rand;
//     use candid;
//     use rand::{CryptoRng, RngCore, SeedableRng};
//     use ic_cdk::api::call::call;
//     use ic_cdk::api::trap;
//
//
//
//     //
//     // pub fn create_test_identity() -> candid::Principal {
//     //     let mut ed25519_seed = [0u8; 32];
//     //     rand::thread_rng().fill(&mut ed25519_seed);
//     //
//     //     let public_key = ring::signature::Ed25519KeyPair::from_seed_unchecked(&ed25519_seed)
//     //         .unwrap()
//     //         .public_key()
//     //         .as_ref()
//     //         .to_vec();
//     //
//     //     candid::Principal::self_authenticating(&public_key)
//     // }
//
//     pub async fn create_test_identity<T: SeedableRng + CryptoRng>() -> T
//         where
//         // raw_rand returns 32 bytes
//             T: SeedableRng<Seed=[u8; 32]>,
//     {
//         let raw_rand: Vec<u8> = match call(candid::Principal::management_canister(), "raw_rand", ()).await {
//             Ok((res, )) => res,
//             Err((_, err)) => trap(&format!("failed to get seed: {}", err)),
//         };
//
//
//         let seed: <T as SeedableRng>::Seed = raw_rand[..].try_into().unwrap_or_else(|_| {
//             trap(&format!(
//                 "when creating seed from raw_rand output, expected raw randomness to be of length 32, got {}",
//                 raw_rand.len()
//             ));
//         });
//
//
//         T::from_seed(seed)
//     }
//
//
//     #[test]
//     async fn test_one() {
//         let payment: PaymentContract = PaymentContract {
//             contract_id: "ContractId".to_string(),
//             receiver:  create_test_identity().await,
//             sender: create_test_identity().await,
//             amount: 10,
//             canceled: false,
//             released: false,
//             confirmed: false,
//             extra_cells: HashMap::new(),
//         };
//
//         // PaymentContract::update_or_create(caller(), payment.clone())?;
//     }
// }