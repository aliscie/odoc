use std::collections::HashMap;
use std::fs::File;
use std::time::{SystemTime, UNIX_EPOCH};

use candid::{CandidType, Deserialize, Principal};

use crate::{USER_FILES};
use std::sync::atomic::{AtomicU64, Ordering};

static COUNTER: AtomicU64 = AtomicU64::new(0);

#[derive(Clone, Debug, Deserialize, CandidType)]
enum ColumnTypes {
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
struct Filter {
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
struct ColumnPermission {
    _type: PermissionType,
    granted_to: Vec<Principal>, // You can set the Principal to anonymous user (2vxsx-fae) to say any one have access. // also by setting the Principal to "2vxsx-fae" will empty the Vec in which the Vec will have only one item which is `["2vxsx-fae"]`
}

#[derive(Clone, Debug, Deserialize, CandidType)]
struct Column {
    name: String,
    _type: ColumnTypes,
    formula: Option<String>,
    filters: Vec<Filter>,
    permissions: Vec<ColumnPermission>,
}

#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct Table {
    columns: Vec<Column>,
    rows: Vec<Row>,
}

type ColumnName = String;
type TableCellValue = String;

#[derive(Clone, Debug, Deserialize, CandidType)]
struct Row {
    data: HashMap<ColumnName, TableCellValue>,
}
