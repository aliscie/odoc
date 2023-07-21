import PostComponent from "../genral/post_component";
import {Grid} from "@mui/material";
import React from "react";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import EditorComponent from "../editor_components/main";
import {handleRedux} from "../../redux/main";
import {file_content_sample, file_data} from "../../data_processing/data_samples";

export const content = [
    {type: "p", children: [{text: ""}]},
]

function CreatePost() {
    let [isEnter, setEnter] = React.useState(false);
    let CreateButtons = (props: any) => <>
        <IconButton><AddCircleOutlineIcon/></IconButton>
        <IconButton><MoreTimeIcon/></IconButton>
    </>;

    function handleOnInsertComponent(e: any, component: any) {
        // console.log("handleOnInsertComponent", e, component)
        // if (component.type == "payment_component") {
        //     dispatch(handleRedux("ADD_CONTENT", {id: file_data.id, content: file_content_sample}))
        // }

    }

    return (
        <Grid
            onMouseEnter={() => setEnter(true)}
            onMouseLeave={() => setEnter(false)}

            item
            sx={{
                my: 1,
                mx: 'auto',
                p: 2,
                marginLeft: '20%',
                marginRight: '20%',
                opacity: isEnter ? 1 : 0.2,
            }}
        >
            <PostComponent
                buttons={<CreateButtons/>}
                content={<EditorComponent
                    handleOnInsertComponent={handleOnInsertComponent}
                    // onChange={onChange}
                    // editorKey={editorKey}
                    content={content || []}
                />}
            />

        </Grid>
    )
}

export default CreatePost;