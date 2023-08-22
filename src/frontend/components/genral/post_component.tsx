import * as React from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, {IconButtonProps} from '@mui/material/IconButton';

import {User} from "../../../declarations/user_canister/user_canister.did";
import AvatarChips from "./person_chip";

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
    content?: any,
    buttons?: any
    headerAction?: any,
    subheader?: string,
    avatar?: any,
}

export default function PostComponent(props: Props) {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card
        >
            <CardHeader
                titleTypographyProps={{textAlign: "left"}}
                avatar={props.avatar}
                action={props.headerAction}
                // title={props.user.name}
                subheader={props.subheader}
            />

            <CardContent>
                {props.content}
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