import { KEY_ALIGN } from '@udecode/plate-alignment';
import { KEY_AUTOFORMAT } from '@udecode/plate-autoformat';
import {
  KEY_EXIT_BREAK,
  KEY_SINGLE_LINE,
  KEY_SOFT_BREAK,
} from '@udecode/plate-break';
import { KEY_CAPTION } from '@udecode/plate-caption';
import { MARK_COMMENT } from '@udecode/plate-comments';
import { KEY_DND } from '@udecode/plate-dnd';
import { KEY_EMOJI } from '@udecode/plate-emoji';
import { ELEMENT_EXCALIDRAW } from '@udecode/plate-excalidraw';
import { MARK_BG_COLOR, MARK_FONT_SIZE } from '@udecode/plate-font';
import { MARK_HIGHLIGHT } from '@udecode/plate-highlight';
import { ELEMENT_HR } from '@udecode/plate-horizontal-rule';
import { KEY_INDENT } from '@udecode/plate-indent';
import { KEY_LIST_STYLE_TYPE } from '@udecode/plate-indent-list';
import { MARK_KBD } from '@udecode/plate-kbd';
import { ELEMENT_COLUMN_GROUP } from '@udecode/plate-layout';
import { KEY_LINE_HEIGHT } from '@udecode/plate-line-height';
import { ELEMENT_LINK } from '@udecode/plate-link';
import { ELEMENT_TODO_LI } from '@udecode/plate-list';
import { ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED } from '@udecode/plate-media';
import { ELEMENT_MENTION } from '@udecode/plate-mention';
import { KEY_NODE_ID } from '@udecode/plate-node-id';
import { KEY_NORMALIZE_TYPES } from '@udecode/plate-normalizers';
import { KEY_RESET_NODE } from '@udecode/plate-reset-node';
import { KEY_BLOCK_SELECTION } from '@udecode/plate-selection';
import { KEY_DESERIALIZE_CSV } from '@udecode/plate-serializer-csv';
import { KEY_DESERIALIZE_DOCX } from '@udecode/plate-serializer-docx';
import { KEY_DESERIALIZE_MD } from '@udecode/plate-serializer-md';
import { KEY_TABBABLE } from '@udecode/plate-tabbable';
import { ELEMENT_TABLE } from '@udecode/plate-table';
import { ELEMENT_TOGGLE } from '@udecode/plate-toggle';
import { KEY_TRAILING_BLOCK } from '@udecode/plate-trailing-block';

import { columnValue } from '@/lib/plate/demo/values/columnValue';
import { KEY_DRAG_OVER_CURSOR } from '@/lib/plate/demo/plugins/dragOverCursorPlugin';
import { alignValue } from '@/lib/plate/demo/values/alignValue';
import { autoformatValue } from '@/lib/plate/demo/values/autoformatValue';
import { basicElementsValue } from '@/lib/plate/demo/values/basicElementsValue';
import { basicMarksValue } from '@/lib/plate/demo/values/basicMarksValue';
import { commentsValue } from '@/lib/plate/demo/values/commentsValue';
import { cursorOverlayValue } from '@/lib/plate/demo/values/cursorOverlayValue';
import { deserializeCsvValue } from '@/lib/plate/demo/values/deserializeCsvValue';
import { deserializeDocxValue } from '@/lib/plate/demo/values/deserializeDocxValue';
import { deserializeHtmlValue } from '@/lib/plate/demo/values/deserializeHtmlValue';
import { deserializeMdValue } from '@/lib/plate/demo/values/deserializeMdValue';
import { emojiValue } from '@/lib/plate/demo/values/emojiValue';
import { excalidrawValue } from '@/lib/plate/demo/values/excalidrawValue';
import {
  exitBreakValue,
  trailingBlockValue,
} from '@/lib/plate/demo/values/exitBreakValue';
import { fontValue } from '@/lib/plate/demo/values/fontValue';
import { highlightValue } from '@/lib/plate/demo/values/highlightValue';
import { horizontalRuleValue } from '@/lib/plate/demo/values/horizontalRuleValue';
import { indentListValue } from '@/lib/plate/demo/values/indentListValue';
import { indentValue } from '@/lib/plate/demo/values/indentValue';
import { kbdValue } from '@/lib/plate/demo/values/kbdValue';
import { lineHeightValue } from '@/lib/plate/demo/values/lineHeightValue';
import { linkValue } from '@/lib/plate/demo/values/linkValue';
import { listValue, todoListValue } from '@/lib/plate/demo/values/listValue';
import { mediaValue } from '@/lib/plate/demo/values/mediaValue';
import { mentionValue } from '@/lib/plate/demo/values/mentionValue';
import { placeholderValue } from '@/lib/plate/demo/values/placeholderValue';
import { singleLineValue } from '@/lib/plate/demo/values/singleLineValue';
import { softBreakValue } from '@/lib/plate/demo/values/softBreakValue';
import { tabbableValue } from '@/lib/plate/demo/values/tabbableValue';
import { tableValue } from '@/lib/plate/demo/values/tableValue';
import { toggleValue } from '@/lib/plate/demo/values/toggleValue';

export type ValueId = 'tableMerge' | keyof typeof customizerPlugins;

// cmdk needs lowercase
export const customizerPlugins = {
  align: {
    id: 'align',
    label: 'Align',
    plugins: [KEY_ALIGN],
    route: '/docs/alignment',
    value: alignValue,
  },
  autoformat: {
    id: 'autoformat',
    label: 'Autoformat',
    plugins: [KEY_AUTOFORMAT],
    route: '/docs/autoformat',
    value: autoformatValue,
  },
  basicmarks: {
    id: 'basicmarks',
    label: 'Basic Marks',
    plugins: [],
    route: '/docs/basic-marks',
    value: [...basicElementsValue, ...basicMarksValue],
  },
  basicnodes: {
    id: 'basicnodes',
    label: 'Basic Nodes',
    plugins: [],
    route: '/docs/basic-elements',
    value: [...basicElementsValue, ...basicMarksValue],
  },
  blockselection: {
    id: 'blockselection',
    label: 'Block Selection',
    plugins: [
      KEY_NODE_ID,
      KEY_BLOCK_SELECTION,
      ELEMENT_IMAGE,
      ELEMENT_MEDIA_EMBED,
    ],
    route: '/docs/block-selection',
    value: mediaValue,
  },
  caption: {
    id: 'caption',
    label: 'Caption',
    plugins: [KEY_CAPTION],
    route: '/docs/caption',
    value: mediaValue,
  },
  column: {
    id: 'column',
    label: 'Column',
    plugins: [ELEMENT_COLUMN_GROUP],
    route: '/docs/column',
    value: columnValue,
  },
  comment: {
    id: 'comment',
    label: 'Comment',
    plugins: [MARK_COMMENT],
    route: '/docs/comments',
    value: commentsValue,
  },
  cursoroverlay: {
    id: 'cursoroverlay',
    label: 'Cursor Overlay',
    plugins: [KEY_DRAG_OVER_CURSOR],
    route: '/docs/cursor-overlay',
    value: cursorOverlayValue,
  },
  deserializecsv: {
    id: 'deserializecsv',
    label: 'Deserialize CSV',
    plugins: [KEY_DESERIALIZE_CSV],
    route: '/docs/serializing-csv',
    value: deserializeCsvValue,
  },
  deserializedocx: {
    id: 'deserializedocx',
    label: 'Deserialize DOCX',
    plugins: [KEY_DESERIALIZE_DOCX],
    route: '/docs/serializing-docx',
    value: deserializeDocxValue,
  },
  deserializehtml: {
    id: 'deserializehtml',
    label: 'Deserialize HTML',
    plugins: [],
    route: '/docs/serializing-html',
    value: deserializeHtmlValue,
  },
  deserializemd: {
    id: 'deserializemd',
    label: 'Deserialize Markdown',
    plugins: [KEY_DESERIALIZE_MD],
    route: '/docs/serializing-md',
    value: deserializeMdValue,
  },
  dnd: {
    id: 'dnd',
    label: 'Drag & Drop',
    plugins: [KEY_DND],
    route: '/docs/components/draggable',
    value: [],
  },
  emoji: {
    id: 'emoji',
    label: 'Emoji',
    plugins: [KEY_EMOJI],
    route: '/docs/emoji',
    value: emojiValue,
  },
  excalidraw: {
    id: 'excalidraw',
    label: 'Excalidraw',
    plugins: [ELEMENT_EXCALIDRAW],
    route: '/docs/excalidraw',
    value: excalidrawValue,
  },
  exitbreak: {
    id: 'exitbreak',
    label: 'Exit Break',
    plugins: [KEY_EXIT_BREAK],
    route: '/docs/exit-break',
    value: exitBreakValue,
  },
  font: {
    id: 'font',
    label: 'Font',
    plugins: [MARK_FONT_SIZE, MARK_BG_COLOR],
    route: '/docs/font',
    value: fontValue,
  },
  forcedlayout: {
    id: 'forcedlayout',
    label: 'Forced Layout',
    plugins: [KEY_NORMALIZE_TYPES, KEY_TRAILING_BLOCK],
    route: '/docs/forced-layout',
    value: [],
  },
  highlight: {
    id: 'highlight',
    label: 'Highlight',
    plugins: [MARK_HIGHLIGHT],
    route: '/docs/highlight',
    value: highlightValue,
  },
  hr: {
    id: 'hr',
    label: 'Horizontal Rule',
    plugins: [ELEMENT_HR],
    route: '/docs/horizontal-rule',
    value: horizontalRuleValue,
  },
  indent: {
    id: 'indent',
    label: 'Indent',
    plugins: [KEY_INDENT],
    route: '/docs/indent',
    value: indentValue,
  },
  indentlist: {
    id: 'indentlist',
    label: 'Indent List',
    plugins: [KEY_LIST_STYLE_TYPE],
    route: '/docs/indent-list',
    value: indentListValue,
  },
  kbd: {
    id: 'kbd',
    label: 'Keyboard Input',
    plugins: [MARK_KBD],
    route: '/docs/components/kbd-leaf',
    value: kbdValue,
  },
  lineheight: {
    id: 'lineheight',
    label: 'Line Height',
    plugins: [KEY_LINE_HEIGHT],
    route: '/docs/line-height',
    value: lineHeightValue,
  },
  link: {
    id: 'link',
    label: 'Link',
    plugins: [ELEMENT_LINK],
    route: '/docs/link',
    value: linkValue,
  },
  list: {
    id: 'list',
    label: 'List',
    plugins: ['list'],
    route: '/docs/list',
    value: listValue,
  },
  media: {
    id: 'media',
    label: 'Media',
    plugins: [ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED],
    route: '/docs/media',
    value: mediaValue,
  },
  mention: {
    id: 'mention',
    label: 'Mention',
    plugins: [ELEMENT_MENTION],
    route: '/docs/mention',
    value: mentionValue,
  },
  placeholder: {
    id: 'placeholder',
    label: 'Placeholder',
    plugins: [],
    route: '/docs/components/placeholder',
    value: placeholderValue,
  },
  playground: {
    id: 'playground',
    label: 'Playground',
    value: [],
  },
  resetnode: {
    id: 'resetnode',
    label: 'Reset Node',
    plugins: [KEY_RESET_NODE],
    route: '/docs/reset-node',
    value: [],
  },
  singleline: {
    id: 'singleline',
    label: 'Single Line',
    plugins: [KEY_SINGLE_LINE],
    route: '/docs/single-line',
    value: singleLineValue,
  },
  softbreak: {
    id: 'softbreak',
    label: 'Soft Break',
    plugins: [KEY_SOFT_BREAK],
    route: '/docs/soft-break',
    value: softBreakValue,
  },
  tabbable: {
    id: 'tabbable',
    label: 'Tabbable',
    plugins: [KEY_TABBABLE],
    route: '/docs/tabbable',
    value: tabbableValue,
  },
  table: {
    id: 'table',
    label: 'Table',
    plugins: [ELEMENT_TABLE],
    route: '/docs/table',
    value: tableValue,
  },
  todoli: {
    id: 'todoli',
    label: 'Todo List',
    plugins: [ELEMENT_TODO_LI],
    route: '/docs/list',
    value: todoListValue,
  },
  toggle: {
    id: 'toggle',
    label: 'Toggle',
    plugins: [ELEMENT_TOGGLE],
    route: '/docs/toggle',
    value: toggleValue,
  },
  trailingblock: {
    id: 'trailingblock',
    label: 'Trailing Block',
    plugins: [KEY_TRAILING_BLOCK],
    route: '/docs/trailing-block',
    value: trailingBlockValue,
  },
};
