import { motion } from "framer-motion";
import type { MotionValue } from "framer-motion";

import { styled } from "../../stitches.config";

const LogoWraper = styled("div", {
  $$halfHeight: "150px",
  alignItems: "center",
  display: "flex",
  height: "calc((2 * $$halfHeight) - $$halfHeight / 2)",
  justifyContent: "center",
  position: "relative",
});

const LogoHalf = styled("div", {
  $$borderWidth: "14px",
  border: "$$borderWidth solid black",
  height: "$$halfHeight",
  width: "82px",

  "&[data-position='left']": {
    transform: "translateX(calc($$borderWidth / 2))",
  },

  "&[data-position='right']": {
    transform: "translateX(calc(-1 * ($$borderWidth / 2)))",
  },
});

const baseStyles = {
  height: "100%",
  width: "100%",
};

interface ParallaxLogoProps {
  leftY: MotionValue;
  rightY: MotionValue;
}
export const ParallaxLogo: React.FC<ParallaxLogoProps> = ({
  leftY,
  rightY,
}) => {
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
