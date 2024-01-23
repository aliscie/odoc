use std::time::{Duration, SystemTime};
// use std::sync::atomic::Ordering;
// use candid::Principal;
use ic_cdk::{caller};
use ic_cdk_macros::update;

use crate::discover::{Post};

// Move it to util
pub fn time_diff(i: u64, f: u64) -> Duration {
    let date_created_duration = Duration::from_nanos(f);
    let current_time_duration = Duration::from_nanos(i);
    current_time_duration - date_created_duration
}

#[update]
fn save_post(mut post: Post) -> Result<(), String> {
    if caller().to_string() == *"2vxsx-fae" {
        return Err("Anonymous users not allowed to create posts".to_string());
    }
    let original_post = Post::get(post.id.clone());
    if original_post.is_ok() {
        post.votes_up = original_post.clone().unwrap().votes_up;
        post.votes_down = original_post.unwrap().votes_down;
    } else {
        let posts = Post::get_latest_posts();


        if posts.len() >= 2 {
            // TODO make sure the ordering is correct, otherwise the hours, and minutes may be not accurate
            //     it should take the posted dates, but it may take the last post in the array instead of the actual last post
            //     print("dif is hre----");
            //     let x = posts.last().unwrap().date_created.clone() - posts.first().unwrap().date_created.clone();
            //     print(x.to_string());

            let one_day = 86400;
            let diff = time_diff(posts.last().unwrap().date_created.clone(), ic_cdk::api::time());
            if diff < Duration::from_secs(one_day.clone()) {
                let hours = &one_day - diff.as_secs();
                let remainder = (one_day - diff.as_secs()) % 3600;
                let msg = format!("please wait {} hours and {} minutes", hours / 3600, remainder / 60);
                return Err(msg);
            }
        }
        post.votes_up = vec![];
        post.votes_down = vec![];
        post.date_created = ic_cdk::api::time();
    }
    // if post.creator != caller().to_string(); {Err}
    post.creator = caller().to_string();
    post.save();
    Ok(())
}


#[update]
fn delete_post(id: String) -> Result<(), String> {
    let post = Post::get(id.clone())?;
    if post.creator != caller().to_string() {
        return Err("Only the post creator can delete this.".to_string());
    };
    Post::delete(id)
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
