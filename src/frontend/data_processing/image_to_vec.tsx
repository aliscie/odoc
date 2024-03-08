export function convertToBlobLink(imageData) {
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(
        new Blob([imageContent.buffer], {type: "image/png"})
    );
    return image;
}

export async function convertToBytes(image) {
    const imageArray = await image.arrayBuffer();

    // Calculate the file size in megabytes
    const fileSizeInMegabytes = imageArray.byteLength / (1024 * 1024);
    // Check if the file size is larger than 1MB (1 megabyte)
    if (fileSizeInMegabytes > 1) {
        // You can handle the error as needed, for example, throw an exception
        throw new Error(`File size ${fileSizeInMegabytes.toFixed(2)} MB exceeds the maximum allowed size of 1MB.`);
    }

    return [...new Uint8Array(imageArray)];
}


export async function fileToLink(file) {
    let imageArray = new Uint8Array(file);
    return URL.createObjectURL(
        new Blob([imageArray.buffer], {type: "image/png"})
    );
}