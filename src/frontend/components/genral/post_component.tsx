import * as React from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, {IconButtonProps} from '@mui/material/IconButton';
import {normalize_content_tree} from "../../data_processing/normalize/normalize_contents";
import {Post, PostUser} from "../../../declarations/user_canister/user_canister.did";
import AvatarChips from "./person_chip";
import formatTimestamp from "../../utils/time";
import EditorComponent from "../editor_components/main";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

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

    const {
        profile,
    } = useSelector((state: any) => state.filesReducer);

    let path = "/user?id=" + props.post.creator.id
    if (profile && props.post.creator && profile.id == props.post.creator.id) {
        path = "/profile"
    }
    let content = normalize_content_tree(props.post.content_tree);
    let avatar = <Link to={path}><AvatarChips size={"large"} user={props.post.creator}/></Link>
    let subheader = formatTimestamp(props.post.date_created)
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

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