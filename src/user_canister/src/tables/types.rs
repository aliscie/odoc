use std::collections::HashMap;

use std::sync::atomic::{AtomicU64, Ordering};


use candid::{CandidType, Deserialize, Principal};

use crate::contracts::Contract;

use crate::{CColumn, CPayment, PaymentContract};
use serde::Serialize;

static COUNTER: AtomicU64 = AtomicU64::new(0);

#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, CandidType, Serialize, Deserialize)]
pub enum ColumnTypes {
    Text,
    Number,
    Date,
    File,
    Person,
    Tag,
    Category,
}

#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, CandidType, Serialize, Deserialize)]
enum Operation {
    BiggerOrEqual,
    Bigger,
    Equal,
    Contains,
}

#[derive(Eq, PartialEq, PartialOrd, Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct Filter {
    name: String,
    formula: Option<String>,
    operations: Vec<Operation>,
}

#[derive(Eq, PartialEq, PartialOrd, Clone, Debug, CandidType, Serialize, Deserialize)]
pub enum PermissionType {
    Edit(Principal),
    View(Principal),
    AnyOneEdite,
    AnyOneView,
}

// #[derive(PartialEq, PartialOrd, Clone, Debug, CandidType, Serialize, Deserialize)]
// pub enum Trigger {
//     Timer(f64),
//     //  f64 is time in nanoseconds from ic_cdk::api::time()
//     Update(String),
//     // String ==  column id
// }

#[derive(PartialEq, PartialOrd, Clone, Debug, CandidType, Serialize, Deserialize)]
pub enum Execute {
    // TransferToken(TransferToken)
    TransferToken,
    TransferUsdt(CPayment),
    TransferNft,
}

#[derive(PartialEq, PartialOrd, Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct Formula {
    pub column_id: String,
    // pub trigger: Trigger,
    // pub trigger_target: String,
    // trigger_target is date like 2021-01-01 or column name
    // pub operation: Operation,
    pub execute: Execute,
}

#[derive(PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct Column {
    pub id: String,
    pub(crate) editable: bool,
    pub(crate) field: String,
    pub(crate) _type: ColumnTypes,
    pub(crate) formula: Option<Formula>,
    pub(crate) dataValidator: Option<String>,
    pub(crate) filters: Vec<Filter>,
    pub(crate) permissions: Vec<PermissionType>,
}

impl Column {
    pub fn new(field: String, _type: ColumnTypes) -> Self {
        Column {
            id: COUNTER.fetch_add(1, Ordering::SeqCst).to_string(),
            editable: true,
            field,
            _type,
            formula: None,
            dataValidator: None,
            filters: Vec::new(),
            permissions: Vec::new(),
        }
    }
}

type ColumnName = String;
type TableCellValue = String;

#[derive(PartialEq, Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct Table {
    pub(crate) columns: Vec<Column>,
    pub(crate) rows: Vec<Row>,
}

impl Table {
    pub fn new() -> Self {
        Table {
            columns: Vec::new(),
            rows: Vec::new(),
        }
    }
}

#[derive(Eq, PartialEq, Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct Row {
    pub id: String,
    contract: Option<Contract>,
    pub(crate) cells: Option<HashMap<ColumnName, TableCellValue>>,
}


