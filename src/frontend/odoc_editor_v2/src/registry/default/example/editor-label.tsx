'use client';

import { createBasicElementsPlugin } from '@udecode/plate-basic-elements';
import { createBasicMarksPlugin } from '@udecode/plate-basic-marks';
import { Plate, createPlugins } from '@udecode/plate-common';

// import { Label } from '@radix-ui/react-dropdown-menu';
import { createPlateUI } from '@/lib/plate/create-plate-ui';
import { Editor } from '@/registry/default/plate-ui/editor';
import { FloatingToolbar } from '@/registry/default/plate-ui/floating-toolbar';
import { FloatingToolbarButtons } from '@/registry/default/plate-ui/floating-toolbar-buttons';

export default function EditorLabel() {
  const plugins = createPlugins(
    [createBasicElementsPlugin(), createBasicMarksPlugin()],
    { components: createPlateUI() }
  );

  return (
    <div className="mt-[72px] grid gap-1.5 p-10">
      <Plate id="message" plugins={plugins}>
        <label htmlFor="message">Your message</label>
        <Editor id="message" placeholder="Type your message here." />

        <FloatingToolbar>
          <FloatingToolbarButtons />
        </FloatingToolbar>
      </Plate>
    </div>
  );
}
