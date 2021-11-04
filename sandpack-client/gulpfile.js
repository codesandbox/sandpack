/* eslint-disable @typescript-eslint/no-var-requires */
const del = require("del");
const gulp = require("gulp");
const removeSourcemaps = require("gulp-remove-sourcemaps");

const dist = "./sandpack/";
const paths = process.env.CI
  ? ["../bundler/**/!(*.map)", "!../bundler/public/**"]
  : [
      "../../codesandbox-client/www/**/!(*.map)",
      "!../../codesandbox-client/www/public/**",
    ];

const remove = () => del(dist);
const copyFolder = () =>
  gulp
    .src(paths, { matchBase: true })
    .pipe(removeSourcemaps())
    .pipe(gulp.dest(dist));

exports["default"] = gulp.series(remove, copyFolder);
