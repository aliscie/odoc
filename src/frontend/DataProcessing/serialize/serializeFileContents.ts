import { randomString } from "../dataSamples";
import { ContentNode } from "../../../declarations/backend/backend.did";

const stylesToCheck = ["bold", "italic", "underline", "strikethrough", "code"];

function getFormats(item) {
  const itemKeys = Object.keys(item);

  // Filter stylesToCheck to only include those that exist in itemKeys
  return stylesToCheck.filter((style) => itemKeys.includes(style));
}

export function convertStyleArrayToObject(styleArray) {
  return styleArray.reduce((acc, style) => {
    if (stylesToCheck.includes(style)) {
      acc[style] = true;
    }
    return acc;
  }, {});
}

function de_nesting(nested: any[]) {
  let queue = [];
  let data = [];
  let parent = [];
  nested.forEach((rootItem) => {
    queue.push(rootItem);

    while (queue.length > 0) {
      let item = queue.pop();
      let formats = getFormats(item);

      let id = item.id || randomString();
      let children: ContentNode[] = item.children
        ? item.children.map((child) => {
            let id = String(child.id || randomString());
            return { id, parent: [String(id)], ...child };
          })
        : [];

      let obj: ContentNode = {
        id: String(id),
        formats,
        value: item.value || "",
        _type: item.type || "",
        data: item.data || [],
        text: item.text || "",
        indent: item.indent || 0,
        listStyleType: item.listStyleType || "",
        language: item.language || "",
        parent: parent,
        children: children.map((child) => String(child.id)),
        listStart: item.listStart || 0,
      };

      data.push(obj);
      if (children) {
        parent = [String(id)];
        queue = queue.concat(children);
      }
    }
    parent = [];
  });
  return data;
}

function serializeFileContents(
  content: any[],
  data: Array<Array<[string, Array<ContentNode>]>> = [],
) {
  Object.keys(content).forEach((key) => {
    let change = [];
    let item = content[key];
    let de_nested: Array<ContentNode> = de_nesting(item);
    change = [key, de_nested];
    data.push([change]);
  });
  return data;
}

export default serializeFileContents;
