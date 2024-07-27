/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnsElement } from "@/components/plate-ui/columns-element";
import {
  createPluginFactory,
  getBlockAbove,
  getPluginType,
  getStartPoint,
  // insertNodes,
  selectEditor,
  someNode,
  withoutNormalizing,
} from "@udecode/plate-common";
// import { ELEMENT_H1 } from "@udecode/plate-heading";

export const KEY_CHART = "column";

export const createChartPlugin = createPluginFactory({
  key: KEY_CHART,
  isElement: true,
  component: ColumnsElement,
});

export const insertChart = (
  editor: any // Change `any` to the appropriate type
) => {
  withoutNormalizing(editor, () => {
    if (
      !someNode(editor, {
        match: { type: getPluginType(editor, KEY_CHART) },
      })
    ) {
      // insertNodes(editor, {
      //   type: ELEMENT_H1, // Adjust this for other element types (e.g., 'paragraph', 'list-item')
      //   children: [{ text: "Hello World" }],
      // });
      if (editor.selection) {
        const tableEntry = getBlockAbove(editor, {
          match: { type: getPluginType(editor, KEY_CHART) },
        });
        if (!tableEntry) return;
        selectEditor(editor, { at: getStartPoint(editor, tableEntry[1]) });
      }
    }
  });
};
