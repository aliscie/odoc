import MultiAutoComplete from "../../components/genral/multi_autocompelte";
import React from "react";
import {PostUser} from "../../../declarations/backend/backend.did";
import debounce from "../../utils/debounce";

interface Props {
    onChange: any,
    setTags: any,
    tags: [],
    post: PostUser,
    style?: any
}

function PostTags(props: Props) {
    let init = [
        {title: "hiring"}, {title: "seeking"}
    ];
    const [tags_options, setTagsOptions] = React.useState(init);
    const [tags, setTags] = React.useState(props.post ? props.post.tags.map((tag) => {
        return {title: tag}
    }) : []);


    function handleChange(event: any, options: any) {
        let is_title_in = tags_options.some((item) => item.title.includes(event.target.value));
        let is_text = typeof event.target.value === "string";

        if (!is_title_in && is_text) {
            setTagsOptions((pre) => {
                return [{title: String(event.target.value)}, ...pre];
            });
        } else if (options) {
            props.setTags(options);
            setTags(options)
        } else {
            setTagsOptions(init);
        }
    }

    const debouncedHandleChange = React.useMemo(() => debounce(handleChange, 300), []);

    return <MultiAutoComplete
        {...props}
        style={props.style}
        onChange={debouncedHandleChange}
        value={tags}
        options={tags_options}
        multiple={true}/>
}

export default PostTags;