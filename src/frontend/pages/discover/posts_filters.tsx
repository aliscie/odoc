import React, {useState} from 'react';
import {actor} from "../../App";
import {useSelector} from "react-redux";
import {Box, Button} from "@mui/material";
import {PostUser} from "../../../declarations/backend/backend.did";
import PostTags from "./tags_component";

interface Props {
    setPosts: React.Dispatch<React.SetStateAction<any>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    initPosts: Array<PostUser>
}

let init_posts = []

function FilterPosts(props: Props) {
    if (props.initPosts.length > init_posts.length) {
        init_posts = props.initPosts;
    }

    const {profile} = useSelector((state: any) => state.filesReducer);
    const [tags, setTags] = useState<[] | [Array<string>]>([]);
    const [userIds, setUserIds] = useState<[] | [string]>([profile ? profile.id : ""]);
    const handleFilter = async () => {

        // Constructing Option<Vec<String>> for tags
        const tagsOption: [] | [Array<string>] = tags

        // Constructing Option<String> for creator (user ID)
        // const creatorOption = userIds.length > 0 ? {Some: userIds[0]} : {None: null};

        try {
            const response = actor && (await actor.get_filtered_posts(tagsOption, userIds));
            // Assuming 'actor.get_filtered_posts' returns the response in the form of 'Vec<PostUser>'
            props.setPosts(response || []);
            props.setPage(0);
        } catch (error) {
            console.error('Error filtering posts:', error);
        }
    };
    // let initial_tags = [
    //     {title: "hiring"}, {title: "seeking"}
    // ];
    const onTagChange = async (options: any) => {
        options && setTags(options);

        if (options && options.length > 0) {
            const response = actor && await actor.get_filtered_posts([options.map((opt) => opt.title)], []);
            console.log({response, t: options.map((opt) => opt.title)})
            response && props.setPosts(response || []);
            response && props.setPage(0);
        } else {
            props.setPosts(init_posts || []);
            props.setPage(0);
        }


    }
    return (
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
            {/*<div>*/}
            {/*    <label>Add Tags:</label>*/}
            {/*    <input*/}
            {/*        type="text"*/}
            {/*        value={tags.join(',')}*/}
            {/*        onChange={(e) => setTags(e.target.value.split(','))}*/}
            {/*    />*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*    <label>Add User IDs:</label>*/}
            {/*    <input*/}
            {/*        type="text"*/}
            {/*        value={userIds.join(',')}*/}
            {/*        onChange={(e) => setUserIds(e.target.value.split(','))}*/}
            {/*    />*/}
            {/*</div>*/}
            {profile && <Button onClick={handleFilter}>Only my posts</Button>}
            <PostTags
                style={{backgroundColor: "lightblue"}}
                tags={tags}
                setTags={(op) => {
                    onTagChange(op)
                }}/>
        </Box>
    );
}

export default FilterPosts;
