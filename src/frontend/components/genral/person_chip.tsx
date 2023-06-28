import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import {convertToBlobLink} from "../../data_processing/image_to_vec";

export default function AvatarChips(props: any) {
    let image_link = convertToBlobLink(props.photo);
    return (
        <Stack direction="row" spacing={1}>
            <Chip
                avatar={<Avatar alt="Natacha" src={image_link}/>}
                label={props.name}
                variant="filled"
            />
        </Stack>
    );
}