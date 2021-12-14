import { useCallback, useEffect, useState } from "react";

import { media } from "../../stitches.config";

export const useBreakpoint = (
  breakpoint: keyof typeof media | string
): boolean => {
  const [value, setValue] = useState(true);

  const checkBreakpoint = useCallback(() => {
    const query =
      breakpoint in media
        ? media[breakpoint as keyof typeof media]
        : `(min-width: ${breakpoint}px)`;

    setValue(window.matchMedia(query).matches);
  }, [breakpoint]);

  useEffect(() => {
    checkBreakpoint();

    window.addEventListener("resize", checkBreakpoint);

    return (): void => {
      window.removeEventListener("resize", checkBreakpoint);
    };
  }, [checkBreakpoint]);

  return value;
};
