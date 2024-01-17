import FormDialog from "../genral/dialog";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useSnackbar} from "notistack";
import {handleRedux} from "../../redux/main";
import MessagesList from "./messages_list";


function MessagesDialog() {
    const dispatch = useDispatch();

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {current_chat_id} = useSelector((state: any) => state.chatsReducer);
    // const [formValues, setFormValues]: any = React.useState({});
    // let [open, setOpen] = React.useState(true);

    // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const {id, value} = event.target;
    //     setFormValues((prevValues) => ({...prevValues, [id]: value}));
    // };
    // var photo = [];

    // async function handleUploadPhoto(e: any) {
    //     let image = e.target.files[0];
    //     let imageByteData = await convertToBytes(image);
    //     photo = imageByteData
    // }

    // const handleRegister = async () => {
    //     setOpen(true)
    // };

    return (
        <FormDialog
            // title={"Messages"}
            description={""}
            inputFields={
                <>
                    <MessagesList/>
                </>
            }
            buttons={[
                {name: "X", onClick: () => dispatch(handleRedux("OPEN_CHAT", {current_chat_id: false}))},
                // {name: "Register", onClick: handleRegister},
            ]}
            open={current_chat_id ? true : false}
        />
    );
}

export default MessagesDialog;
