function convertCamelToTitle(str) {
    if (!str) {
        return ""
    }
    return str
        .replace(/([A-Z])/g, ' $1')  // Insert a space before each capital letter
        .toLowerCase()               // Convert the entire string to lowercase
        .replace(/^\w/, function (match) {
            return match.toUpperCase();
        }) // Capitalize only the first letter
        .trim();                     // Remove any leading/trailing whitespace
}

export default convertCamelToTitle
