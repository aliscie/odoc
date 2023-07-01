use std::collections::HashMap;
use std::fs::File;
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

use candid::{CandidType, Deserialize, Principal};

use crate::contracts::Contract;
use crate::storage_schema::ContractId;
use crate::{Payment, USER_FILES};

static COUNTER: AtomicU64 = AtomicU64::new(0);

#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize)]
pub enum ColumnTypes {
    Text,
    Number,
    Date,
    File,
    Person,
    Tag,
    Category,
}

#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize)]
enum Operation {
    BiggerOrEqual,
    Bigger,
    Equal,
    Contains,
}

#[derive(Eq, PartialEq, PartialOrd, Clone, Debug, CandidType, Deserialize)]
pub struct Filter {
    name: String,
    formula: Option<String>,
    operations: Vec<Operation>,
}

#[derive(Eq, PartialEq, PartialOrd, Clone, Debug, CandidType, Deserialize)]
enum PermissionType {
    CanUpdate,
    CanRead,
}

#[derive(Eq, PartialEq, PartialOrd, Clone, Debug, CandidType, Deserialize)]
pub struct ColumnPermission {
    _type: PermissionType,
    granted_to: Vec<Principal>, // You can set the Principal to anonymous user (2vxsx-fae) to say any one have access. // also by setting the Principal to "2vxsx-fae" will empty the Vec in which the Vec will have only one item which is `["2vxsx-fae"]`
}

#[derive(Eq, PartialEq, PartialOrd, Clone, Debug, CandidType, Deserialize)]
enum Trigger {
    Timer,
    Update,
}

#[derive(Eq, PartialEq, PartialOrd, Clone, Debug, CandidType, Deserialize)]
enum Execute {
    // TransferToken(TransferToken)
    TransferToken,
    TransferUsdt,
    TransferNft,
}

#[derive(Eq, PartialEq, PartialOrd, Clone, Debug, CandidType, Deserialize)]
pub struct Formula {
    trigger: Trigger,
    trigger_target: String,
    operation: Operation,
    execute: Execute,
}

#[derive(Eq, PartialEq, PartialOrd, Clone, Debug, CandidType, Deserialize)]
pub struct Column {
    pub(crate) editable: bool,
    pub(crate) field: String,
    pub(crate) _type: ColumnTypes,
    pub(crate) formula: Option<Formula>,
    pub(crate) dataValidator: Option<String>,
    pub(crate) filters: Vec<Filter>,
    pub(crate) permissions: Vec<ColumnPermission>,
}

impl Column {
    pub fn new(field: String, _type: ColumnTypes) -> Self {
        Column {
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

#[derive(Eq, PartialEq, Clone, Debug, CandidType, Deserialize)]
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

#[derive(Eq, PartialEq, Clone, Debug, CandidType, Deserialize)]
pub struct Row {
    contract: Option<Contract>,
    pub(crate) cells: Option<HashMap<ColumnName, TableCellValue>>,
    pub(crate) requests: Option<Contract>,
}


impl Row {
    pub fn new_payment(payment: Payment) -> Self {
        Row {
            contract: Option::from(Contract::PaymentContract(payment.get_contract_id())),
            cells: None,
            requests: None,
        }
    }
}
// pub enum Row {
//     Contract(Contract),
//     NormalCell(HashMap<ColumnName, TableCellValue>), // TODO this is for norma cells, for example you can add more colulmns for a note, or adtional data like users age, lastname etc.
//     // Request(HashMap<ColumnName, TableCellValue>), // TODO people can request, change, or add contract and this request will show in form of a comment on the table.
// }

