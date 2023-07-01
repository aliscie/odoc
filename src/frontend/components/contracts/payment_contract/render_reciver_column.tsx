import {GridRenderEditCellParams, useGridApiContext} from "@mui/x-data-grid";
import FreeSoloCreateOption from "../../genral/auto_complete";
import * as React from "react";
import {useSelector} from "react-redux";

function CustomEditComponent(props: any) {
    // const {all_friends} = useSelector((state: any) => state.filesReducer);
    props.value = props.row.receiver;
    const {id, value, field} = props;
    const apiRef = useGridApiContext();

    const handleValueChange = (event: any) => {
        apiRef.current.setEditCellValue({id, field, value: event.name});
    };
    return <FreeSoloCreateOption onChange={handleValueChange} options={props.options} value={value}/>
}

export default CustomEditComponent