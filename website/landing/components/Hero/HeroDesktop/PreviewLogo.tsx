import { useTransform, useViewportScroll } from "framer-motion";
import { AnimatedBox } from "../../common";

const BORDER_WIDTH = 18 * 0.75;
const HEIGHT = 234 * 0.75;
const WIDTH = 127 * 0.75;

const sharedStyles = {
  width: WIDTH,
  height: HEIGHT,
  borderWidth: BORDER_WIDTH,
  borderStyle: "solid",
  borderColor: "$textPrimary",
};

interface PreviewLogoProps {
  heroTop: number;
  heroScroll: number;
  windowWidth: number;
}
export const PreviewLogo: React.FC<PreviewLogoProps> = ({
  heroTop,
  heroScroll,
  windowWidth,
}) => {
  const { scrollY } = useViewportScroll();

  const rotateScrollInput = [
    heroTop + heroScroll * 0.5,
    heroTop + heroScroll * 0.75,
  ];
  const rotateOutput = [-90, 0];
  const rotate = useTransform(scrollY, rotateScrollInput, rotateOutput);

  const logoScrollInput = [
    heroTop,
    heroTop + heroScroll * 0.5,
    heroTop + heroScroll * 0.75,
  ];
  const leftTranslateYInput = [
    -1 * (windowWidth / 2),
    (-1 * HEIGHT) / 2,
    (-1 * HEIGHT) / 6,
  ];
  const rightTranslateYInput = [
    windowWidth / 2,
    (1 * HEIGHT) / 2,
    (1 * HEIGHT) / 6,
  ];

  const leftTranslateY = useTransform(
    scrollY,
    logoScrollInput,
    leftTranslateYInput
  );
  const rightTranslateY = useTransform(
    scrollY,
    logoScrollInput,
    rightTranslateYInput
  );

  return (
    <AnimatedBox
      css={{ display: "flex", position: "absolute" }}
      style={{
        rotate,
      }}
    >
      <AnimatedBox
        css={{ ...sharedStyles }}
        style={{
          translateX: BORDER_WIDTH / 2,
          translateY: leftTranslateY,
        }}
      />
      <AnimatedBox
        css={{ ...sharedStyles }}
        style={{
          translateX: BORDER_WIDTH / -2,
          translateY: rightTranslateY,
        }}
      />
    </AnimatedBox>
  );
};
