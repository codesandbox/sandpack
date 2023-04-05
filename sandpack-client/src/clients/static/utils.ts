export const insertHtmlAfterRegex = (
  regex: RegExp,
  content: string,
  insertable: string
): string | void => {
  const match = regex.exec(content);
  if (match && match.length >= 1) {
    const offset = match.index + match[0].length;
    const prefix = content.substring(0, offset);
    const suffix = content.substring(offset);
    return prefix + insertable + suffix;
  }
};

export const writeBuffer = (content: string | Uint8Array): Uint8Array => {
  if (typeof content === "string") {
    return new TextEncoder().encode(content);
  } else {
    return content;
  }
};

export const readBuffer = (content: string | Uint8Array): string => {
  if (typeof content === "string") {
    return content;
  } else {
    return new TextDecoder().decode(content);
  }
};
