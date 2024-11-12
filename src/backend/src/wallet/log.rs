use candid::CandidType;
use ic_cdk::api::time;
use serde::{Deserialize, Serialize};

#[derive(CandidType, Default, Serialize, Deserialize)]
pub struct Logs(pub Vec<Log>);

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum LogLevel {
    Info,
    Debug,
    Error,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Log {
    pub level: LogLevel,
    pub message: String,
    pub timestamp: u64,
}

impl Logs {
    pub fn add_log(&mut self, level: LogLevel, message: String) {
        self.0.insert(
            0,
            Log {
                level,
                message,
                timestamp: time(),
            },
        );
    }

    pub fn get_logs(&self, start: Option<usize>, length: Option<usize>) -> Vec<Log> {
        let start = start.unwrap_or(0);
        let length = length.unwrap_or(self.0.len());
        self.0[start..start + length].to_vec()
    }
}
