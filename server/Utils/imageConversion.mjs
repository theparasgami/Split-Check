import fetch from "node-fetch";
import fs from "fs";

async function convertBlobToBinary(blobUrl) {
  try {
   
    // Fetch the Blob data
    const response = await fetch(blobUrl);
    const blobData = await response.blob();

    // Read the Blob data as an ArrayBuffer
    const arrayBuffer = await blobData.arrayBuffer();

    // Convert the ArrayBuffer to a Buffer
    const binaryData = Buffer.from(arrayBuffer);

    return binaryData;
  } catch (error) {
    console.error("Error converting Blob to binary:", error);
    return null;
  }
}

async function convertBinaryToBlob(binaryData) {
  if (typeof binaryData === 'object' && Buffer.isBuffer(binaryData)) {
    const base64Data = Buffer.from(binaryData).toString("base64");
    const srcData = `data:image/jpeg;base64,${base64Data}`;
    return srcData;
  }
  else {
    return binaryData;
  }
}

async function convertImageToBinary(location) {
  const imagePath = new URL(location, import.meta.url).pathname;
  return fs.readFileSync(imagePath);
}
export { convertBlobToBinary, convertBinaryToBlob, convertImageToBinary };
