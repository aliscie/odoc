use std::collections::HashMap;
use std::fs::File;
use std::time::{SystemTime, UNIX_EPOCH};

use candid::{CandidType, Deserialize};

use crate::{USER_FILES};
use std::sync::atomic::{AtomicU64, Ordering};

static COUNTER: AtomicU64 = AtomicU64::new(0);

#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct ContentNode {
    pub id: u64,
    pub parent: Option<u64>,
    pub _type: String,
    pub text: String,
    #[serde(default)]
    pub children: Vec<u64>,
}

impl ContentNode {

}
