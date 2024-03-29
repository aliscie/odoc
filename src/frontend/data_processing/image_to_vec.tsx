export function convertToBlobLink(imageData) {
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(
        new Blob([imageContent.buffer], {type: "image/png"})
    );
    return image;
}

export async function convertToBytes(image) {
    const imageArray = await image.arrayBuffer();
    return [...new Uint8Array(imageArray)];
}

export async function fileToLink(file) {
    let imageArray = new Uint8Array(file);
    return URL.createObjectURL(
        new Blob([imageArray.buffer], {type: "image/png"})
    );
}