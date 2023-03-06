import type { ClientOptions } from "../..";
import { createError } from "../..";
import { nullthrows } from "../..";

export async function loadPreviewIframe(
  iframe: HTMLIFrameElement,
  url: string
): Promise<void> {
  const { contentWindow } = iframe;

  nullthrows(
    contentWindow,
    "Failed to await preview iframe: no content window found"
  );

  const TIME_OUT = 90_000;
  const MAX_MANY_TIRES = 20;
  let tries = 0;
  let timeout: ReturnType<typeof setTimeout>;

  return new Promise((resolve, reject) => {
    const triesToSetUrl = (): void => {
      const onLoadPage = (): void => {
        clearTimeout(timeout);
        tries = MAX_MANY_TIRES;
        resolve();

        iframe.removeEventListener("load", onLoadPage);
      };

      if (tries >= MAX_MANY_TIRES) {
        reject(createError(`Could not able to connect to preview.`));

        return;
      }

      iframe.setAttribute("src", url);

      timeout = setTimeout(() => {
        triesToSetUrl();
        iframe.removeEventListener("load", onLoadPage);
      }, TIME_OUT);

      tries = tries + 1;

      iframe.addEventListener("load", onLoadPage);
    };

    iframe.addEventListener("error", () => reject(new Error("Iframe error")));
    iframe.addEventListener("abort", () => reject(new Error("Aborted")));

    triesToSetUrl();
  });
}

export const setPreviewIframeProperties = (
  iframe: HTMLIFrameElement,
  options: ClientOptions
): void => {
  iframe.style.border = "0";
  iframe.style.width = options.width || "100%";
  iframe.style.height = options.height || "100%";
  iframe.style.overflow = "hidden";
  iframe.allow = "cross-origin-isolated";
};
