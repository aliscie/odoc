import MultiAutoComplete from "../../components/genral/multi_autocompelte";
import React from "react";
import {PostUser} from "../../../declarations/user_canister/user_canister.did";
import debounce from "../../utils/debounce";

interface Props {
    onChange: any,
    setTags: any,
    tags: [],
    post: PostUser
}

function PostTags(props: Props) {
    let init = [
        {title: "hiring"}, {title: "seeking"}
    ];
    const [initial_tags, setInitTags] = React.useState(init);


    function handleChange(event: any, options: any) {
        let is_title_in = initial_tags.some((item) => item.title.includes(event.target.value));
        let is_text = typeof event.target.value === "string";

        if (!is_title_in && is_text) {
            setInitTags((pre) => {
                return [{title: String(event.target.value)}, ...pre];
            });
        } else if (options) {
            props.setTags(options);
            // props.onChange(options);
        } else {
            setInitTags(init);
        }
    }

    const debouncedHandleChange = React.useMemo(() => debounce(handleChange, 300), []);


    let tags: any = props.tags || [];
    if (props.post) {
        tags = [
            ...tags,
            ...props.post.tags.map((tag) => {
                return {title: tag}
            })
        ]
    }
    return <MultiAutoComplete
        onChange={debouncedHandleChange}
        value={tags}
        options={initial_tags}
        multiple={true}/>
}

export default PostTags;