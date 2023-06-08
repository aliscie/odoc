
mod user {
    use ic_cdk::export::candid::{CandidType, Principal, Nat};
    use ic_cdk::{api, update};
    use serde::{Deserialize};

    #[derive(CandidType, Clone, Deserialize)]
    struct CanisterSettings {
        controllers: Option<Vec<Principal>>,
        compute_allocation: Option<Nat>,
        memory_allocation: Option<Nat>,
        freezing_threshold: Option<Nat>,
    }

    #[derive(CandidType, Clone, Deserialize)]
    struct CreateCanisterArgs<T> {
        cycles: T,
        settings: CanisterSettings,
    }

    #[derive(CandidType, Deserialize)]
    struct CreateCanisterResult {
        canister_id: Principal,
    }

    #[update(name = "user_create_canister")]
    async fn create_canister(
        CreateCanisterArgs { cycles, settings}: CreateCanisterArgs<u64>
    ) -> Result<CreateCanisterResult, String> {
        create_canister128(CreateCanisterArgs {
            cycles: cycles as u128,
            settings,
        }).await
    }

    #[update(name = "user_create_canister128")]
    async fn create_canister128(
        mut args: CreateCanisterArgs<u128>,
    ) -> Result<CreateCanisterResult, String> {
        let mut settings = args.settings;
        let mut controllers = settings.controllers.unwrap_or(vec![]);
        if controllers.is_empty() {
            controllers.push(ic_cdk::api::caller());
            controllers.push(ic_cdk::api::id());
        }
        settings.controllers = Some(controllers.clone());
        args.settings = settings;
        let create_canister_result = create_canister_call(args).await?;

        Ok(create_canister_result)
    }

    async fn create_canister_call(args: CreateCanisterArgs<u128>) -> Result<CreateCanisterResult, String> {
        #[derive(CandidType)]
        struct CreateCanisterArgument {
            settings: Option<CanisterSettings>,
        }

        let create_canister_arg = CreateCanisterArgument {
            settings: Some(args.settings),
        };

        let (create_result,): (CreateCanisterResult,) = match api::call::call_with_payment128(
            Principal::management_canister(),
            "create_canister",
            (create_canister_arg,),
            args.cycles,
        )
        .await {
            Ok(r) => r,
            Err((code, msg)) => return Err(format!("Error while creating a canister: {}: {}", code as u8, msg)),
        };

        Ok(create_result)
    }
}