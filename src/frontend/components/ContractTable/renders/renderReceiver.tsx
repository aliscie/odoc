import useGetUser from "../../../utils/get_user_by_principal";
import { useEffect, useState } from "react";
import { User } from "../../../../declarations/backend/backend.did";
import { Principal } from "@dfinity/principal";

export function renderReceiver({ row, onRowChange }: any) {
  let { getUser, getUserByName } = useGetUser();
  const [userName, setUserName] = useState(row.receiver);

  useEffect(() => {
    function getSender() {
      getUser(row.receiver).then((user: User | null) => {
        user && setUserName(user.name);
      });
    }

    getSender();
  }, []);
  // Principal.fromText("2vxsx-fae")
  return (
    <div>{userName == "2vxsx-fae" ? "receiver not selected" : userName}</div>
  );
}
