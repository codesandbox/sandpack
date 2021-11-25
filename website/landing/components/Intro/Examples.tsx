import {
  ClasserProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  SandpackThemeProvider,
} from "@codesandbox/sandpack-react";
import { motion, useTransform, useViewportScroll } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

import { Box, List, SandpackContainer } from "../common";
import { useBreakpoint } from "../common/useBreakpoint";

import { SandpackExample } from "./SandpackExample";
import { CustomExample } from "./Sections/Custom";
import { EditorExample } from "./Sections/Editor";
import { LayoutExample } from "./Sections/Layout";
import { useLayoutExampleContext } from "./Sections/LayoutContext";
import { TemplateExample } from "./Sections/Template";
import { ThemeExample } from "./Sections/Theme";

export const Examples: React.FC = () => {
  const { layoutFiles, visibility } = useLayoutExampleContext();

  const { scrollY } = useViewportScroll();

  const isMedium = useBreakpoint("bp2");
  const isLarge = useBreakpoint("bp3");
  const isXLarge = useBreakpoint("2260");

  const sandpackRefSectionTop = useRef<HTMLDivElement>(null);
  const sandpackRefSectionHeight = useRef<HTMLDivElement>(null);
  const [sandpackSectionTop, setSandpackSectionTop] = useState(0);
  const [sandpackSectionHeight, setSandpackSectionHeight] = useState(0);

  useLayoutEffect(() => {
    const onResize = () => {
      if (!sandpackRefSectionTop.current || !sandpackRefSectionHeight.current)
        return;

      setSandpackSectionTop(sandpackRefSectionTop.current?.offsetTop);
      setSandpackSectionHeight(sandpackRefSectionHeight.current?.offsetHeight);
    };

    onResize();
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollRangeX = [
    sandpackSectionTop * 0.7,
    sandpackSectionTop * 0.9,
    (sandpackSectionTop + sandpackSectionHeight) * 0.9,
  ];

  // Max width that the left container can grow
  const breakpoint = () => {
    if (isXLarge) return "600px";
    if (isLarge) return "30vw";
    if (isMedium) return "45vw";

    return "35vw";
  };
  const progressRangeX = ["0", "0", breakpoint()];
  const x = useTransform(scrollY, scrollRangeX, progressRangeX);

  return (
    <>
      <div ref={sandpackRefSectionTop} />

      {isMedium && (
        <motion.div
          ref={sandpackRefSectionHeight}
          style={{
            x,
            position: "sticky",
            top: "calc(50vh - 25%)",
            marginBottom: "calc(50vh - 15%)",
          }}
        >
          <Box
            css={{
              right: 0,

              position: "relative",

              "*": {
                transition: ".2s ease background, .2s ease color",
              },
            }}
          >
            <motion.div
              animate={{ opacity: visibility ? 0 : 1 }}
              initial={{ opacity: 0 }}
              style={{ position: "relative", zIndex: visibility ? -1 : 1 }}
            >
              <SandpackExample />
            </motion.div>

            <SandpackContainer css={{ position: "absolute", top: "0" }}>
              <motion.div
                animate={{ opacity: visibility ? 1 : 0 }}
                initial={{ opacity: 0 }}
              >
                <SandpackProvider
                  customSetup={{
                    files: layoutFiles,
                    dependencies: { "@codesandbox/sandpack-react": "latest" },
                  }}
                  template="react"
                >
                  <ClasserProvider
                    classes={{
                      "sp-layout": "custom-layout",
                      "sp-stack": "custom-stack",
                      "sp-wrapper": "custom-wrapper",
                    }}
                  >
                    <SandpackThemeProvider>
                      <SandpackLayout>
                        <SandpackPreview />
                      </SandpackLayout>
                    </SandpackThemeProvider>
                  </ClasserProvider>
                </SandpackProvider>
              </motion.div>
            </SandpackContainer>
          </Box>
        </motion.div>
      )}

      <List
        css={{
          display: "flex",
          flexWrap: "wrap",
          gap: "100px",
          width: "100%",

          "@bp1": {
            width: "initial",
            "--gap": "200px",
          },

          "@bp2": {
            alignItems: "center",
            flexDirection: "column",
            "--gap": "0",
            scrollSnapType: "y mandatory",
          },
        }}
      >
        <TemplateExample />

        <SandpackProvider>
          <CustomExample />
        </SandpackProvider>

        <SandpackProvider>
          <EditorExample />
        </SandpackProvider>

        <ThemeExample />

        <SandpackProvider template="react">
          <LayoutExample />
        </SandpackProvider>
      </List>
    </>
  );
};
