// make a query that get post order from older to newer

use std::collections::HashMap;
use ic_cdk_macros::query;
use crate::discover::{Post, PostUser, UserFE};


use crate::storage_schema::FileId;
use crate::{POSTS};
use crate::files_content::ContentNode;
use crate::user::User;


#[query]
fn get_posts(start: usize, count: usize) -> Vec<PostUser> {
    Post::get_pagination(start, count)
}

#[query]
fn get_filtered_posts(tags: Option<Vec<String>>, creator: Option<String>) -> Vec<PostUser> {
    Post::get_filtered(tags, creator)
    // paginate the first 50 posts
    // let start = 0;
    // let count = 50;
    // let actual_count = usize::min(count, posts.len() - start.clone());
    // posts
    //     .into_iter()
    //     .skip(start)
    //     .take(actual_count)
    //     .collect()
}

#[query]
fn search_posts(text_to_find: String) -> Vec<PostUser> {
    POSTS.with(|posts| {
        let posts = posts.borrow();

        let filtered_user_posts = posts
            .values()
            .flat_map(|post| {
                post.content_tree
                    .iter()
                    .filter(|node| node.text.contains(&text_to_find))
                    .map(move |node| {
                        let user = User::get_user_from_text_principal(&post.creator).unwrap();
                        let creator = UserFE {
                            id: user.id.clone(),
                            name: user.name.clone(),
                        };
                        PostUser {
                            id: post.id.clone(),
                            content_tree: post.content_tree.clone(),
                            tags: post.tags.clone(),
                            creator,
                            date_created: post.date_created,
                            votes_up: post.votes_up.clone(),
                            votes_down: post.votes_down.clone(),
                        }
                    })
            })
            .collect::<Vec<PostUser>>();

        filtered_user_posts
    })
}


// #[query]
// fn search_posts(text_to_find: String) -> Vec<String> {
//
//     POSTS.with(|posts| {
//         let posts = posts.borrow();
//
//         let filtered_post_ids = posts
//             .values()
//             .filter(|post| post.content_tree.values().any(|node| node.text.contains(&text_to_find)))
//             .map(|post| post.id.clone())
//             .collect::<Vec<String>>();
//
//         filtered_post_ids
//     })
// }

// #[query]
// fn search_posts(text_to_find: String) -> Vec<String> {
//     POSTS.with(|posts| {
//         let posts = posts.borrow();
//
//         let filtered_node_ids = posts
//             .values()
//             .flat_map(|post| post.content_tree.values().filter(|node| node.text.contains(&text_to_find)).map(|node| node.id.clone()))
//             .collect::<Vec<String>>();
//
//         filtered_node_ids
//     })
// }


#[query]
fn get_post(id: String) -> Result<Post, String> {
    Post::get(id)
}
