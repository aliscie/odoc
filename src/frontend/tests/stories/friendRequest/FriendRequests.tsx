import React from "react";
import { FriendCom } from "../../../pages/profile/friends";
import { Principal } from "@dfinity/principal";
import { BackendProvider } from "../../../contexts/BackendContext";
import store from "../../../redux/store";
import {Provider} from "react-redux";

export interface Props {}

export const FriendRequestStoryCom = (props: Props) => {
  let dataSample = {
    rate: 0,
    id: Principal.fromText(
      "mntb7-3ixls-fjyuc-ue5kp-r2clk-qbh52-toieq-vmxjw-s25vu-bk6rc-2ae",
    ),
    actions_rate: 0,
    balance: 0,
    rates_by_actions: [],
    name: "dsf",
    description: "asdf",
    total_debt: 0,
    spent: 0,
    rates_by_others: [],
    users_rate: 0,
    users_interacted: 0,
    photo: {},
    debts: [],
    received: 0,
    labelId: "labelId",
  };

  return (
    <Provider store={store}>
      <BackendProvider>
        {" "}
        <FriendCom {...dataSample} />
      </BackendProvider>
    </Provider>
  );
};
