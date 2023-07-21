import * as React from "react";
import Autocomplete, {createFilterOptions} from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import AvatarChips from "./person_chip";

const filter = createFilterOptions<any>();

export default function FreeSoloCreateOption(props: any) {
    const [value, setValue] = React.useState<any | null>(props.value);

    return (
        <Autocomplete
            value={value}
            onChange={(event, newValue) => {
                props.onChange && props.onChange(newValue);
                if (typeof newValue === 'string') {
                    setValue(newValue);
                } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    setValue({
                        title: newValue.name,
                    });
                } else {
                    setValue(newValue);
                }
            }}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);
                return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            id="free-solo-with-text-demo"
            options={props.options}
            getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === 'string') {
                    return option;
                }
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                    return option.inputValue;
                }
                // Regular option
                return option.name;
            }}
            renderOption={(props, option) => <li  {...props}><AvatarChips user={option}/></li>}
            sx={{
                width: 300,
            }}
            freeSolo
            renderInput={(params) => <TextField {...params} />}
        />
    );
}
