use ic_cdk::caller;
use crate::CPayment;
use crate::websocket::{NoteContent, Notification, PaymentAction};

pub fn notify_about_promise(payment: CPayment, _type: PaymentAction) {
    if let Some(mut old_note) = Notification::get(payment.id.clone()) {
        if let NoteContent::CPaymentContract(old_payment, _) = old_note.content.clone() {
            if old_payment != payment {
                old_note.is_seen = false;
                old_note.save();
            }
        }
    } else {
        let content = NoteContent::CPaymentContract(payment.clone(), _type);
        let new_notification = Notification {
            id: payment.id.clone(),
            sender: caller(),
            receiver: payment.receiver.clone(),
            content,
            is_seen: false,
            time: ic_cdk::api::time() as f64,
        };
        new_notification.save();
    }
}


