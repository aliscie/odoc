import {RenderEditCellProps} from "react-data-grid";
import {useSelector} from "react-redux";
import {PaymentStatus} from "../../../../declarations/backend/backend.did";


export function statusDropDown({row, onRowChange}: RenderEditCellProps) {
    return (
        <select
            className={'textEditorClassname'}
            value={row.status}
            onChange={(event) => onRowChange({...row, status: event.target.value}, true)}
            autoFocus
        >
            {['None', 'RequestCancellation', 'Released', 'Objected', 'Confirmed', 'ConfirmedCancellation', 'ApproveHighPromise', 'HighPromise'].map((status) => (
                <option key={status} value={status}>
                    {status}
                </option>
            ))}
        </select>
    );
}
