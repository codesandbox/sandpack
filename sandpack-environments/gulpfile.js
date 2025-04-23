/* eslint-disable @typescript-eslint/no-var-requires */
const del = require("del");
const gulp = require("gulp");
var Transform = require("stream").Transform;

function removeSourcemaps() {
  var transformStream = new Transform({ objectMode: true });

  transformStream._transform = function (file, encoding, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      return callback(": Streams not supported!", undefined);
    }

    let contents = file.contents.toString(encoding);

    const lines = contents.split("\n");
    const lastLine = lines[lines.length - 1];
    if (lastLine.startsWith("//# sourceMappingURL=")) {
      lines.pop();
    }

    contents = lines.join("\n");

    file.contents = Buffer.from(contents, encoding);

    callback(null, file);
  };

  return transformStream;
}

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
