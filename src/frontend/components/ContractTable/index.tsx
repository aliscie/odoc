import React, {useState} from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {CustomContract} from "../../../declarations/backend/backend.did";
import BasicMenu from "../MuiComponents/DropDown";
import {ButtonGroup, Input, MenuItem, Select} from "@mui/material";
import Button from "@mui/material/Button";
import DeleteContract from "./actions/DeleteContract";
import {CONTRACT, PAYMENTS, PROMISES} from "./types";
import RenderViews, {VIEW} from "./views";
import {debounce} from "lodash";
import {handleRedux} from "../../redux/store/handleRedux";
import {useDispatch} from "react-redux";


export function CustomContractComponent({contract}: { contract: CustomContract }) {
    const dispatch = useDispatch();


    let options = [
        {
            content: <Input placeholder={"Untitled contract"}/>,
        },
        {
            content: <DeleteContract id={contract.id}/>,
        }
    ];

    let viewOptions = [
        {
            content: PROMISES
        },
        {
            content: CONTRACT
        },
        {
            content: PAYMENTS
        }
    ];
    const [view, setView] = useState<VIEW>(PROMISES);

    const debouncedOnChange = debounce((e: any) => {
        let updated_contract = {...contract, name: e.target.value};
        let to_store = {CustomContract: updated_contract};
        dispatch(handleRedux("UPDATE_CONTRACT", {contract: to_store}));
    }, 300);


    return (<div>
        <ButtonGroup size="small" variant="contained" aria-label="Basic button group">

            <Input onChange={debouncedOnChange} defaultValue={contract.name}/>
            <Button>Filter</Button>
            <Select
                defaultValue={PROMISES}
                onChange={(selection) => {
                    setView(selection.target.value)
                }}
            >
                {viewOptions.map((w, i) => <MenuItem key={i} value={w.content}>{w.content}</MenuItem>)}
            </Select>

            <BasicMenu
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                options={options}
            >
                <MoreVertIcon/>
            </BasicMenu>
        </ButtonGroup>
        <RenderViews view={view} contract={contract}/>

    </div>);
}

