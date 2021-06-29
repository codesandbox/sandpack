import { task, src, dest } from "gulp";

task("copy-sandbox", () =>
  src([
    "../../codesandbox-client/www/**/*.*",
    "!../../codesandbox-client/www/**/*.map",
    "!../../codesandbox-client/www/stats.json",
    "!../../codesandbox-client/www/public/**/*.*",
  ]).pipe(dest("./sandpack/"))
);
