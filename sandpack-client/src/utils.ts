import { IFiles, IDependencies } from './types';

export function createPackageJSON(
  dependencies: IDependencies = {},
  entry: string = '/index.js'
) {
  return JSON.stringify(
    {
      name: 'sandpack-project',
      main: entry,
      dependencies,
    },
    null,
    2
  );
}

export function addPackageJSONIfNeeded(
  files: IFiles,
  dependencies?: IDependencies,
  entry?: string
) {
  const newFiles = { ...files };

  if (!newFiles['/package.json']) {
    if (!dependencies) {
      throw new Error(
        'No dependencies specified, please specify either a package.json or dependencies.'
      );
    }

    if (!entry) {
      throw new Error(
        "Missing 'entry' parameter. Either specify an entry point, or pass in a package.json with the 'main' field set."
      );
    }

    newFiles['/package.json'] = {
      code: createPackageJSON(dependencies, entry),
    };
  }

  return newFiles;
}
