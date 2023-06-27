import * as React from "react";
import Autocomplete, {createFilterOptions} from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const filter = createFilterOptions<any>();

export default function FreeSoloCreateOption(props: any) {
    const [value, setValue] = React.useState<any | null>(props.value);

    return (
        <Autocomplete
            value={value}
            onChange={(event, newValue) => {
                if (typeof newValue === 'string') {
                    setValue(newValue);
                } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    setValue({
                        title: newValue.inputValue,
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
            getOptionLabel={(option: any) => option}
            renderOption={(props, option) => <li {...props}>{option}</li>}
            sx={{
                width: 300,
                '& .MuiInputBase-root': {
                    color: 'var(--color)', // Text color in the text field
                },
                '& .MuiAutocomplete-popper': {
                    backgroundColor: 'black', // Background color of the autocomplete list
                },
            }}
            freeSolo
            renderInput={(params) => <TextField {...params} />}
        />
    );
}
