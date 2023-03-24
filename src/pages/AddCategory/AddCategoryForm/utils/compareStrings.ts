export const compareStrings = (a: string, b: string) => {
  // remove spaces of the two strings
  const aWithoutSpace = a.replace(/\s+/g, '');
  const bWithoutSpace = b.replace(/\s+/g, '');
  // compare the two strings without case sensitivity
  return aWithoutSpace.localeCompare(bWithoutSpace, undefined, { sensitivity: 'accent' }) === 0;
};