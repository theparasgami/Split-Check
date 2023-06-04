async function getImageInBinary(file) {
  const reader = new FileReader();
  const res = await new Promise((resolve, reject) => {
    reader.onload = () => {
      const binaryData = reader.result;
      resolve(binaryData);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
  return res;
}



export { getImageInBinary };
