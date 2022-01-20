import { promises as fs } from "fs";
import util from "util";
import zlib from "zlib";

import glob from "glob";
import fetch from "node-fetch";

const gzip = util.promisify(zlib.gzip);
const globAsync = util.promisify(glob);

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

const createCurrentSizes = async () => {
  const packagePromises = await Promise.all(
    packages.map(async (name) => ({
      [name]: await getPackageSize(name),
    }))
  );
  const currentSizes = packagePromises.reduce((acc, cur) => ({
    ...acc,
    ...cur,
  }));

  await fs.writeFile(
    "./scripts/sizebot/sizebot.json",
    JSON.stringify(currentSizes)
  );

  return currentSizes;
};

(async () => {
  await createCurrentSizes();
})();

export default createCurrentSizes;
