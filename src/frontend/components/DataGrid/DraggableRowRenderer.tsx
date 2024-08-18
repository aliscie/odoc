import {useDrag, useDrop} from 'react-dnd';
import {RenderRowProps, Row} from "react-data-grid";
import {logger} from "../../DevUtils/logData";
//
//
interface DraggableRowRenderProps<R, SR> extends RenderRowProps<R, SR> {
    onRowReorder: (sourceIndex: number, targetIndex: number) => void;
}

//
export function DraggableRowRenderer<R, SR>({
                                                rowIdx,
                                                isRowSelected,
                                                className,
                                                onRowReorder,
                                                ...props
                                            }: DraggableRowRenderProps<R, SR>) {

    const [{isDragging}, drag] = useDrag({
        type: 'ROW_DRAG',
        item: {index: rowIdx},
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    const [{isOver}, drop] = useDrop({
        accept: 'ROW_DRAG',
        drop({index}: { index: number }) {
            onRowReorder(index, rowIdx);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    });

    return (
        <Row
            className={className}
            ref={(ref) => {
                if (ref) {
                    drag(ref.firstElementChild);
                }
                drop(ref);
            }}
            rowIdx={rowIdx}
            isRowSelected={isRowSelected}
            // style={{
            //     transition: '0.4s',
            //     display: isDragging ? 'none' : true,
            //     background: isOver ? 'lightblue' : 'none'
            // }}
            {...props}
        />
    );
}

