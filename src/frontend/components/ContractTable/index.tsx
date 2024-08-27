import React, {useState} from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {CustomContract} from "../../../declarations/backend/backend.did";
import BasicMenu from "../MuiComponents/DropDown";
import {ButtonGroup, Input, MenuItem, Select, Tooltip} from "@mui/material";
import Button from "@mui/material/Button";
import DeleteContract from "./actions/DeleteContract";
import {CONTRACT, CREATE_CONTRACT, PAYMENTS, PROMISES} from "./types";
import RenderViews, {VIEW_OPTIONS} from "./views";
import {debounce} from "lodash";
import {handleRedux} from "../../redux/store/handleRedux";
import {useDispatch} from "react-redux";
import {createCContract} from "./utils";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DeleteTableContract from "./actions/DeleteTableContract";
import RenameTableContract from "./actions/RenameTableContract";
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';

export function CustomContractComponent({contract}: { contract: CustomContract }) {
    const dispatch = useDispatch();
    const [view, setView] = useState<VIEW_OPTIONS>({content: PROMISES});

    let options = [
        {
            content: <DeleteContract id={contract.id}/>,
        },
    ];
    if (view.contract) {
        options.push({
            content: <DeleteTableContract contract={contract} view={view}/>,
        })
        options.push({
            content: <RenameTableContract contract={contract} view={view}/>,
        })
    }

    let viewOptions: VIEW_OPTIONS[] = [
        {
            content: PROMISES,
            name: PROMISES,
            onClick: setView,
        },
        {
            content: PAYMENTS,
            name: PAYMENTS,
            onClick: setView,
        },
    ];

    contract.contracts.forEach(c => {
        viewOptions.push({
            onClick: (view) => {
                setView(view)
            },
            content: CONTRACT,
            name: c.name,
            contract: c
        })
    })
    viewOptions.push({
        content: CREATE_CONTRACT,
        onClick: (view) => {

            let newContract = createCContract()
            let contracts = [...contract.contracts, newContract]
            let updateContract = {...contract, contracts}
            setView({content: CONTRACT, contract: newContract})
            dispatch(handleRedux("UPDATE_CONTRACT", {contract: updateContract}));
        }
    })


    const debouncedOnChange = debounce((e: any) => {
        let updated_contract = {...contract, name: e.target.value};
        // let to_store = {CustomContract: updated_contract};
        dispatch(handleRedux("UPDATE_CONTRACT", {contract: updated_contract}));
    }, 300);

    const [expanded, setExpanded] = useState(true);
    return (<div>
        <ButtonGroup size="small" variant="contained" aria-label="Basic button group">

            <Input onChange={debouncedOnChange} defaultValue={contract.name}/>
            <Button>Filter</Button>
            <Select
                defaultValue={PROMISES}
            >
                {
                    viewOptions.map((w, i) => {
                        return (<MenuItem
                            onClick={() => w.onClick(w)}
                            key={i}
                            value={w.name}>{
                            w.content == CREATE_CONTRACT ?
                                (<Tooltip title="Create new table"><CreateNewFolderIcon/> </Tooltip>) : w.name
                        }</MenuItem>)
                    })
                }
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
            <Button onClick={() => setExpanded(!expanded)}>{expanded ? <CloseFullscreenIcon/> :
                <OpenInFullIcon/>}</Button>
        </ButtonGroup>
        {expanded && <RenderViews view={view} contract={contract}/>}

    </div>);
}

