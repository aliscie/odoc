import FaceIcon from "@mui/icons-material/Face";
import {Avatar, Card, CardContent, Chip, Tooltip, Typography} from "@mui/material";
import * as React from "react";


const UserInfoCard = ({user}) => {
    const {avatar, name, age, email} = user;

    return (
        <Card>
            <CardContent>
                <Avatar src={avatar} alt={name}/>
                <Typography variant="h5" component="h2">
                    {name}
                </Typography>
                <Typography color="textSecondary">
                    Age: {age}
                </Typography>
                <Typography color="textSecondary">
                    Email: {email}
                </Typography>
            </CardContent>
        </Card>
    );
};

const user = {
    avatar: 'path/to/avatar.png',
    name: 'John Doe',
    age: 30,
    email: 'johndoe@example.com'
};

function MentionComponent(props: any) {
    // return (<Tooltip arrow placement={"top"} title={<UserInfoCard user={user}/>}>
    //     <Chip size={"small"}  {...props.element}
    //           icon={<FaceIcon style={{color: 'var(--text-color)'}}/>}
    //           label={props.element.character}/>
    // </Tooltip>)
    return (<Tooltip arrow placement={"top"} title={<UserInfoCard user={user}/>}>
        <span contentEditable={false} style={{color: "blue"}}>@{props.element.character}</span>
    </Tooltip>)
}

export default MentionComponent