import { promises as fs } from "fs";
import path from "path";

import packageStats from "package-build-stats";

const packages = ["sandpack-react", "sandpack-client"];

const getDependenciesSize = async (packageName) => {
  const { getPackageStats } = packageStats;
  const results = await getPackageStats(path.resolve(packageName));

  return {
    gzip: results.gzip,
    assets: [
      ...results.assets.map((item) => ({
        name: item.name,
        size: item.size,
      })),
      ...results.dependencySizes.map((item) => ({
        name: item.name,
        size: item.approximateSize,
      })),
    ],
  };
};

const createCurrentSizes = async () => {
  const packagePromises = await Promise.all(
    packages.map(async (name) => ({
      [name]: await getDependenciesSize(name),
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
