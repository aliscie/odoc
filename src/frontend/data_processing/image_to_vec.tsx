export function handleUpload(file) {
    // Perform any necessary validation or checks on the uploaded file
    // For example, check file type, size, etc.

    // Convert the uploaded file to imageBytes
    const imageBytes = convertToImageBytes(file);

    // Convert the imageBytes to a bulb and get the blob link
    const blobLink = convertToBlobLink(imageBytes);
    console.log({imageBytes, blobLink})

    // Return the blob link
    return blobLink;
}


export function convertToImageBytes(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            const imageBytes = new Uint8Array(reader.result);
            resolve(imageBytes);
        };

        reader.onerror = () => {
            reject(new Error('Failed to convert file to imageBytes.'));
        };

        reader.readAsArrayBuffer(file);
    });
}

export function convertToBlobLink(imageBytes) {
    const imageBlob = new Blob([imageBytes], {type: 'image/png'});
    const blobUrl = URL.createObjectURL(imageBlob);
    return blobUrl;
}
