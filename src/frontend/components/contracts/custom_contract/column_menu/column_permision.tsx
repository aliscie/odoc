import {CContract, PermissionType, User} from "../../../../../declarations/backend/backend.did";
import {Principal} from "@dfinity/principal";
import MultiAutoComplete from "../../../genral/multi_autocompelte";
import * as React from "react";
import {useState} from "react";
import {useSelector} from "react-redux";
import {GridColumnMenuItemProps} from "@mui/x-data-grid";
import {PROMISES_CONTRACT_FIELDS, updateContractColumn} from "../utls";
import MenuItem from "@mui/material/MenuItem";
import {PROMISES} from "../types";

interface Props {
    // column: CColumn,
    contract: CContract,
    value: Array<PermissionType>,
    onChange: (event: Array<PermissionType>) => any,
    onBlur?: () => any,

}

type MultiOptions = Array<{ title: string, id: string, permission: PermissionType }>;

let perm = [
    {'Edit': Principal},
    {'View': Principal},
    {'AnyOneView': null},
    {'AnyOneEdite': null},
]

function ColumnPermission(props: Props) {
    const {all_friends} = useSelector((state: any) => state.filesReducer);
    // let [share_file, setShareFile] = useState(new_share_file);
    const [multi_options_value, setMultiOptionsValue] = useState<Array<PermissionType>>(props.value || []);

    let multi_options: MultiOptions = [
        {title: "AnyOne Can View", id: "AnyOneView", permission: {'AnyOneView': null}},
        {title: "AnyOne Can Edit", id: "AnyOneEdite", permission: {'AnyOneEdite': null}},
    ];

    all_friends && all_friends.map((f: User) => {
        let new_options: MultiOptions = [
            {title: f.name + " Can View", id: f.id, permission: {'View': Principal.fromText(f.id)}},
            {title: f.name + " Can edite", id: f.id, permission: {'Edit': Principal.fromText(f.id)}},
        ]
        multi_options = [...multi_options, ...new_options]
    });

    return <MultiAutoComplete
        onBlur={(e) => {
            e && props.onBlur && props.onBlur(e)
        }}
        onChange={(event, options: MultiOptions) => {

            let perm: Array<PermissionType> = options.map((option) => {
                return option.permission
            })
            props.onChange(perm)
            setMultiOptionsValue(perm)
        }}

        // onChange={(event, users: MultiOptions) => {
        //     let options = []
        //     users.map((user: any) => {
        //         options = options.filter((option: any) => option.id !== user.id);
        //         options.push(user);
        //     });
        //     setMultiOptionsValue(options)
        //     setShareFile((pre) => {
        //         let file = {...pre};
        //         file.users_permissions = options.map((user: any) => {
        //             return [Principal.fromText(user.id), user.permission]
        //         })
        //         return file
        //     })
        // }}
        value={multi_options_value.map((opt) => {
            let serialized_value = multi_options.find((option) => {
                return JSON.stringify(option.permission) === JSON.stringify(opt)
            });
            return serialized_value
        })}
        options={multi_options}
        multiple={true}
    />
}

function ChangeColumnPermissions(props: GridColumnMenuItemProps) {
    const {view, menuProps, colDef} = props;
    if (view?.type == PROMISES && PROMISES_CONTRACT_FIELDS.includes(colDef.field)) {
        return null
    }

    const [value, setValue] = React.useState<PermissionType[]>([]);
    const onChange = async (perm: Array<PermissionType>) => {
        console.log(perm)
        setValue(perm);
    };
    const onCLickAway = (e) => {
        // TODO let value = typeof e.target.value === 'string' ? [] : e.target.value
        // console.log({value: e.target.value, x: menuProps.colDef.permissions})
        if (value != menuProps.colDef.permissions) {
            let updated_column = {
                id: menuProps.colDef.id,
                permissions: value,
            };
            props.updateContract(updateContractColumn(props.contract, updated_column, props.current_contract));
        }


    }


    return (
        <MenuItem>
            <ColumnPermission
                onBlur={onCLickAway}
                value={menuProps.colDef.permissions}
                onChange={onChange}
            />
        </MenuItem>
    );
}

export default ChangeColumnPermissions;