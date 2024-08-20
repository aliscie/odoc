import {Input} from "@mui/material";
import { debounce } from 'lodash';

function RenameColumn(props: any) {
    const {setColumns, column} = props;
    const debouncedOnChange = debounce((e: any) => {
        setColumns((prev: any) => {
            return prev.map((c: any) => {
                if (c.key === column.key) {
                    return {...c, name: e.target.value};
                }
                return c;
            });
        });
    }, 300); // delay in ms

    const onBlur = (e: any) => {

    }
    const onClick = (e: any) => {
        // e.preventDefault()
    }
    return <Input
        onClick={onClick}
        defaultValue={props.column.name}
        onChange={debouncedOnChange}
        onBlur={onBlur}
    />
}

export default RenameColumn;
