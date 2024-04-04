import {compile, EvalFunction} from "mathjs";
import {
    CColumn,
    CContract,
    CPayment,
    CustomContract,
    StoredContract,
    User,
} from "../../../../../declarations/user_canister/user_canister.did";
import {useDispatch, useSelector} from "react-redux";
import {Principal} from "@dfinity/principal";
import React from "react";
import {handleRedux} from "../../../../redux/main";
import {useSnackbar} from "notistack";

interface ParserValues {
    [key: string]: any;
}

interface New {
    tit
}

interface ParserReturnType {
    formula: Array<CPayment>;
    value: any;
    err?: string;
}


interface ParserProps {
    contract?: CContract;
    main_contract?: CustomContract
    // TODO^^^------------why u need this question mark here? useParser must lawyer has CContract
}

function useParser(props: ParserProps) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {profile, all_friends, wallet, contracts} = useSelector(
        (state: any) => state.filesReducer
    );
    const {contract, main_contract} = props;
    const all_users: Array<User> = all_friends ? [profile, ...all_friends] : [profile];
    // const ref = React.useRef<Array<CPayment>>([]);
    const ref = React.useRef<Map<String, CPayment>>(new Map());
    const values: ParserValues = {};

    all_users.forEach((user: User) => {
        values[user.name] = user;
    });

    const dispatch = useDispatch();
    let initial_promises = Array.from(ref.current.values())

    function updatePromises() {
        let changes = false;
        let new_promises: Array<CPayment> = Array.from(ref.current.values());
        // Initialize with current promises from main_contract to ensure any that aren't updated or added remain
        let combinedPromises: Array<CPayment> = [...main_contract?.promises || []];


        if (main_contract) {
            // Check if there are new or updated promises
            new_promises.forEach((newPromise) => {
                const existingPromiseIndex = main_contract.promises.findIndex(p => p.id === newPromise.id);
                if (existingPromiseIndex > -1) {
                    // Check if the promise has been changed
                    if (JSON.stringify(main_contract.promises[existingPromiseIndex]) !== JSON.stringify(newPromise)) {
                        changes = true;
                        // Update the existing promise with the new one
                        combinedPromises[existingPromiseIndex] = newPromise;
                    }
                } else {
                    // If the promise doesn't exist, it's a new promise
                    changes = true;
                    combinedPromises.push(newPromise);
                }
            });
        }

        // If there were changes, update the contract and dispatch actions
        if (main_contract && changes) {
            let updatedContract = {...main_contract, promises: combinedPromises};
            let to_store: StoredContract = {
                "CustomContract": updatedContract
            };
            dispatch(handleRedux("UPDATE_CONTRACT", {contract: to_store}));
            dispatch(handleRedux("CONTRACT_CHANGES", {changes: to_store}));
        }
    }

    let warning = false;
    values["Promise"] = (to: User, amount: number) => {
        if (!values.row_id) {
            console.error("----------", {values})
            return "Err"
        }
        const promise: CPayment = {
            id: values.row_id,
            amount: Number(amount),
            receiver: Principal.fromText(to.id),
            sender: Principal.fromText(profile.id),
            date_created: 0,
            date_released: 0,
            status: {None: null},
            contract_id: contract.id,
        };
        // TODO why this was calling too many times.
        // console.log({amount: promise.amount > wallet.balance})
        if (promise.amount > wallet.balance && !warning) {
            warning = true;
            enqueueSnackbar("You don't have enough balance to make this promise.", {variant: "error"});
        }

        ref.current.set(promise.id, promise);
        updatePromises()
        return `You promised ${amount} USDT to ${to.name}.`;
    };


    // useEffect(() => {
    //
    //     updatePromises()
    // }, [ref.current]);

    // TODO values['Transfer'] = (to: string, amount: number) => {
    //     return `You will transfer ${amount}USDT to ${to.name}.`;
    // };

    function addVarsToParser(params: any, view: CContract) {
        // Temporary storage for evaluated formula results to avoid re-evaluation
        let formulaResults = {};

        view.columns.forEach((column: CColumn) => {
            // Check if this is a formula column that hasn't been processed yet
            if (column.formula_string && formulaResults[column.field] === undefined) {
                // Evaluate the formula and store the result
                let result = evaluate(column.formula_string).value;
                formulaResults[column.field] = result;
                values[column.headerName] = result;
            } else if (!column.formula_string) {
                // For non-formula columns, directly use the value from params
                values[column.headerName] = params.row[column.field];
            }

            // Ensure row_id is always set
            values["row_id"] = params.id;
        });

        // Optionally, if you need to update params.row with formula results for subsequent access
        Object.keys(formulaResults).forEach(field => {
            params.row[field] = formulaResults[field];
        });
    }

    function evaluate(code: string): ParserReturnType {
        const formula = Array.from(ref.current.values());
        try {
            const parsedFormula: EvalFunction = compile(code);
            const value: any = parsedFormula.evaluate(values);
            return {formula, value};
        } catch (e) {
            const errorMessage: string = JSON.stringify(e);
            return {formula, value: "", err: errorMessage};
        }
    }

    return {evaluate, addVarsToParser, promises: Array.from(ref.current.values())};
}

export default useParser;
