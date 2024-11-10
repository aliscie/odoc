function deepCompare(obj1, obj2, path = '') {
    const differences = [];

    if (obj1 === obj2) return differences;

    if (typeof obj1 !== typeof obj2) {
        differences.push(`${path}: Type mismatch (${typeof obj1} vs ${typeof obj2})`);
        return differences;
    }

    if (Array.isArray(obj1)) {
        if (obj1.length !== obj2.length) {
            differences.push(`${path}: Array length mismatch (${obj1.length} vs ${obj2.length})`);
        }

        obj1.forEach((item, index) => {
            const subPath = `${path}[${index}]`;
            differences.push(...deepCompare(item, obj2[index], subPath));
        });
        return differences;
    }

    if (typeof obj1 === 'object' && obj1 !== null && obj2 !== null) {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        // Check for keys present in obj1 but not in obj2
        keys1.forEach((key) => {
            if (!(key in obj2)) {
                differences.push(`${path}.${key}: Missing in second object`);
            } else {
                differences.push(...deepCompare(obj1[key], obj2[key], `${path}.${key}`));
            }
        });

        // Check for keys present in obj2 but not in obj1
        keys2.forEach((key) => {
            if (!(key in obj1)) {
                differences.push(`${path}.${key}: Missing in first object`);
            }
        });

        return differences;
    }

    // Primitive comparison
    if (obj1 !== obj2) {
        differences.push(`${path}: Value mismatch (${obj1} vs ${obj2})`);
    }

    return differences;
}

// Example usage
export default deepCompare;
