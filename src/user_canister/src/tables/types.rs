use std::collections::HashMap;
use std::fs::File;
use std::time::{SystemTime, UNIX_EPOCH};

use candid::{CandidType, Deserialize, Principal};

use crate::{USER_FILES};
use std::sync::atomic::{AtomicU64, Ordering};

static COUNTER: AtomicU64 = AtomicU64::new(0);

#[derive(Clone, Debug, Deserialize, CandidType)]
pub enum ColumnTypes {
    Text,
    Number,
    Date,
    File,
    Person,
    Tag,
    Category,
}

#[derive(Clone, Debug, Deserialize, CandidType)]
enum Operation {
    BiggerOrEqual,
    Bigger,
    Equal,
    Contains,
}

#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct Filter {
    name: String,
    formula: Option<String>,
    operations: Vec<Operation>,
}

#[derive(Clone, Debug, Deserialize, CandidType)]
enum PermissionType {
    CanUpdate,
    CanRead,
}

#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct ColumnPermission {
    _type: PermissionType,
    granted_to: Vec<Principal>, // You can set the Principal to anonymous user (2vxsx-fae) to say any one have access. // also by setting the Principal to "2vxsx-fae" will empty the Vec in which the Vec will have only one item which is `["2vxsx-fae"]`
}

#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct Column {
    pub(crate) field: String,
    pub(crate) _type: ColumnTypes,
    pub(crate) formula: Option<String>,
    pub(crate) filters: Vec<Filter>,
    pub(crate) permissions: Vec<ColumnPermission>,
}

type ColumnName = String;
type TableCellValue = String;

#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct Table {
    pub(crate) columns: Vec<Column>,
    pub(crate) rows: Vec<HashMap<ColumnName, TableCellValue>>,
}
// pub struct TabelCell{
//     id: u64,
//     value: String,
//     column:u64,
//     row:u64,
// }

// #[derive(Clone, Debug, Deserialize, CandidType)]
// pub struct Row {
//     pub(crate) data: HashMap<ColumnName, TableCellValue>,
// }
