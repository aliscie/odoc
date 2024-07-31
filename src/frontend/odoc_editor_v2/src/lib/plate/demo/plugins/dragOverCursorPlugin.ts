import { type PlatePlugin, findEventRange } from '@udecode/plate-common';

import { cursorStore } from '@/registry/default/plate-ui/cursor-overlay';

export const KEY_DRAG_OVER_CURSOR = 'dragOverCursor';

export const dragOverCursorPlugin: PlatePlugin = {
  handlers: {
    onDragEnd: () => () => {
      cursorStore.set.cursors({});
    },
    onDragLeave: () => () => {
      cursorStore.set.cursors({});
    },
    onDragOver: (editor) => (event) => {
      if (editor.isDragging) return;

      const range = findEventRange(editor, event);

      if (!range) return;

      cursorStore.set.cursors({
        drag: {
          data: {
            style: {
              backgroundColor: 'hsl(222.2 47.4% 11.2%)',
              width: 3,
            },
          },
          key: 'drag',
          selection: range,
        },
      });
    },
    onDrop: () => () => {
      cursorStore.set.cursors({});
    },
  },
  key: KEY_DRAG_OVER_CURSOR,
};
