import FormDialog from "../genral/dialog";
import * as React from "react";
import {TextField} from "@mui/material";
import {actor} from "../../backend_connect/ic_agent";
import {useSelector} from "react-redux";
import {useSnackbar} from "notistack";
import {convertToBytes} from "../../data_processing/image_to_vec";

const inputs = [
    {id: "username", label: "Username", type: "text", required: true},
    {id: "bio", label: "bio", type: "multiline", required: true},
    {id: "first_name", label: "first name", type: "text"},
    {id: "last_name", label: "last name", type: "text"},
    {id: "email", label: "Email", type: "email"},
    {id: "photo", label: "photo", type: "file"},
];

function RegistrationForm() {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {Anonymous} = useSelector((state: any) => state.filesReducer);
    const [formValues, setFormValues]: any = React.useState({});
    let [open, setOpen] = React.useState(Anonymous == true);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {id, value} = event.target;
        setFormValues((prevValues) => ({...prevValues, [id]: value}));
    };
    var photo = [];
    async function handleUploadPhoto(e: any) {
        let image = e.target.files[0];
        let imageByteData = await convertToBytes(image);
        photo = imageByteData
    }

    const handleRegister = async () => {
        setOpen(false)

        let loader_message = <span>Creating agreement... <span className={"loader"}/></span>;
        let loading = enqueueSnackbar(loader_message, {variant: "info"});
        let register = await actor.register({
            name: [formValues.username],
            description: [formValues.bio],
            photo: [photo]
        });
        closeSnackbar(loading)

        if (register.Ok) {
            enqueueSnackbar(`Welcome ${register.Ok.name}, to Odoc`, {variant: "success"});
        } else {
            enqueueSnackbar(register.Err, {variant: "error"});
            setOpen(true)
        }
    };

    return (
        <FormDialog
            title={"Register yourself here."}
            description={""}
            inputFields={
                <>
                    {inputs.map((input) => (
                        <>
                            <img id={"photo-preview"}/>
                            <TextField
                                required={input.required == true}
                                multiline={input.type === "multiline"}
                                key={input.id}
                                autoFocus
                                margin="dense"
                                id={input.id}
                                label={input.label}
                                type={input.type}
                                fullWidth
                                variant="standard"
                                value={formValues[input.id] || ""}
                                onChange={input.type === 'file' ? handleUploadPhoto : handleChange}

                            />
                        </>
                    ))}
                </>
            }
            buttons={[
                {name: "Cancel", onClick: () => setOpen(false)},
                {name: "Register", onClick: handleRegister},
            ]}
            open={open}
        />
    );
}

export default RegistrationForm;
