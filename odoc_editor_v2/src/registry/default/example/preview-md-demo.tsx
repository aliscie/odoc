/* eslint-disable prettier/prettier */

import { cn } from '@udecode/cn';
import {
  Plate,
  type TRenderLeafProps,
  type TText,
  type Value,
  createPluginFactory, isText
} from "@udecode/plate-common";
import { createPlugins } from "@udecode/plate-core";
import Prism from 'prismjs';

import { editableProps } from '@/lib/plate/demo/editableProps';
import { plateUI } from '@/lib/plate/demo/plateUI';
import { basicNodesPlugins } from '@/lib/plate/demo/plugins/basicNodesPlugins';
import { previewMdValue } from '@/lib/plate/demo/values/previewMdValue';
import { Editor } from '@/registry/default/plate-ui/editor';

import 'prismjs/components/prism-markdown';

/**
 * Decorate texts with markdown preview.
 */
const decoratePreview =
  () =>
  ([node, path]: any) => {
    const ranges: any[] = [];

    if (!isText(node)) {
      return ranges;
    }

    const getLength = (token: any) => {
      if (typeof token === 'string') {
        return token.length;
      }
      if (typeof token.content === 'string') {
        return token.content.length;
      }

      return token.content.reduce((l: any, t: any) => l + getLength(t), 0);
    };

    const tokens = Prism.tokenize(node.text, Prism.languages.markdown);
    let start = 0;

    for (const token of tokens) {
      const length = getLength(token);
      const end = start + length;

      if (typeof token !== 'string') {
        ranges.push({
          anchor: { offset: start, path },
          focus: { offset: end, path },
          [token.type]: true,
        });
      }

      start = end;
    }

    return ranges;
  };

const createPreviewPlugin = createPluginFactory({
  decorate: decoratePreview,
  key: 'preview-md',
});

const plugins = createPlugins([...basicNodesPlugins, createPreviewPlugin()], {
  components: plateUI,
});

function PreviewLeaf({
  attributes,
  children,
  leaf,
}: TRenderLeafProps<
  Value,
  {
    blockquote?: boolean;
    bold?: boolean;
    code?: boolean;
    hr?: boolean;
    italic?: boolean;
    list?: boolean;
    title?: boolean;
  } & TText
>) {
  const { blockquote, bold, code, hr, italic, list, title } = leaf;

  return (
    <span
      {...attributes}
      className={cn(
        bold && 'font-bold',
        italic && 'italic',
        title && 'mx-0 mb-2.5 mt-5 inline-block text-[20px] font-bold',
        list && 'pl-2.5 text-[20px] leading-[10px]',
        hr && 'block border-b-2 border-[#ddd] text-center',
        blockquote &&
          'inline-block border-l-2 border-[#ddd] pl-2.5 italic text-[#aaa]',
        code && 'bg-[#eee] p-[3px] font-mono'
      )}
    >
      {children}
    </span>
  );
}

const _editableProps = {
  ...editableProps,
  renderLeaf: PreviewLeaf,
};

export default function PreviewMdDemo() {
  return (
    <div className="p-10">
      <Plate initialValue={previewMdValue} plugins={plugins}>
        <Editor {..._editableProps} />
      </Plate>
    </div>
  );
}
