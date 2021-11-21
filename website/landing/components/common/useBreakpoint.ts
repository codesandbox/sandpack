import { useCallback, useEffect, useState } from "react";

import { media } from "../../stitches.config";

export const useBreakpoint = (breakpoint: keyof typeof media): boolean => {
  const [value, setValue] = useState(true);

  const checkBreakpoint = useCallback(() => {
    setValue(window.matchMedia(media[breakpoint]).matches);
  }, [breakpoint]);

  useEffect(() => {
    checkBreakpoint();

    window.addEventListener("resize", checkBreakpoint);
    return () => {
      window.removeEventListener("resize", checkBreakpoint);
    };
  }, [checkBreakpoint]);

  return value;
};
