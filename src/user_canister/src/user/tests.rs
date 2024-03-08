// use candid::{encode_one, Principal};
// use ic_cdk::api::management_canister::main::CanisterId;
// use pocket_ic::PocketIc;
//
//  #[test]
//  fn test_counter_canister() {
//     let pic = PocketIc::new();
//     // Create an empty canister as the anonymous principal and add cycles.
//     // let canister_id = pic.create_canister();
//     // pic.add_cycles(canister_id, 2_000_000_000_000);
//
//     // let wasm_bytes = load_counter_wasm("/Users/ahmed/Desktop/odoc/target/wasm32-unknown-unknown/release/user_canister.wasm");
//     // pic.install_canister(canister_id, wasm_bytes, vec![], None);
//     // // 'inc' is a counter canister method.
//     // call_counter_canister(&pic, canister_id, "inc");
//     // // Check if it had the desired effect.
//     // let reply = call_counter_canister(&pic, canister_id, "read");
//     // assert_eq!(reply, WasmResult::Reply(vec![0, 0, 0, 1]));
//  }
//
// // fn call_counter_canister(pic: &PocketIc, canister_id: CanisterId, method: &str) -> WasmResult {
// //     pic.update_call(canister_id, Principal::anonymous(), method, encode_one(()).unwrap())
// //         .expect("Failed to call counter canister")
// // }
