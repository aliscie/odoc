import {PermissionType, User} from "../../../../declarations/user_canister/user_canister.did";
import {Principal} from "@dfinity/principal";
import MultiAutoComplete from "../../genral/multi_autocompelte";
import * as React from "react";
import {useState} from "react";
import {useSelector} from "react-redux";
import {GridColumnMenuItemProps} from "@mui/x-data-grid";
import {updateContractColumn} from "./utls";
import MenuItem from "@mui/material/MenuItem";
import BasicPopover from "../../genral/pop_over";

interface Props {
    // column: CColumn,
    // contract: CContract,
    value: Array<PermissionType>,
    onChange: (event: Array<PermissionType>) => any

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
    })

    return <MultiAutoComplete
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
    const {menuProps} = props;
    const [value, setValue] = React.useState<PermissionType[]>([]);
    const onChange = async (perm: Array<PermissionType>) => {
        setValue(perm);
    };
    const onCLickAway = () => {
        if (value.length > 0) {
            console.log("onCLickAway")
            let updated_column = {
                id: menuProps.colDef.id,
                permissions: value,
            };

            // Use the updated state directly instead of relying on closure
            props.setContract((prevContract) =>
                updateContractColumn(prevContract, updated_column, props.view)
            );
            setValue([])
        }
        // Use the previous state to ensure the correct update
        // setData((prevData) => ({
        //     ...prevData,
        //     columns: prevData.columns.map((column: CColumn) => {
        //         if (column.id === updated_column.id) {
        //             return {...column, permission: updated_column.permission};
        //         }
        //         return column;
        //     }),
        // }));
    }


    return (
        <MenuItem>
            <BasicPopover onClickAway={onCLickAway} content={<ColumnPermission value={menuProps.colDef.permissions}
                                                                               onChange={onChange}/>}>Permissions</BasicPopover>
        </MenuItem>
    );
}

export default ChangeColumnPermissions;