const gulp = require("gulp");
const removeSourcemaps = require("gulp-remove-sourcemaps");

gulp.task("copy-sandbox", () =>
  gulp
    .src([
      "../../codesandbox-client/www/**/*.*",
      "!../../codesandbox-client/www/**/*.map",
      "!../../codesandbox-client/www/stats.json",
      "!../../codesandbox-client/www/public/**/*.*",
    ])
    .pipe(removeSourcemaps())
    .pipe(gulp.dest("./sandpack/"))
);
