import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/system';

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
    index: number;
    id: string;
    dragOverPosition: 'middle' | 'under' | 'above';
    type: string;
  }) => void;
  preventDragUnder?: boolean;
}

const Draggable: React.FC<DraggableItemProps> = ({
  index,
  id,
  onDrop,
  preventDragUnder,
  children,
}) => {
  const [dragging, setDragging] = useState(false);
  const [draggedOver, setDraggedOver] = useState(false);
  const [dragOverPosition, setDragOverPosition] = useState<
    'middle' | 'under' | 'above'
  >('middle');

  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer?.setData('text/plain', id); // Store the id of the dragged item
    setDragging(true);
  };

  const handleDragEnd = () => {
    setDragging(false);
    setDraggedOver(false);
    setDragOverPosition('middle'); // Reset to middle when dragging ends
  };

  const handleDragEnter = () => {
    setDraggedOver(true);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDraggedOver(true);

    const target = event.currentTarget as HTMLElement;
    const boundingRect = target.getBoundingClientRect();
    const offsetY = event.clientY - boundingRect.top;

    if (offsetY < boundingRect.height / 3) {
      setDragOverPosition('above');
    } else if (offsetY > 2 * (boundingRect.height / 3)) {
      setDragOverPosition('under');
    } else {
      setDragOverPosition('middle');
    }
  };

  const handleDragLeave = () => {
    setDraggedOver(false);
    setDragOverPosition('middle'); // Reset to middle when leaving the item
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setDraggedOver(false);
    setDragOverPosition('middle');
    const draggedId = event.dataTransfer?.getData('text/plain'); // Retrieve the id of the dragged item
    if (draggedId && draggedId !== id) {
      await onDrop({ draggedId, id, dragOverPosition, type: 'any', index });
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
      style={{
        opacity: dragging ? 0.5 : 1,
        borderBottom: !dragging && dragOverPosition === 'under' ? '2px solid lightblue' : 'none',
        borderTop: !dragging && dragOverPosition === 'above' ? '2px solid lightblue' : 'none',
        backgroundColor: !dragging && dragOverPosition === 'middle' ? 'lightblue' : 'transparent',
      }}
    >
      {children}
    </DraggableItem>
  );
};

export default Draggable;
