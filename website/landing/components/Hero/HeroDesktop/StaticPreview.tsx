import { SandpackPreview } from "@codesandbox/sandpack-react";

import { Box } from "../../common";

interface StaticPreviewProps {
  animationComplete: boolean;
}
export const StaticPreview: React.FC<StaticPreviewProps> = ({
  animationComplete,
}) => {
  return (
    <Box
      css={{
        height: "100%",
        position: "absolute",
        top: "0",
        right: "0",
        bottom: "0",
        left: "auto",
        width: "50%",
        visibility: animationComplete ? "visible" : "hidden",
      }}
    >
      <SandpackPreview />
    </Box>
  );
};
