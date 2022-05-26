/* eslint-disable @typescript-eslint/no-explicit-any */

export const shallowEqual = (a: any[], b: any[]): boolean => {
  if (a.length !== b.length) return false;

  let result = true;

  for (let index = 0; index < a.length; index++) {
    if (a[index] !== b[index]) {
      result = false;

      break;
    }
  }

  return result;
};
