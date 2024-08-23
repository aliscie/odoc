import {RenderEditCellProps} from "react-data-grid";
import {useSelector} from "react-redux";
import useGetUser from "../../../utils/get_user_by_principal";
import {useEffect, useState} from "react";
import {User} from "../../../../declarations/backend/backend.did";


export function renderSender({row, onRowChange}: RenderEditCellProps) {
    let {getUser, getUserByName} = useGetUser();
    const [sender, setSender] = useState("");
    useEffect(() => {
        function getSender() {
            getUser(row.sender).then((user: User | null) => {
                user && setSender(user.name);
            })
        }

        getSender()
    }, [])
    return (<div>{sender}</div>);
}
