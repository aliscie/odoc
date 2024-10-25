import { FileNode } from "../../declarations/backend/backend.did";

function convertToTreeItems(items: FileNode[]): any[] {
  // Create a mapping of id to item for quick lookup
  const idToItemMap: Record<string, FileNode> = {};
  items.forEach((item) => {
    idToItemMap[item.id] = item;
  });

  // Function to recursively build the tree
  function buildTree(item: FileNode): any {
    if (!item) {
      return null
    }
    const { id, children: childIds, parent, ...rest } = item;
    const children = childIds.map((childId) => buildTree(idToItemMap[childId]));

    return {
      id,
      children,
      ...rest,
    };
  }

  // Build the tree for each top-level item
  const treeItems = items
    .filter((item) => item.parent.length === 0) // Select top-level items
    .map((topItem) => buildTree(topItem));
  return treeItems;
}

export default convertToTreeItems;
