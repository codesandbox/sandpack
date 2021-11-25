import { SandpackCodeEditor } from "@codesandbox/sandpack-react";
import { useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";

import { AnimatedBox } from "../../common";

interface HeroEditorProps {
  animationComplete: boolean;
  containerScrollInput: number[];
  scrollY: MotionValue<number>;
}
export const HeroEditor: React.FC<HeroEditorProps> = ({
  animationComplete,
  containerScrollInput,
  scrollY,
}) => {
  // Editor's width is set to half of the viewport's width. It's initial
  // x0 = -1 * (viewportWidth / 2). Then it should translate 100% to the right
  // to be in the middle of the viewport.
  const translateX = useTransform(scrollY, containerScrollInput, [
    "0%",
    "100%",
  ]);

  return (
    <AnimatedBox
      css={{
        alignItems: "center",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        pointerEvents: animationComplete ? "auto" : "none",
        width: "50vw",
        zIndex: "$$editorLevel",
      }}
      style={{
        translateX,
      }}
    >
      <SandpackCodeEditor />
    </AnimatedBox>
  );
};
