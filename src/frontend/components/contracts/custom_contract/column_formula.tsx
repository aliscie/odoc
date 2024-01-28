import * as React from 'react';
import {useEffect, useState} from 'react';
import {Input} from '@mui/material';
import MultiAutoComplete from '../../genral/multi_autocompelte';
import {CPayment, Execute, Formula, Operation, Trigger} from '../../../../declarations/user_canister/user_canister.did';
import {GridColumnMenuItemProps} from "@mui/x-data-grid";
import {updateContractColumn} from "./utls";
import MenuItem from "@mui/material/MenuItem";
import BasicPopover from "../../genral/pop_over";
import {logger} from "../../../dev_utils/log_data";
import {Principal} from "@dfinity/principal";

interface Props {
    value: Formula;
    onChange: (event: Formula) => any;
}

type MultiOptions = Array<{ title: string; id: string }>;

interface AutoProps {
    onChange: (event: Trigger) => any;
    value: Trigger | Execute | Operation;
    options: MultiOptions;
}

function AutoComp(props: AutoProps) {

    const [value, setValue] = useState(props.value);
    let key = value && value.formula && Object.keys(value.formula)[0];
    let v = value && value.formula && Object.values(value.formula)[0];
    if (!key && value) {
        key = Object.keys(value)[0]
        v = Object.values(value)[0]
    }
    return (
        <MultiAutoComplete
            onChange={(event, option: MultiOptions) => {
                setValue(option);
                props.onChange(option.formula);
            }}
            options={props.options}
            multiple={false}
            value={value ? {title: `${key}:${v}`} : []}
        />
    );
}


function FormulaCom(props: Props) {
    const [trigger, setTrigger] = useState<Trigger>(props.value.trigger);
    const [operation, setOperation] = useState<Operation>(props.value.operation);
    const [target, setTarget] = useState<String>(props.value.trigger_target);
    const [execute, setExecute] = useState<Execute>(props.value.execute);
    useEffect(() => {
        const formula: Formula = {
            trigger_target: target, // Fill this with the appropriate value
            trigger,
            operation,
            execute: execute,
        };

        props.onChange(formula);
    }, [trigger, operation, target]);

    const triggerOptions = [
        {title: 'Timer', id: 'Timer', formula: {Timer: 0}},
        {title: 'Update', id: 'Update', formula: {Update: ''}},
    ];


    const operationOptions = [
        {title: 'Equal', id: 'Equal', formula: {Equal: null}},
        {title: 'Contains', id: 'Contains', formula: {Contains: null}},
        {title: 'Bigger', id: 'Bigger', formula: {Bigger: null}},
        {title: 'BiggerOrEqual', id: 'BiggerOrEqual', formula: {BiggerOrEqual: null}},
    ];

    const execOptions = [
        {title: 'Pay', id: 'Equal', formula: {Equal: null}},
        {title: 'Send USDC', id: 'Contains', formula: {Contains: null}},
        // {title: 'send USDC', id: 'Bigger', formula: {TransferUsdt: Payment}},

    ];

    // let pay: CPayment = {
    //     'date_created': 0,
    //     'sender': Principal.fromText("2vxsx-fae"),
    //     'released': false,
    //     'amount': 10,
    // }
    // let exic: Execute = {'TransferUsdt': pay}
    let payments = props.view.payments;
    return (
        <>
            {/*<AutoComp options={triggerOptions} value={trigger} onChange={(event) => setTrigger(event)}/>*/}
            if this column
            <AutoComp options={operationOptions} value={operation} onChange={(event) => setOperation(event)}/>

            <Input defaultValue={target} onChange={(event) => setTarget(event.target.value)}/>
            then execute
            <AutoComp options={execOptions} value={execute} onChange={(event) => setExecute(event)}/>
        </>
    );
}

function ChangeColumnFormula(props: GridColumnMenuItemProps) {
    const {menuProps} = props;
    const [value, setValue] = React.useState<Formula | undefined>(undefined);
    const onChange = (formula: Formula) => {
        setValue(formula);
    };
    const onCLickAway = () => {
        if (value) {
            let updated_column = {
                id: menuProps.colDef.id,
                formula: [value],
            };
            logger({value})
            props.setContract((prevContract) =>
                updateContractColumn(prevContract, updated_column, props.view)
            );
            setValue(undefined)
        }
    }

    return (
        <MenuItem>
            <BasicPopover
                style={{minWidth: '500px'}}
                onClickAway={onCLickAway}
                content={
                    <FormulaCom
                        view={view}
                        value={menuProps && menuProps.colDef.formula[0]}
                        onChange={onChange}
                    />}
            >Formula</BasicPopover>
        </MenuItem>
    );
}

export default ChangeColumnFormula;

