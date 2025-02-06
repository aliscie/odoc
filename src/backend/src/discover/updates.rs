use std::time::{Duration, SystemTime};
// use std::sync::atomic::Ordering;
// use candid::Principal;
use ic_cdk::caller;
use ic_cdk_macros::update;

use crate::discover::Post;

// Move it to util
pub fn time_diff(current: u64, created: u64) -> Duration {
    let date_created_duration = Duration::from_nanos(created);
    let current_time_duration = Duration::from_nanos(current);

    if current_time_duration >= date_created_duration {
        current_time_duration - date_created_duration
    } else {
        Duration::from_secs(0)
    }
}

#[update]
fn save_post(mut post: Post) -> Result<(), String> {
    if caller().to_string() == *"2vxsx-fae" {
        return Err("Anonymous users not allowed to create posts".to_string());
    }

    let original_post = Post::get(post.id.clone());

    if post.is_comment {
        // Handle comment
        let parent_post = Post::get(post.parent.clone())
            .map_err(|_| "Parent post not found".to_string())?;

        let mut updated_parent = parent_post.clone();
        updated_parent.children.push(post.id.clone());
        updated_parent.save();
    }

    if let Ok(p) = original_post.clone() {
        post.votes_up = p.votes_up;
        post.votes_down = p.votes_down;
        post.date_created = p.date_created.clone();
    } else {
        let posts = Post::get_latest_posts();
        post.date_created = ic_cdk::api::time();

        if posts.len() >= 2 {
            let one_day = 86400;
            let diff = time_diff(
                ic_cdk::api::time(),
                posts.last().unwrap().date_created.clone(),
            );

            // if diff < Duration::from_secs(one_day.clone()) {
            //     let hours = &one_day - diff.as_secs();
            //     let remainder = (one_day - diff.as_secs()) % 3600;
            //     let msg = format!(
            //         "please wait {} hours and {} minutes",
            //         hours / 3600,
            //         remainder / 60
            //     );
            //     return Err(msg);
            // }
        }
        post.votes_up = vec![];
        post.votes_down = vec![];
        post.date_created = ic_cdk::api::time();
    }

    post.creator = caller().to_string();
    post.save();
    Ok(())
}

#[update]
fn delete_post(id: String) -> Result<(), String> {
    let post = Post::get(id.clone())?;
    if post.creator != caller().to_string() {
        return Err("Only the post creator can delete this.".to_string());
    }

    // Recursively delete all children
    fn delete_children(post_id: String) -> Result<(), String> {
        if let Ok(post) = Post::get(post_id.clone()) {
            for child_id in post.children.clone() {
                delete_children(child_id)?;
            }
            Post::delete(post_id)?;
        }
        Ok(())
    }

    delete_children(id)
}

#[update]
fn vote_up(id: String) -> Result<Post, String> {
    let mut post = Post::get(id.clone())?;
    if caller().to_string() == post.creator {
        return Err("You can't vote on your own post".to_string());
    }
    if post.votes_up.contains(&caller()) {
        return Err("You have already voted on this post.".to_string());
    }

    post.votes_up.push(caller());
    if post.votes_down.contains(&caller()) {
        post.votes_down.retain(|x| x != &caller());
    }
    post.save();

    Ok(post)
}

#[update]
fn vote_down(id: String) -> Result<Post, String> {
    let mut post = Post::get(id.clone())?;
    if caller().to_string() == post.creator {
        return Err("You can't vote on your own post".to_string());
    }
    if post.votes_down.contains(&caller()) {
        return Err("You have already voted on this post.".to_string());
    }
    post.votes_down.push(caller());
    if post.votes_up.contains(&caller()) {
        post.votes_up.retain(|x| x != &caller());
    }
    post.save();
    // let content: NoteContent = NoteContent::PostVote(id.clone());
    // let new_note = Notification {
    //     id: COUNTER.fetch_add(1, Ordering::SeqCst).to_string(),
    //     sender: caller(),
    //     receiver: Principal::from_text("2vxsx-fae").unwrap(),
    //     content,
    //     is_seen: false,
    // };
    // new_note.send();
    // Send to everyone
    // TODO in the frontend connect two websockts
    //  1. with the user principal
    //  2. with the `2vxsx-fae` principal
    Ok(post)
}


#[update]
fn unvote(id: String) -> Result<Post, String> {
    let mut post = Post::get(id.clone())?;
    if caller().to_string() == post.creator {
        return Err("You can't vote on your own post".to_string());
    }
    post.votes_up.retain(|x| x != &caller());
    post.votes_down.retain(|x| x != &caller());
    // if post.votes_down.contains(&caller()) {
    //     return Err("You have already voted on this post.".to_string());
    // }
    // post.votes_down.push(caller());
    // if post.votes_up.contains(&caller()) {
    //     post.votes_up.retain(|x| x != &caller());
    // }
    post.save();
    // let content: NoteContent = NoteContent::PostVote(id.clone());
    // let new_note = Notification {
    //     id: COUNTER.fetch_add(1, Ordering::SeqCst).to_string(),
    //     sender: caller(),
    //     receiver: Principal::from_text("2vxsx-fae").unwrap(),
    //     content,
    //     is_seen: false,
    // };
    // new_note.send();
    // Send to everyone
    // TODO in the frontend connect two websockts
    //  1. with the user principal
    //  2. with the `2vxsx-fae` principal
    Ok(post)
}
