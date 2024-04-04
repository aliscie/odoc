import * as React from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, {IconButtonProps} from '@mui/material/IconButton';
import {normalize_content_tree} from "../../data_processing/normalize/normalize_contents";
import {FEChat, PostUser, UserFE} from "../../../declarations/user_canister/user_canister.did";
import formatTimestamp from "../../utils/time";
import EditorComponent from "../editor_components/main";
import {useDispatch, useSelector} from "react-redux";
import Person2Icon from "@mui/icons-material/Person2";
import BasicMenu from "./basic_menu";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import {handleRedux} from "../../redux/main";
import {Principal} from "@dfinity/principal";
import useGetChats from "../chat/use_get_chats";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import {convertToBlobLink} from "../../data_processing/image_to_vec";
import {User} from "../../../../.dfx/local/canisters/user_canister/service.did";

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme, expand}) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    // transition: theme.transitions.create('transform', {
    //     duration: theme.transitions.duration.shortest,
    // }),
}));

interface Props {
    buttons?: any
    headerAction?: any,
    post: PostUser,
    onChange?: any,
    editable?: boolean,
}


export function UserAvatar(props: UserFE | User) {

    let path = "/user?id=" + props.id
    let {getChats, getOther} = useGetChats()
    const dispatch = useDispatch();
    const {
        profile,
    } = useSelector((state: any) => state.filesReducer);

    let options: any = [];
    if (profile && props.id && profile.id == props.id) {
        path = "/profile"
        options.push({content: "Profile", to: path, icon: <Person2Icon/>});
    } else {
        options.push({
            content: 'Message', icon: <ChatBubbleIcon/>, onClick: async () => {
                let res = await getChats()
                let chat = res.find((chat: FEChat) => chat.admins[0].id.toString() === props.id || chat.creator.id.toString() === props.id)

                dispatch(handleRedux("OPEN_CHAT", {
                    current_chat_id: chat && chat.id || "chat_id",
                    current_user: Principal.fromText(props.id)
                }))
            }
        })
        options.push({content: "Profile", to: path, icon: <Person2Icon/>});
    }

    return <BasicMenu
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        options={options}
    >
        <Chip
            avatar={<Avatar size={"small"} alt={props.name} src={convertToBlobLink(props.photo)}/>}
            label={props.name}
            variant="filled"
        />
        {/*// <AvatarChips size={"large"} user={props} src={convertToBlobLink(props.photo)}/>*/}
    </BasicMenu>
}

export default function PostComponent(props: Props) {


    let content = normalize_content_tree(props.post.content_tree);


    let subheader = formatTimestamp(props.post.date_created)

    return (
        <Card
        >
            <CardHeader
                titleTypographyProps={{textAlign: "left"}}
                avatar={<UserAvatar {...props.post.creator}/>}
                action={props.headerAction}
                // title={props.user.name}
                subheader={subheader}
            />

            <CardContent>
                <EditorComponent
                    editable={props.editable}
                    onChange={props.onChange}
                    content={content}/>
            </CardContent>

            <CardActions disableSpacing>
                {props.buttons}

                {/*<ExpandMore*/}
                {/*    expand={expanded}*/}
                {/*    onClick={handleExpandClick}*/}
                {/*    aria-expanded={expanded}*/}
                {/*    aria-label="show more"*/}
                {/*>*/}
                {/*    <ExpandMoreIcon/>*/}
                {/*</ExpandMore>*/}
            </CardActions>
            {/*<Collapse in={expanded} timeout="auto" unmountOnExit>*/}
            {/*    <CardContent>*/}
            {/*        {props.full_description}*/}
            {/*    </CardContent>*/}
            {/*</Collapse>*/}
        </Card>
    );
}