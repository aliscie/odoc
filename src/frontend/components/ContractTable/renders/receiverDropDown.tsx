import {RenderEditCellProps} from "react-data-grid";
import {useSelector} from "react-redux";


export function receiverDropDown({row, onRowChange}: RenderEditCellProps) {
    const {all_friends, profile} = useSelector((state: any) => state.filesState);

    return (
        <select
            className={'textEditorClassname'}
            value={row.receiver}
            onChange={(event) => onRowChange({...row, receiver: event.target.value}, true)}
            autoFocus
        >
            {[...all_friends, profile].map((u) => (
                <option key={u.name} value={u.name}>
                    {u.name}
                </option>
            ))}

        </select>
    );
}
