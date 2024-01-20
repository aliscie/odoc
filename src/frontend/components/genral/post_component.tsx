import * as React from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, {IconButtonProps} from '@mui/material/IconButton';
import {normalize_content_tree} from "../../data_processing/normalize/normalize_contents";
import {FEChat, Post, PostUser} from "../../../declarations/user_canister/user_canister.did";
import AvatarChips from "./person_chip";
import formatTimestamp from "../../utils/time";
import EditorComponent from "../editor_components/main";
import {useDispatch, useSelector} from "react-redux";
import Person2Icon from "@mui/icons-material/Person2";
import BasicMenu from "./basic_menu";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import {handleRedux} from "../../redux/main";
import {Principal} from "@dfinity/principal";
import useGetChats from "../chat/use_get_chats";

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
    // user: User,
    // content?: any,
    buttons?: any
    headerAction?: any,
    // subheader?: string,
    post: PostUser | Post,
    onChange?: any,
    editable?: boolean,
    // avatar?: any,
}

export default function PostComponent(props: Props) {
    let {getChats, getOther} = useGetChats()
    const dispatch = useDispatch();

    const {
        profile,
    } = useSelector((state: any) => state.filesReducer);
    let creator = props.post.creator;
    let path = "/user?id=" + creator.id
    let options: any = [
        {content: "Profile", to: path, icon: <Person2Icon/>},
    ];
    if (profile && creator && profile.id == creator.id) {
        path = "/profile"

    } else {
        options.push({
            content: 'Message', icon: <ChatBubbleIcon/>, onClick: async () => {
                let res = await getChats()
                let chat = res.find((chat: FEChat) => chat.admins[0].id.toString() === creator.id || chat.creator.id.toString() === creator.id)
                dispatch(handleRedux("OPEN_CHAT", {
                    current_chat_id: chat && chat.id || "chat_id",
                    current_user: Principal.fromText(creator.id)
                }))
            }
        })
    }
    let content = normalize_content_tree(props.post.content_tree);
    // let avatar = <Link to={path}><AvatarChips size={"large"} user={props.post.creator}/></Link>


    let avatar = <BasicMenu
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
        <AvatarChips size={"large"} user={props.post.creator}/>
    </BasicMenu>

    let subheader = formatTimestamp(props.post.date_created)
    const [expanded, setExpanded] = React.useState(false);

    // const handleExpandClick = () => {
    //     setExpanded(!expanded);
    // };

    return (
        <Card
        >
            <CardHeader
                titleTypographyProps={{textAlign: "left"}}
                avatar={avatar}
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
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    {props.full_description}
                </CardContent>
            </Collapse>
        </Card>
    );
}