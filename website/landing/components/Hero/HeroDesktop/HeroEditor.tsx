import { SandpackCodeEditor } from "@codesandbox/sandpack-react";
import type { MotionValue } from "framer-motion";

import { AnimatedBox } from "../../common";

interface HeroEditorProps {
  animationComplete: boolean;
  translateX: MotionValue<string>;
}
export const HeroEditor: React.FC<HeroEditorProps> = ({
  animationComplete,
  translateX,
}) => {
  return (
    <AnimatedBox
      css={{
        alignItems: "center",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transform: "translateX($$translateX)",
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
