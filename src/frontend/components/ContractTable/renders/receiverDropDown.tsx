import {RenderEditCellProps} from "react-data-grid";
import {useSelector} from "react-redux";


export function receiverDropDown({row, onRowChange}: RenderEditCellProps) {
    return (
        <select
            className={'textEditorClassname'}
            value={row.receiver}
            onChange={(event) => onRowChange({...row, receiver: event.target.value}, true)}
            autoFocus
        >
            {/*{[...all_friends, profile].map((u) => (*/}
            {/*    <option key={u.name} value={u.name}>*/}
            {/*        {u.name}*/}
            {/*    </option>*/}
            {/*))}*/}

            {['ali', 'John', 'Jack', 'Smith'].map((status) => (
                <option key={status} value={status}>
                    {status}
                </option>
            ))}
        </select>
    );
}
