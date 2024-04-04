use candid::Error::Custom;
use ic_cdk::caller;
use ic_cdk_macros::update;

use crate::{CPayment, PaymentStatus, Wallet};
use crate::CustomContract;
use crate::user_history::UserHistory;
use crate::websocket::{NoteContent, Notification, PaymentAction};

// #[update]
// fn release_c_payment(c_payment: CPayment) -> Result<(), String> {
//     if self.promises.contains(&c_payment) {
//         c_payment.clone().pay();
//         self.promises.retain(|payment| payment.id != c_payment.id);
//         self.payments.push(c_payment);
//         self.clone().save()?;
//         Ok(())
//     } else {
//         Err("Payment not found".to_string())
//     }
// }
#[update]
fn confirmed_c_payment(promise: CPayment) -> Result<(), String> {
    if let Some(mut contract) = CustomContract::get_for_user(promise.contract_id, promise.sender) {
        contract.promises = contract.promises.iter_mut().map(|mut payment| {
            if payment.id == promise.id && payment.receiver == caller() && payment.status == PaymentStatus::None {
                payment.status = PaymentStatus::Confirmed;
                // update not
                let mut not = Notification::get(payment.id.clone()).unwrap();
                if let NoteContent::CPaymentContract(_, payment_action) = not.content {
                    not.content = NoteContent::CPaymentContract(payment.clone(), payment_action);
                    not.save();
                };
                // let wallet = Wallet::get(promise.sender);
                // wallet.add_dept(payment.amount.clone(), payment.id.clone());
                let mut user_history = UserHistory::get(promise.sender);
                user_history.payment_action(payment.clone());
                user_history.save();
            }
            payment.clone()
        }).collect::<Vec<_>>();

        // Check if any promise with matching ID and status was updated
        if contract.promises.iter().any(|payment| payment.id == promise.id && payment.status == PaymentStatus::Confirmed) {
            contract.pure_save()?;
            Ok(())
        } else {
            Err("Promise not found or conditions not met".to_string())
        }
    } else {
        Err("Contract not found".to_string())
    }
}


#[update]
fn confirmed_cancellation(c_payment: CPayment) -> Result<(), String> {
    if let Some(mut contract) = CustomContract::get_for_user(c_payment.contract_id, c_payment.sender) {
        contract.promises = contract.promises.iter_mut().map(|payment| {
            if payment.id == c_payment.id && payment.receiver == caller() && (payment.status != PaymentStatus::Released || payment.status != PaymentStatus::ConfirmedCancellation) {
                payment.status = PaymentStatus::ConfirmedCancellation;
                let mut not = Notification::get(payment.id.clone()).unwrap();
                if let NoteContent::CPaymentContract(_, payment_action) = not.content {
                    not.content = NoteContent::CPaymentContract(payment.clone(), payment_action);
                    not.save();
                };
                let wallet = Wallet::get(c_payment.sender);
                wallet.remove_dept(payment.id.clone());

                let mut user_history = UserHistory::get(c_payment.sender);
                user_history.confirm_cancellation(payment.clone());
                user_history.save()
            }
            payment.clone()
        }).collect();

        contract.pure_save()?;
        Ok(())
    } else {
        Err("Contract not found".to_string())
    }
}


#[update]
fn approve_high_promise(c_payment: CPayment) -> Result<(), String> {
    if let Some(mut contract) = CustomContract::get_for_user(c_payment.contract_id, c_payment.sender) {
        contract.promises = contract.promises.iter_mut().map(|payment| {
            if payment.id == c_payment.id && payment.receiver == caller() && payment.status == PaymentStatus::HighPromise {
                payment.status = PaymentStatus::ApproveHighPromise;
                let mut not = Notification::get(payment.id.clone()).unwrap();
                if let NoteContent::CPaymentContract(_, payment_action) = not.content {
                    not.content = NoteContent::CPaymentContract(payment.clone(), payment_action);
                    not.save();
                };
                let wallet = Wallet::get(c_payment.sender);
                wallet.add_dept(payment.amount.clone(), payment.id.clone());
                // wallet.remove_dept(payment.id.clone());
                let mut user_history = UserHistory::get(c_payment.sender);
                user_history.payment_action(payment.clone());
            }
            payment.clone()
        }).collect();

        contract.pure_save()?;
        Ok(())
    } else {
        Err("Contract not found".to_string())
    }
}

#[update]
fn object_on_cancel(c_payment: CPayment, reason: String) -> Result<(), String> {
    if let Some(mut contract) = CustomContract::get_for_user(c_payment.contract_id, c_payment.sender) {
        contract.promises = contract.promises.iter_mut().map(|payment| {
            if payment.id == c_payment.id && payment.receiver == caller() {
                payment.status = PaymentStatus::Objected(reason.clone());
                let mut not = Notification::get(payment.id.clone()).unwrap();
                if let NoteContent::CPaymentContract(_, payment_action) = not.content {
                    not.content = NoteContent::CPaymentContract(payment.clone(), payment_action);
                    not.save();
                };
                let wallet = Wallet::get(c_payment.sender);
                wallet.add_dept(payment.amount.clone(), payment.id.clone());

                let mut user_history = UserHistory::get(c_payment.sender);
                user_history.payment_action(payment.clone());
                user_history.save()
            }
            payment.clone()
        }).collect();

        contract.pure_save()?;
        Ok(())
    } else {
        Err("Contract not found".to_string())
    }
}

#[update]
fn delete_custom_contract(id: String) -> Result<(), String> {
    let contract = CustomContract::get(&id, &caller());
    if let Some(contract) = contract {
        return contract.delete();
    }
    Err("Not found".to_string())
}

