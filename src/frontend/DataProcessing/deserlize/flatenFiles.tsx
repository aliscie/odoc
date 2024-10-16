function flattenTree(tree) {
  let result = [];

  function recursiveFlatten(node) {
    // Flatten children to just an array of their ids
    const flattenedChildren = node.children
      ? node.children.map((child) => child.id)
      : [];

    // Create a new object with the updated children array
    const flattenedNode = {
      ...node,
      children: flattenedChildren,
    };

    // Add the current node to the result array
    result.push(flattenedNode);

    // Recursively process each child if children exist
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        recursiveFlatten(child);
      });
    }
  }

  // Loop through each item in the root-level array
  tree.forEach((node) => {
    recursiveFlatten(node);
  });

  return result;
}

export default flattenTree;
