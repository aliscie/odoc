pub mod handlers;

pub use handlers::*;


use ic_cdk_macros::*;
use ic_websocket_cdk::{CanisterWsCloseArguments, CanisterWsCloseResult, CanisterWsGetMessagesArguments, CanisterWsGetMessagesResult, CanisterWsMessageArguments, CanisterWsMessageResult, CanisterWsOpenArguments, CanisterWsOpenResult, WsHandlers, WsInitParams};

use handlers::{on_close, on_message, on_open};
use crate::CLIENTS_CONNECTED;
// use crate::handlers::{AppMessage, send_app_message};

// mod canister;


// Paste here the principal of the gateway obtained when running the gateway
pub const GATEWAY_PRINCIPAL: &str = "y5hie-mg67p-324c7-bou5z-gat35-je6vp-4fn2j-6wktj-d3l25-ft42h-cqe";

#[init]
fn init() {
    let handlers = WsHandlers {
        on_open: Some(on_open),
        on_message: Some(on_message),
        on_close: Some(on_close),
    };

    let params = WsInitParams::new(handlers, String::from(GATEWAY_PRINCIPAL));

    ic_websocket_cdk::init(params);
}

#[post_upgrade]
fn post_upgrade() {
    init();
}

// method called by the client to open a WS connection to the canister (relayed by the WS Gateway)
#[update]
fn ws_open(args: CanisterWsOpenArguments) -> CanisterWsOpenResult {
    ic_websocket_cdk::ws_open(args)
}

// method called by the Ws Gateway when closing the IcWebSocket connection for a client
#[update]
fn ws_close(args: CanisterWsCloseArguments) -> CanisterWsCloseResult {
    ic_websocket_cdk::ws_close(args)
}

// method called by the client to send a message to the canister (relayed by the WS Gateway)
#[update]
fn ws_message(args: CanisterWsMessageArguments, msg_type: Option<AppMessage>) -> CanisterWsMessageResult {
    ic_websocket_cdk::ws_message(args, msg_type)
}
// method called by the WS Gateway to get messages for all the clients it serves
#[query]
fn ws_get_messages(args: CanisterWsGetMessagesArguments) -> CanisterWsGetMessagesResult {
    ic_websocket_cdk::ws_get_messages(args)
}

// send a message with a text input
#[update]
fn send_message(text: String) {
    let client_principal = CLIENTS_CONNECTED.with(|clients_connected| {
        let clients_connected = clients_connected.borrow();
        clients_connected.keys().last().unwrap().clone()
    });

    let msg: AppMessage = AppMessage {
        text,
        timestamp: 0,
    };
    send_app_message(client_principal, msg);
}

