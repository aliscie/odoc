import React, {useState} from 'react';
import {actor} from "../../App";
import {useSelector} from "react-redux";
import {Button} from "@mui/material";

interface Props {
    setPosts: React.Dispatch<React.SetStateAction<any>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

function FilterPosts(props: Props) {
    const {profile} = useSelector((state: any) => state.filesReducer);
    const [tags, setTags] = useState<[] | [Array<string>]>([]);
    const [userIds, setUserIds] = useState<[] | [string]>([profile ? profile.id : ""]);

    const handleFilter = async () => {

        // Constructing Option<Vec<String>> for tags
        const tagsOption: [] | [Array<string>] = tags

        // Constructing Option<String> for creator (user ID)
        const creatorOption = userIds.length > 0 ? {Some: userIds[0]} : {None: null};

        try {
            const response = actor && (await actor.get_filtered_posts(tagsOption, userIds));
            // Assuming 'actor.get_filtered_posts' returns the response in the form of 'Vec<PostUser>'
            props.setPosts(response || []);
            props.setPage(0);
        } catch (error) {
            console.error('Error filtering posts:', error);
        }
    };

    return (
        <div>
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
        </div>
    );
}

export default FilterPosts;
