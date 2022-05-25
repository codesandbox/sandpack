// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const classNames = (...args: any[]): string => {
  return args.filter(Boolean).join(" ");
};
