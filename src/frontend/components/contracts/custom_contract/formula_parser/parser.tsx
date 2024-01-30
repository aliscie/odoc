import {Parser, SUPPORTED_FORMULAS} from 'hot-formula-parser'
import {
    CColumn,
    CContract,
    Execute,
    Formula, Operation,
    Trigger,
    User
} from "../../../../../declarations/user_canister/user_canister.did";
import {useSelector} from "react-redux";
import {Principal} from "@dfinity/principal";
import {randomString} from "../../../../data_processing/data_samples";
import {useState} from "react";

interface Props {

}

function useParser(props: Props) {
    const {profile, all_friends} = useSelector((state: any) => state.filesReducer);
    let all_users = [profile, ...all_friends];
    const [FORMULA, setFORMULA] = useState<Formula>({});

    var parser = new Parser();
    let code_text_example = ` 
    TRANSFER(Age,Date,3)
    `

    all_users.forEach((user: User) => {
        parser.on('callVariable', function (name, done) {
            if (name === user.name) {
                done(user.name)
            }
        });
    })


    parser.on('callFunction', function (name, params, done) {

        if (name === 'IF_THEN') {
            console.log("IF_THEN", {params})
            if (params[0]) {
                done(params[1])
            } else {
                done("")
            }
        }
    });


    parser.on('callFunction', function (name, params, done) {
        if (name === 'TRANSFER') {
            // logger({name, params})
            let from = params[0];
            let to = params[1];
            let amount = params[2];
            let sender = all_users.find((u: User) => u.name == from);
            let receiver = all_users.find((u: User) => u.name == to);
            let transaction: Execute = {
                "TransferUsdt": {
                    'id': randomString(),
                    'date_created': 0,
                    'date_released': 0,
                    'sender': Principal.fromText(sender.id),
                    'released': false,
                    'amount': Number(amount),
                    'receiver': Principal.fromText(receiver.id),
                }
            }


            let trigger: Trigger = {'Update': props.colDef}
            let operation: Operation = {'Equal': null}
            // setFORMULA({
            //     'trigger_target': "string",
            //     trigger,
            //     operation,
            //     'column_id': 'string',
            //     execute: transaction,
            // })
            done(`TRANSFER({from:${from},to:${to},amount:${amount}})`);
        }
    });


    function addVarsToParser(parser, params, view: CContract) {


        view.columns.forEach((column: CColumn) => {
            parser.on('callVariable', function (name, done) {
                if (name === column.headerName) {
                    done(params.row[column.field])
                }
            });
        })


    }


    return {parser, addVarsToParser, FORMULA}
}

export default useParser