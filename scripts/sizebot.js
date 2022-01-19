import { promises as fs } from "fs";
import util from "util";
import zlib from "zlib";

import glob from "glob";
import fetch from "node-fetch";

const gzip = util.promisify(zlib.gzip);
const globAsync = util.promisify(glob);

function format(bytes) {
  var sizes = ["bytes", "kb", "mb"];
  if (bytes === 0) return "0 byte";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

const amount = (deps) => deps.reduce((acc, curr) => acc + curr.gzip, 0);

const ratio = (base, current) => {
  if (current === base) return `✅ ${format(0)}`;

  let diff = current - base;
  let ratioAmount = (((base - current) / base) * -1).toFixed(2);

  if (current > base) return `⚠️ +${format(diff)} (+${ratioAmount}%)`;

  ratioAmount = (((base - current) / base) * 100).toFixed(2);
  diff = base - current;

  if (current < base) return `🎉 -${format(diff)} (-${ratioAmount}%)`;

  return diff;
};

const packages = ["sandpack-react", "sandpack-client"];

const getDependenciesSize = async (packageName) => {
  let reactPackage = JSON.parse(
    await fs.readFile(`./${packageName}/package.json`)
  );

  const { dependencies } = reactPackage;

  return await Promise.all(
    Object.entries(dependencies).map(async ([name, version]) => {
      return fetch(
        `https://bundlephobia.com/api/size?package=${name}@${version}`,
        {
          headers: {
            "User-Agent": "bundle-phobia-cli",
            "X-Bundlephobia-User": "bundle-phobia-cli",
          },
        }
      )
        .then((data) => data.json())
        .then((data) => ({
          name,
          version,
          gzip: data.assets ? data.assets[0].gzip : undefined,
        }));
    })
  );
};

const getDistSize = async (packageName) => {
  const distFiles = await globAsync(`./${packageName}/dist/esm/**/*.js`);
  return await Promise.all(
    distFiles.map(async (file) => {
      return {
        name: file,
        gzip: await fs
          .readFile(file)
          .then(gzip)
          .then((data) => data.length),
      };
    })
  );
};

const getPackageSize = async (packageName) => {
  const allDependenciesSize = await getDependenciesSize(packageName);
  const fileSizes = await getDistSize(packageName);

  return [...fileSizes, ...allDependenciesSize].filter((data) => data.gzip);
};

/**
 * Main func
 */
(async () => {
  const packagePromises = await Promise.all(
    packages.map(async (name) => ({
      [name]: await getPackageSize(name),
    }))
  );
  const currentSizes = packagePromises.reduce((acc, cur) => ({
    ...acc,
    ...cur,
  }));

  const baseSizes = JSON.parse(await fs.readFile("./scripts/size-bot.json"));

  await fs.writeFile("./scripts/size-bot.json", JSON.stringify(currentSizes));

  const content = Object.entries(currentSizes).map(([name, currentDeps]) => {
    const baseDeps = baseSizes[name];

    const removedFiles = baseDeps
      .map((base) => {
        const fileStillExist = currentDeps.find((e) => e.name === base.name);
        if (fileStillExist) return undefined;

        const fileName = base.name.replace(`./${name}/dist/esm/`, "");
        return `| \`${fileName}\` | ${format(
          base.gzip
        )} | File removed | ⚠️ | \n`;
      })
      .filter(Boolean);

    const tableContent = currentDeps.map((item) => {
      const baseFile = baseDeps.find((p) => p.name === item.name);
      const fileName = item.name.replace(`./${name}/dist/esm/`, "");

      if (!baseFile) {
        return `| \`${fileName}\` | New file | ${format(item.gzip)} | ⚠️ | \n`;
      }

      const baseSize = baseFile.gzip;
      const currentFormat = format(item.gzip);
      const baseFormat = format(baseSize);
      const ratioFormat = ratio(baseSize, item.gzip);

      return `| \`${fileName}\` | ${baseFormat} | ${currentFormat} |  ${ratioFormat} | \n`;
    });

    const baseAmount = amount(baseDeps);
    const currentAmount = amount(currentDeps);

    return `### ${name}
| Total base | Total current | +/- |
| - | - | - |
| ${format(baseAmount)} | ${format(currentAmount)} | ${ratio(
      baseAmount,
      currentAmount
    )} |

<details>
 <summary>Details</summary>

| Dependency name / file | Base | Current | +/- |
| - | - | - | - |
${removedFiles.join("")}${tableContent.join("")} \n\n
</details>

`;
  });

  fs.writeFile(
    "./scripts/size-bot.md",
    `## Size changes

${content.join("")}`
  );
})();
