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
      const children: string[] = items.find((f) => f.id == parent.id).children;
      parent.children.push(item);
      parent.children = parent.children.sort((a, b) => {
        return children.indexOf(a.id) - children.indexOf(b.id);
      });
    } else {
      tree.push(item);
    }
  });
  return tree;
}

export default convertToTreeItems;
