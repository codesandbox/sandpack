import { motion, useSpring } from "framer-motion";
import type { MotionValue } from "framer-motion";

import { styled } from "../../stitches.config";

const LogoWraper = styled("div", {
  $$halfHeight: "150px",
  alignItems: "center",
  display: "flex",
  height: "$$halfHeight",
  justifyContent: "center",
  position: "relative",
});

const LogoHalf = styled("div", {
  $$borderWidth: "14px",
  border: "$$borderWidth solid $$primaryTextColor",
  height: "$$halfHeight",
  width: "82px",

  "&[data-position='left']": {
    transform: "translateX(calc($$borderWidth / 2))",
  },

  "&[data-position='right']": {
    transform: "translateX(calc(-1 * ($$borderWidth / 2)))",
  },
});

const SPRING_OPTIONS = { stiffness: 200, damping: 20 };

const baseStyles = {
  height: "100%",
  width: "100%",
};

interface ParallaxLogoProps {
  leftRange: MotionValue;
  rightRange: MotionValue;
}
export const ParallaxLogo: React.FC<ParallaxLogoProps> = ({
  leftRange,
  rightRange,
}) => {
  const leftY = useSpring(leftRange, SPRING_OPTIONS);
  const rightY = useSpring(rightRange, SPRING_OPTIONS);

  return (
    <LogoWraper>
      <motion.div style={{ ...baseStyles, y: leftY }}>
        <LogoHalf data-position="left" />
      </motion.div>
      <motion.div style={{ ...baseStyles, y: rightY }}>
        <LogoHalf data-position="right" />
      </motion.div>
    </LogoWraper>
  );
};
