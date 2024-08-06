import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import {convertToBlobLink} from "../../data_processing/image_to_vec";
import {User} from "../../../declarations/backend/backend.did";

interface Props {
    user: User,
    size: "small" | "medium" | "large" | undefined,
}

export default function AvatarChips(props: Props) {
    let image_link = convertToBlobLink(props.user && props.user.photo);
    return (
        <Stack direction="row" spacing={1}>
            <Chip
                avatar={<Avatar size={props.size} alt="Natacha" src={image_link}/>}
                label={props.user && props.user.name}
                variant="filled"
            />
        </Stack>
    );
}