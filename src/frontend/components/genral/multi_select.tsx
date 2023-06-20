import * as React from "react";
import {Autocomplete} from "@mui/material";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";

const MultiSelect = (props: any) => {
    const [selectedOptions, setSelectedOptions] = React.useState([]);

    const handleSelect = (_, value) => {
        setSelectedOptions(value);
    };

    return (
        <Autocomplete
            size={"small"}
            style={{display: "inline-block"}}
            multiple
            options={props.options}
            value={selectedOptions}
            onChange={handleSelect}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={props.label}
                />
            )}
        />
    );
};

export default MultiSelect;