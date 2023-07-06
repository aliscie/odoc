import {useGridApiContext} from "@mui/x-data-grid";
import FreeSoloCreateOption from "../../genral/auto_complete";
import * as React from "react";

function ReceiverComponent(props: any) {
    const {id, field} = props;
    const apiRef = useGridApiContext();

    const handleValueChange = (event: any) => {
        apiRef.current.setEditCellValue({id, field, value: event.name});
    };
    return <FreeSoloCreateOption onChange={handleValueChange} options={props.options} value={props.row.receiver}/>
}

export default ReceiverComponent