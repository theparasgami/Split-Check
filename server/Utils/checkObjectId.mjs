function isValidObjectId(objectId) {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(objectId);
}

export default isValidObjectId;
