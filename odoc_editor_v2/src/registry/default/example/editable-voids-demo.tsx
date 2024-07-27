'use client';

import { useState } from 'react';

import { createBasicElementsPlugin } from '@udecode/plate-basic-elements';
import {
  createExitBreakPlugin,
  createSoftBreakPlugin,
} from '@udecode/plate-break';
import {
  Plate,
  type PlateRenderElementProps,
  createPluginFactory,
} from '@udecode/plate-common';
import { createPlugins } from '@udecode/plate-core';
import { createResetNodePlugin } from '@udecode/plate-reset-node';
import { RadioGroup, RadioItem } from '@radix-ui/react-dropdown-menu';

import { editableProps } from '@/lib/plate/demo/editableProps';
import { plateUI } from '@/lib/plate/demo/plateUI';
import { basicNodesPlugins } from '@/lib/plate/demo/plugins/basicNodesPlugins';
import { exitBreakPlugin } from '@/lib/plate/demo/plugins/exitBreakPlugin';
import { resetBlockTypePlugin } from '@/lib/plate/demo/plugins/resetBlockTypePlugin';
import { softBreakPlugin } from '@/lib/plate/demo/plugins/softBreakPlugin';
import { editableVoidsValue } from '@/lib/plate/demo/values/editableVoidsValue';
import { Editor } from '@/registry/default/plate-ui/editor';
import { Input } from '@/registry/default/plate-ui/input';

export const ELEMENT_EDITABLE_VOID = 'editable-void';

export const createEditableVoidPlugin = createPluginFactory({
  isElement: true,
  isVoid: true,
  key: ELEMENT_EDITABLE_VOID,
});

const editableVoidPlugins = createPlugins(
  [
    createBasicElementsPlugin(),
    createResetNodePlugin(resetBlockTypePlugin),
    createSoftBreakPlugin(softBreakPlugin),
    createExitBreakPlugin(exitBreakPlugin),
  ],
  {
    components: plateUI,
  }
);

export function EditableVoidElement({
  attributes,
  children,
}: PlateRenderElementProps) {
  const [inputValue, setInputValue] = useState('');

  return (
    // Need contentEditable=false or Firefox has issues with certain input types.
    <div {...attributes} contentEditable={false}>
      <div className="mt-2 grid gap-6 rounded-md border p-6 shadow">
        <Input
          className="my-2"
          id="name"
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          placeholder="Name"
          type="text"
          value={inputValue}
        />

        <div className="grid w-full max-w-sm items-center gap-2">
          <label htmlFor="handed">Left or right handed:</label>

          <RadioGroup defaultValue="r1" id="handed">
            <div className="flex items-center space-x-2">
              <RadioItem id="r1" value="r1" />
              <label htmlFor="r1">Left</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioItem id="r2" value="r2" />
              <label htmlFor="r2">Right</label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid gap-2">
          <label htmlFor="editable-void-basic-elements">
            Tell us about yourself:
          </label>

          <Plate
            id="editable-void-basic-elements"
            plugins={editableVoidPlugins}
            // initialValue={basicElementsValue}
          >
            <Editor {...editableProps} />
          </Plate>
        </div>
      </div>
      {children}
    </div>
  );
}

const plugins = createPlugins(
  [
    ...basicNodesPlugins,
    createEditableVoidPlugin({
      component: EditableVoidElement,
    }),
  ],
  {
    components: plateUI,
  }
);

export default function EditableVoidsDemo() {
  return (
    <div className="p-10">
      <Plate initialValue={editableVoidsValue} plugins={plugins}>
        <Editor {...editableProps} />
      </Plate>
    </div>
  );
}
