use crate::websocket::{NoteContent, Notification, PaymentAction};
use crate::CPayment;
use ic_cdk::caller;

pub fn notify_about_promise(payment: CPayment, action_type: PaymentAction) {
    let mut receiver = payment.receiver.clone();
    if receiver == caller() {
        receiver = payment.sender.clone();
    }

    if let Some(mut old_note) = Notification::get(caller().to_text(), payment.id.clone()) {
        old_note.content = NoteContent::CPaymentContract(payment.clone(), action_type.clone());
        // if let NoteContent::CPaymentContract(old_payment, old_action_type) = old_note.content.clone() {
        //
        // }

        old_note.save();
    }
    // If we have an existing notification
    if let Some(mut old_note) = Notification::get(receiver.to_text().clone(), payment.id.clone()) {
        if let NoteContent::CPaymentContract(old_payment, old_action_type) = old_note.content.clone() {
            // Check if any relevant fields have changed
            let has_changes = payment.amount != old_payment.amount
                || payment.sender != old_payment.sender
                || payment.receiver != old_payment.receiver
                || payment.status != old_payment.status
                || payment.cells != old_payment.cells;

            // Only update notification if there are actual changes
            if has_changes {
                old_note.is_seen = false;
                old_note.content = NoteContent::CPaymentContract(payment.clone(), action_type.clone());
                old_note.time = ic_cdk::api::time() as f64;
                old_note.save();
            }
        }
    } else {

        // Create new notification if one doesn't exist
        let content = NoteContent::CPaymentContract(payment.clone(), action_type);
        let new_notification = Notification {
            id: payment.id.clone(),
            sender: caller(),
            receiver,
            content,
            is_seen: false,
            time: ic_cdk::api::time() as f64,
        };
        new_notification.save();
    }
}

