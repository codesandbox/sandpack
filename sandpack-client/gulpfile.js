const gulp = require('gulp');

gulp.task('copy-sandbox', () =>
  gulp
    .src([
      '../../codesandbox-client/www/**/*.*',
      '!../../codesandbox-client/www/**/*.map',
      '!../../codesandbox-client/www/stats.json',
      '!../../codesandbox-client/www/public/**/*.*',
    ])
    .pipe(gulp.dest('./sandpack/'))
);
