module.exports = {
  "**/*.ts?(x)": (filenames) => [
    `eslint ${filenames.join(" ")} --quiet --fix`,
    `prettier --write ${filenames.join(" ")}`,
  ],
};
