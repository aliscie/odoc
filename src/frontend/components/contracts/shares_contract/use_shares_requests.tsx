import * as React from "react";
import {useState} from "react";
import {Share, ShareRequest} from "../../../../declarations/user_canister/user_canister.did";
import useGetUser from "../../../utils/get_user_by_principal";
import {useDispatch, useSelector} from "react-redux";
import {randomString} from "../../../data_processing/data_samples";
import {Principal} from "@dfinity/principal";
import {handleRedux} from "../../../redux/main";
import {RenderReceiver} from "../payment_contract/renderers";

interface ShareReqRow {
    id: string,
    receiver: string,
    share: bigint,
    // proposals: string[],
}

function useSharesRequests({table_content, setView, data, props, setData}) {
    const dispatch = useDispatch();
    const [currentRequest, setRequest] = useState<ShareRequest | null>(null);
    let {getUser, getUserByName} = useGetUser();
    const {
        files_content,
        current_file,
        all_friends,
        profile,
        contracts
    } = useSelector((state: any) => state.filesReducer);
    let updated_contracts = {...contracts};

    function UpdatedContractFromRow(new_rows, shares: Array<Share>): Array<Share> {

        return new_rows.map((item: ShareReqRow) => {
            let receiver = getUserByName(item.receiver);
            // find share.share_contract_id == item.id
            let share = shares.find((share: Share) => share.share_contract_id === item.id);
            return {
                accumulation: share ? BigInt(share.accumulation) : 0n,
                confirmed: share ? Boolean(share.confirmed) : false,
                // TODO accumulation and confirmed should come from the contracts[table_content.id].shares_requests
                share_contract_id: item.id,
                share: BigInt(item['share%'] || item['share'] || 0),
                receiver: Principal.fromText(receiver && receiver.id || "2vxsx-fae"),
            }
        });
    }

    function addRequestRow(rowId: string, before: boolean) {
        // -------------- update state ----------------\\\
        let request: [string, ShareRequest] = contracts[table_content.id].shares_requests.find((item: [string, ShareRequest]) => item[0] === currentRequest.id);
        let optionReqRowIndex = request && request[1].shares.findIndex((item: Share) => item.share_contract_id === rowId);
        let new_row: ShareReqRow = {id: randomString(), receiver: profile.name, share: 0n};
        let request_raw_position = before ? 0 : 1;
        let new_rows = [...data.rows];
        setData((pre) => {
            new_rows.splice(optionReqRowIndex + request_raw_position, 0, new_row);
            return {...pre, rows: new_rows}
        });
        // -------------- update contract ----------------\\\
        // let shares_requests: Array<[string, ShareRequest]> = contracts[table_content.id].shares_requests;


        let shares_requests: Array<[string, ShareRequest]> = contracts[table_content.id].shares_requests.map((share_request: [string, ShareRequest]) => {
            if (share_request[0] === currentRequest.id) {
                return [share_request[1].id, {
                    ...share_request[1],
                    shares: UpdatedContractFromRow(new_rows, share_request[1].shares)
                }]
            }
            return share_request;
        });

        // TODo tow issues
        // 1. the id share is set as share_contract_id
        // 2. data structure

        updated_contracts[table_content.id] = {
            ...contracts[table_content.id],
            shares_requests,
        };


        dispatch(handleRedux("CONTRACT_CHANGES", {changes: updated_contracts[table_content.id]}));
        dispatch(handleRedux("UPDATE_CONTRACT", {contract: updated_contracts[table_content.id]}));


    }

    let handleClickReq = async (req: ShareRequest) => {

        setRequest(req);
        setView(req.id)

        let editable = req.requester.toString() == profile.id;
        // let share_req = contracts[table_content.id].shares_requests.find((item: [string, ShareRequest]) => item[0] === req.id);
        setData({
            rows: req.shares.map(async (share: Share) => {
                let receiver: any = await getUser(share.receiver.toString());
                receiver = receiver ? receiver.name : ""
                let row: ShareReqRow = {
                    id: share.share_contract_id,
                    receiver,
                    share: share.share,
                    // approve: currentRequest ? (Principal.fromText(profile.id).toString() in currentRequest.approvals) : false,
                }
                return row
            }),
            columns: [
                {
                    field: 'receiver',
                    headerName: 'receiver',
                    renderEditCell: (props: any) => RenderReceiver({
                        ...props,
                        options: [...all_friends, profile]
                    }),
                    // renderCell: RenderReceiver({
                    //     ...props,
                    //     options: [...all_friends, profile]
                    // }),
                    width: 150,
                    editable
                },
                {
                    field: 'share',
                    headerName: 'share',
                    width: 150,
                    editable
                },
                // {field: 'approvals', headerName: 'approvals', width: 150},
            ]
        });

    };
    return {setRequest, handleClickReq, UpdatedContractFromRow, currentRequest, addRequestRow};
}

export default useSharesRequests;