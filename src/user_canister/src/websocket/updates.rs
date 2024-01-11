use ic_cdk_macros::update;
use crate::websocket::Notification;


#[update]
fn notification_seen(id: String) -> Result<(), String> {
    let n = Notification::get(id);
    if let Some(n) = n {
        n.seen()
    } else {
        return Err("Notification not found".to_string());
    }
    Ok(())
}

#[update]
fn clear_notifications() {
    Notification::clear();
}

#[update]
fn delete_notification(id: String) -> Result<(), String> {
    let n = Notification::get(id);
    if let Some(n) = n {
        n.delete();
        Ok(())
    } else {
         Err("Notification not found".to_string())
    }
}