const gulp = require("gulp");
const removeSourcemaps = require("gulp-remove-sourcemaps");

const paths = process.env.CI
  ? [
      "../../bundler/www/**/*.*",
      "!../../bundler/www/**/*.map",
      "!../../bundler/www/stats.json",
      "!../../bundler/www/public/**/*.*",
    ]
  : [
      "../../codesandbox-client/www/**/*.*",
      "!../../codesandbox-client/www/**/*.map",
      "!../../codesandbox-client/www/stats.json",
      "!../../codesandbox-client/www/public/**/*.*",
    ];

gulp.task("copy-sandbox", () =>
  gulp.src(paths).pipe(removeSourcemaps()).pipe(gulp.dest("./sandpack/"))
);
