export const getFileName = (filePath: string): string => {
  const lastIndexOfSlash = filePath.lastIndexOf("/");
  return filePath.slice(lastIndexOfSlash + 1);
};

export const calculateNearestUniquePath = (
  currentPath: string,
  otherPaths: string[]
): string => {
  const currentPathParts = (
    currentPath[0] === "/" ? currentPath.slice(1) : currentPath
  ).split("/");
  const resultPathParts: string[] = [];

  // If path is on root, there are no parts to loop through
  if (currentPathParts.length === 1) {
    resultPathParts.unshift(currentPathParts[0]);
  } else {
    // Loop over all other paths to find a unique path
    for (let fileIndex = 0; fileIndex < otherPaths.length; fileIndex++) {
      // We go over each part of the path from end to start to find the closest unique directory
      const otherPathParts = otherPaths[fileIndex].split("/");
      for (
        let partsFromEnd = 1;
        partsFromEnd <= currentPathParts.length;
        partsFromEnd++
      ) {
        const currentPathPart =
          currentPathParts[currentPathParts.length - partsFromEnd];
        const otherPathPart =
          otherPathParts[otherPathParts.length - partsFromEnd];

        // If this part hasn't been added to the result path, we add it here
        if (resultPathParts.length < partsFromEnd) {
          resultPathParts.unshift(currentPathPart);
        }

        // If this part is different between the current path and other path we break
        // as from this moment the current path is unique compared to this other path
        if (currentPathPart !== otherPathPart) {
          break;
        }
      }
    }
  }

  // Add `..` if this is a relative path
  if (resultPathParts.length < currentPathParts.length) {
    resultPathParts.unshift("..");
  }

  // Join the result path parts into a path string
  return resultPathParts.join("/");
};

export const hexToRGB = (
  hex: string
): { red: number; green: number; blue: number } => {
  let r = "0";
  let g = "0";
  let b = "0";

  if (hex.length === 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];
  } else if (hex.length === 7) {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  }

  return {
    red: +r,
    green: +g,
    blue: +b,
  };
};

// Checks both rgb and hex colors for contrast and returns true if the color is in the dark spectrum
export const isDarkColor = (color: string): boolean => {
  let r = 0;
  let g = 0;
  let b = 0;
  if (color.startsWith("#")) {
    if (color.length < 7) {
      return true;
    }

    r = parseInt(color.substr(1, 2), 16);
    g = parseInt(color.substr(3, 2), 16);
    b = parseInt(color.substr(5, 2), 16);
  } else {
    const rgbValues = color
      .replace("rgb(", "")
      .replace("rgba(", "")
      .replace(")", "")
      .split(",");
    if (rgbValues.length < 3) {
      return true;
    }

    r = parseInt(rgbValues[0], 10);
    g = parseInt(rgbValues[1], 10);
    b = parseInt(rgbValues[2], 10);
  }

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 128;
};

// Minimal cuid-like id
let lastCount = 0;
export const generateRandomId = (): string => {
  const random = +(Date.now().toString(10).substr(0, 4) + lastCount++);
  return random.toString(16);
};
