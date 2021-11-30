import { useBreakpoint } from "../common/useBreakpoint";

import { HeroDesktop } from "./HeroDesktop";
import { HeroMobile } from "./HeroMobile";

export const Hero: React.FC = () => {
  const isDesktop = useBreakpoint("1440");

  return isDesktop ? <HeroDesktop /> : <HeroMobile />;
};
