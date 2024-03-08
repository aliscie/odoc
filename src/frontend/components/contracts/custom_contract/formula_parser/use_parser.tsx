import {compile, EvalFunction} from "mathjs";
import {CColumn, CContract, CPayment, User,} from "../../../../../declarations/user_canister/user_canister.did";
import {useSelector} from "react-redux";
import {Principal} from "@dfinity/principal";
import React from "react";
import {randomString} from "../../../../data_processing/data_samples";

interface ParserValues {
    [key: string]: any;
}

interface New {
    tit
}

interface ParserReturnType {
    formula: Array<CPayment>;
    value: any;
    err?: boolean;
}


interface ParserProps {
    contract: CContract;
}

function useParser(props: ParserProps) {

    const {profile, all_friends, wallet} = useSelector(
        (state: any) => state.filesReducer
    );
    const all_users: Array<User> = all_friends ? [profile, ...all_friends] : [profile];
    const ref = React.useRef<Array<CPayment>>([]);
    const values: ParserValues = {};

    all_users.forEach((user: User) => {
        values[user.name] = user;
    });

    function updatePromise(promise: CPayment): Array<CPayment> {
        const existingIndex = ref.current.findIndex(p => p.id === promise.id);
        if (existingIndex === -1) {
            ref.current.push(promise);
        } else {
            ref.current[existingIndex] = promise;
        }
        return ref.current;
    }

    values["Promise"] = (to: User, amount: number) => {
        // if (!values["row_id"]) {
        //     return "Null"
        // };

        const promise: CPayment = {
            id: values["row_id"],
            amount: Number(amount),
            receiver: Principal.fromText(to.id),
            sender: Principal.fromText(profile.id),
            date_created: 0,
            date_released: 0,
            status: {None: null},
            contract_id: props.contract.id,
        };

        updatePromise(promise);
        return `You promised ${amount} USDT to ${to.name}.`;
    };

    // TODO values['Transfer'] = (to: string, amount: number) => {
    //     return `You will transfer ${amount}USDT to ${to.name}.`;
    // };

    function addVarsToParser(params: any, view: CContract) {
        view.columns.forEach((column: CColumn) => {
            values[column.headerName] = params.row[column.field];
            values["row_id"] = params.row.id;
        });
    }

    function evaluate(code: string): ParserReturnType {
        try {
            const parsedFormula: EvalFunction = compile(code);
            const value: any = parsedFormula.evaluate(values);
            return {formula: ref.current, value};
        } catch (e) {
            const errorMessage: string = JSON.stringify(e);
            return {formula: ref.current, value: errorMessage, err: true};
        }
    }

    return {evaluate, addVarsToParser, ref};
}

export default useParser;
