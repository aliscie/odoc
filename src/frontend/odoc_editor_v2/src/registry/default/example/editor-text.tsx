'use client';

import { createBasicElementsPlugin } from '@udecode/plate-basic-elements';
import { createBasicMarksPlugin } from '@udecode/plate-basic-marks';
import { Plate, createPlugins } from '@udecode/plate-common';

import { createPlateUI } from '@/lib/plate/create-plate-ui';
import { Editor } from '@/registry/default/plate-ui/editor';
import { FloatingToolbar } from '@/registry/default/plate-ui/floating-toolbar';
import { FloatingToolbarButtons } from '@/registry/default/plate-ui/floating-toolbar-buttons';

export default function EditorText() {
  const plugins = createPlugins(
    [createBasicElementsPlugin(), createBasicMarksPlugin()],
    { components: createPlateUI() }
  );

  return (
    <div className="mt-[72px] grid gap-1.5 p-10">
      <Plate plugins={plugins}>
        <label htmlFor="message-2" className="block text-sm font-medium text-gray-700">
          Your Message
        </label>
        <Editor id="message-2" placeholder="Type your message here." />

        <FloatingToolbar>
          <FloatingToolbarButtons />
        </FloatingToolbar>

        <p className="text-sm text-muted-foreground">
          Your message will be copied to the support team.
        </p>
      </Plate>
    </div>
  );
}
