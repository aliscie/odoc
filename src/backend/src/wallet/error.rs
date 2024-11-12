use candid::{CandidType, Nat};
use serde::{Deserialize, Serialize};

pub type USDCResult<T> = core::result::Result<T, Error>;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum Error {
    // --- Owner errors
    Forbidden,
    OwnerAlreadyExists,
    OwnerNotFound,

    // --- Swap errors
    SwapAlreadyExists,
    SwapNotFound,

    // --- Pay errors
    InsufficientAllowance { allowance: Nat },
    InsufficientBalance { balance: Nat },
    SwapTokenNotFound,
    AmountTooSmall,

    // --- IC CDK errors
    IcCdkError { message: String },

    // --- Input errors
    InvalidPrincipal,
}

// region:    --- Error Boilerplate

impl core::fmt::Display for Error {
    fn fmt(&self, fmt: &mut core::fmt::Formatter) -> core::result::Result<(), core::fmt::Error> {
        write!(fmt, "{self:?}")
    }
}

impl std::error::Error for Error {}

// endregion: --- Error Boilerplate
