import * as React from 'react';
import {useEffect, useState} from 'react';
import {Button, ListItemButton, ListItemText, TextField} from "@mui/material";
import {useSelector} from "react-redux";
import DialogOver from "./daiolog_over";
import MultiAutoComplete from "./multi_autocompelte";
import List from "@mui/material/List";
import CheckIcon from '@mui/icons-material/Check';
import {ShareFile, ShareFileInput, ShareFilePermission, User} from "../../../declarations/backend/backend.did";
import ShareIcon from "@mui/icons-material/Share";
import {actor} from "../../App";
import {Principal} from "@dfinity/principal";
import Autocomplete from "@mui/material/Autocomplete";
import useGetUser from "../../utils/get_user_by_principal";
import {useSnackbar} from "notistack";

type PermissionValue = 'CanComment' |
    'None' |
    'CanView' |
    'CanUpdate';
type MultiOptions = Array<{ title: string, id: string }>;
let Dialog = (props: any) => {

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    let {getUser, getUserByName} = useGetUser();
    const {current_file, profile} = useSelector((state: any) => state.filesReducer);
    // let file_share_id = current_file.share_id[0];
    let url = window.location.host;
    let share_link = `${url}/share?id=${current_file.id}`;
    let [saving, setSaving] = useState(false);
    let [is_copy, setCopy] = useState(false);
    // useEffect(() => {
    //
    //
    // }, [])

    let options = [
        'None', "CanView", "CanUpdate", "CanComment"
    ];

    const copyLink = async () => {
        navigator.clipboard.writeText(share_link);
        setCopy(true)
        setTimeout(() => {
            setCopy(false)
        }, 2000)
    };
    const {all_friends} = useSelector((state: any) => state.filesReducer);
    const [multi_options_value, setMultiOptionsValue] = useState<Array<{ title: string, id: string, permission: ShareFilePermission }>>([]);


    let multi_options: MultiOptions = [];
    all_friends.map((f: User) => {
        let new_options: MultiOptions = [
            {title: f.name + " Can View", id: f.id, permission: {"CanView": null}},
            {title: f.name + " Can Update", id: f.id, permission: {"CanUpdate": null}},
            {title: f.name + " Can Comment", id: f.id, permission: {'CanComment': null}}
        ]
        multi_options = [...multi_options, ...new_options]
    });


    let new_share_file: ShareFileInput = {
        'id': current_file.id, // TODO Note this is a security issue in which hackers may get the share file id from the browser
        permission: current_file.permission,
        'owner': Principal.fromText(profile.id),
        users_permissions: current_file.users_permissions,
    };
    let [share_file, setShareFile] = useState(new_share_file);

    useEffect(() => {
        (async () => {
            let res: undefined | { Ok: ShareFile } | { Err: string } = actor && await actor.get_share_file(current_file.id)
            if ("Ok" in res) {
                setShareFile((pre) => {
                    return {...pre, ...res.Ok}
                })

                setMultiOptionsValue(res.Ok.users_permissions.map((user_permission: [Principal, ShareFilePermission]) => {
                    let user: any = getUser(user_permission[0].toText());
                    let name = user ? user.name : "";
                    let id = user ? user.id : "";
                    let perm = " " + Object.keys(user_permission[1])[0];
                    return {title: name + perm, id, permission: user_permission[1]}
                }))
            }
        })()
    }, [current_file])


    return <List>
        <ListItemButton onClick={copyLink}>
            {saving && <ListItemText className={"loader"}></ListItemText>}
            <ListItemText>{share_link}</ListItemText>
            {is_copy ? <CheckIcon size={"small"} color={"success"}/> : null}
        </ListItemButton>

        <ListItemText
            // primaryTypographyProps={{style: {color: "var(--color)"}}}
            // secondaryTypographyProps={{style: props.canceled ? canceled_style : normal_style}}
            // primary={"Anyone with the link can "}
            // secondary={<MultiAutoComplete defaultValue={{title: "View"}} options={options} multiple={true}/>}
            secondary={<Autocomplete
                onChange={(event, value: PermissionValue) => {
                    if (value) {
                        let permission: any = {};
                        permission[value] = null;
                        setShareFile({...share_file, permission})
                    }
                }}
                value={Object.keys(share_file.permission)[0]}
                disablePortal
                id="combo-box-demo"
                options={options}
                sx={{width: 300}}
                renderInput={(params) => <TextField {...params} label="Permission"/>}
            />}
        />

        <ListItemText
            // primaryTypographyProps={{style: {color: "var(--color)"}}}
            // secondaryTypographyProps={{style: props.canceled ? canceled_style : normal_style}}
            primary={"Who can view/update/comment"}
            secondary={<MultiAutoComplete
                onChange={(event, users: MultiOptions) => {
                    let options = []
                    users.map((user: any) => {
                        options = options.filter((option: any) => option.id !== user.id);
                        options.push(user);
                    });
                    setMultiOptionsValue(options)
                    setShareFile((pre) => {
                        let file = {...pre};
                        file.users_permissions = options.map((user: any) => {
                            return [Principal.fromText(user.id), user.permission]
                        })
                        return file
                    })
                }}
                value={multi_options_value}
                options={multi_options}
                multiple={true}/>}
        />
        <Button
            onClick={async () => {
                setSaving(true)
                let res: undefined | { Ok: ShareFile } | { Err: string } = actor && await actor.share_file(share_file)
                if ("Err" in res) {
                    enqueueSnackbar(res.Err, {variant: "error"})
                }
                setSaving(false)
            }}
        >Save</Button>

    </List>
}

const ShareFileButton = () => {

    // const {current_file, files} = useSelector((state: any) => state.filesReducer);
    // let is_owner_current_file = current_file && files.find((file: any) => file.id === current_file.id);

    return (<>
            { <DialogOver
                variant="text"
                DialogContent={Dialog}
            >
                <ShareIcon/>
            </DialogOver>}
        </>
    );
};

export default ShareFileButton;
