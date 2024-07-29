import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import { Plate } from '@udecode/plate-common';
import { createPlugins } from '@udecode/plate-core';

import { editableProps } from '@/lib/plate/demo/editableProps';
import { plateUI } from '@/lib/plate/demo/plateUI';
import { basicNodesPlugins } from '@/lib/plate/demo/plugins/basicNodesPlugins';
import { iframeValue } from '@/lib/plate/demo/values/iframeValue';
import { Editor } from '@/registry/default/plate-ui/editor';

import {
  EditableVoidElement,
  createEditableVoidPlugin,
} from './editable-voids-demo';

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

export function IFrame({ children, ...props }: any) {
  const [contentRef, setContentRef] = useState<any>(null);
  const mountNode = contentRef?.contentWindow?.document.body;

  return (
    // eslint-disable-next-line jsx-a11y/iframe-has-title
    <iframe {...props} ref={setContentRef}>
      {mountNode && createPortal(React.Children.only(children), mountNode)}
    </iframe>
  );
}

export default function IframeDemo() {
  return (
    <IFrame className="p-10">
      <Plate initialValue={iframeValue} plugins={plugins}>
        <Editor {...editableProps} />
      </Plate>
    </IFrame>
  );
}
