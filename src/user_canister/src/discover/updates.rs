use ic_cdk::{caller, print};
use ic_cdk_macros::update;

use crate::discover::Post;


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

            let time_difference = posts.last().unwrap().date_created.clone() - ic_cdk::api::time();
            // last_post_sample = 43285902000 nano seconds
            //  Error creating post. Please wait 51 hours and 1445734 minutes before you can post again


            let remaining_hours = time_difference / 360_000_000_000_000_000;
            let remaining_minutes = (time_difference.clone() - remaining_hours) / 60_000_000_000;
            let waiting_time = format!("Please wait {} hours and {} minutes before you can post again", remaining_hours, remaining_minutes);
            return Err(waiting_time);
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