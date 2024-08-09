import * as React from 'react';
import {useState} from 'react';
import {styled} from '@mui/system';

const DraggableItem = styled('div')({
    cursor: 'move',
    transition: 'opacity 0.2s, border-color 0.2s, background-color 0.2s',
    userSelect: 'none',
});

interface DraggableItemProps {
    index: number;
    id: string;
    onDrop: (map: {
        draggedId: string;
        targetId: string;
        dragOverPosition: "middle" | "under";
        type: string;
        index: number;
        clientY: number;
    }) => void;
    preventDragUnder?: boolean;
}

const Draggable: React.FC<DraggableItemProps> = ({parent, index, id, onDrop, preventDragUnder, children}) => {
    const [dragging, setDragging] = useState(false);
    // const [draggedOver, setDraggedOver] = useState(false);
    const [dragOverPosition, setDragOverPosition] = useState<'middle' | 'under' | 'above'>('');
    const [clientY, setClientY] = useState<number>(0);

    const handleDragStart = (event: React.DragEvent) => {
        event.dataTransfer?.setData('text/plain', id); // Store the id of the dragged item
        setDragging(true);
    };

    const handleDragEnd = () => {
        setDragging(false);
        // setDraggedOver(false);
        setDragOverPosition(''); // Reset to empty string when dragging ends
    };

    const handleDragEnter = () => {
        // setDraggedOver(true);
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        const {clientY} = event;
        setClientY(clientY); // Capture the Y-coordinate of the drag event
        const {top, height} = event.currentTarget.getBoundingClientRect();
        const middlePosition = top + (height / 2);

        if (clientY > middlePosition + (height / 5) && !preventDragUnder) {
            setDragOverPosition('under')
        } else if (clientY < middlePosition - (height / 5) && !preventDragUnder) {
            setDragOverPosition('above')
        } else {
            setDragOverPosition('middle')
        }
    };

    const handleDragLeave = () => {
        // setDraggedOver(false);
        setDragOverPosition(''); // Reset to empty when leaving the item
    };

    const handleDrop = async (event: React.DragEvent) => {
        event.preventDefault();
        // setDraggedOver(false);
        setDragOverPosition('');
        const draggedId = event.dataTransfer?.getData('text/plain'); // Retrieve the id of the dragged item
        if (draggedId && draggedId !== id) {
            await onDrop({
                draggedId,
                targetId: parent ? parent : id,
                dragOverPosition,
                type: "any",
                index,
                clientY
            });
        }
    };

    return (
        <DraggableItem
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div
                style={{
                    transition: '0.5s',
                    opacity: dragging ? 0.5 : 1,
                    borderTop: !dragging && dragOverPosition === 'above' ? '10px solid lightblue' : 'none',
                    borderBottom: !dragging && dragOverPosition === 'under' ? '10px solid lightblue' : 'none',
                    backgroundColor: !dragging && dragOverPosition === 'middle' ? 'lightblue' : 'transparent',
                }}
            >
                {children}
            </div>

        </DraggableItem>
    );
};

export default Draggable;