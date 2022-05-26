/* eslint-disable @typescript-eslint/no-explicit-any */

export const shallowEqual = (a: any[], b: any[]): boolean => {
  if (a.length !== b.length) return false;

  return a.every((item, index) => item === b[index]);
};
