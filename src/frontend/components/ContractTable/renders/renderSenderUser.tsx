import useGetUser from "../../../utils/get_user_by_principal";
import {useEffect, useState} from "react";
import {User} from "../../../../declarations/backend/backend.did";

export function renderSenderUser({row, onRowChange}: any) {

    let {getUser, getUserByName} = useGetUser();
    const [userName, setUserName] = useState(row.sender || "")

    useEffect(() => {
        function getSender() {
            getUser(row.sender).then((user: User | null) => {
                user && setUserName(user.name);
            });
        }

        getSender();
    }, []);

    return <div>{userName}</div>;
}
