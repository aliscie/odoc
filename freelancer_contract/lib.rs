struct TableRow {
    users: Principal,
    amount: u64,
    release: bool,
}

struct FreelancerContract {
    id: Principal,
    title: string,
    description: string,
    contract: vec<TableRow>,
}

#[ic_cdk::update]
fn release(id: Principal) -> String {
    let data = data.get(id).contract.get(0);
    data.release = true;
    ic_web.get_wallet(data.user).transfer(data.amount);
    commitStaticChange(data)
}
