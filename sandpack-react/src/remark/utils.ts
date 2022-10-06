// TODO improve filename checking
export const isFilename = (str: string):boolean => {
  return /[\w]+\.[\w]+/.test(str);
};
