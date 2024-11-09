import { FileNode } from "../../declarations/backend/backend.did";

function convertToTreeItems(items: FileNode[], rootId = null): any[] {
  const itemMap = new Map<string, any>();

  // First pass: create a map of all items by their id
  items.forEach((item) => {
    item && itemMap.set(item.id, { ...item, children: [] });
  });

  // Second pass: assign children to their respective parents
  const tree = [];

  itemMap.forEach((item) => {
    if (item.parent.length > 0 && itemMap.has(item.parent[0])) {
      const parent = itemMap.get(item.parent[0]);
      parent.children.push(item);
    } else {
      // If there's no parent, it's a root item
      tree.push(item);
    }
  });
  return tree;
}

export default convertToTreeItems;
