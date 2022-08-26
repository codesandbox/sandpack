import { css } from "../../styles";

const color = css({
  variants: {
    status: {
      pass: { color: "$colors$accent" },
      fail: { color: "$colors$error" },
      skip: { color: "$colors$warning" },
    },
  },
});

export const passTextClassName = color({ status: "pass" });
export const failTextClassName = color({ status: "fail" });
export const skipTextClassName = color({ status: "skip" });

const background = css({
  variants: {
    status: {
      pass: { background: "$colors$accent" },
      fail: { background: "$colors$errorSurface" },
    },
  },
});

export const passBackgroundClassName = background({ status: "pass" });
export const failBackgroundClassName = background({ status: "fail" });