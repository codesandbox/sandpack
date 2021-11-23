import {
  ClasserProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  SandpackThemeProvider,
} from "@codesandbox/sandpack-react";
import { motion, useTransform, useViewportScroll } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

import { Box, List } from "../common";
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

  const sandpackSection = useRef<HTMLDivElement>(null);
  const { scrollY } = useViewportScroll();
  const isLarge = useBreakpoint("2260");

  const [sandpackSectionTop, setSandpackSectionTop] = useState(0);
  const [sandpackSectionHeight, setSandpackSectionHeight] = useState(0);

  useLayoutEffect(() => {
    if (!sandpackSection.current) return;

    const onResize = () => {
      if (!sandpackSection.current) return;

      setSandpackSectionTop(sandpackSection.current?.offsetTop);
      setSandpackSectionHeight(sandpackSection.current?.offsetHeight);
    };

    onResize();
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, [sandpackSection]);

  const scrollRangeX = [
    sandpackSectionTop * 0.7,
    (sandpackSectionTop + sandpackSectionHeight) * 0.8,
  ];

  const progressRangeX = ["0vw", isLarge ? "0vw" : "30vw"];
  const x = useTransform(scrollY, scrollRangeX, progressRangeX);

  return (
    <>
      <motion.div
        ref={sandpackSection}
        style={{ x, position: "sticky", top: "calc(50vh - 25%)" }}
      >
        <Box
          css={{
            right: 0,
            display: "none",
            position: "relative",

            "@bp2": {
              display: "block",
            },

            "*": {
              transition: ".2s ease background, .2s ease color",
            },
          }}
        >
          <motion.div
            animate={{ opacity: visibility ? 0 : 1 }}
            initial={{ opacity: 0 }}
            style={{ position: "relative", zIndex: 1 }}
          >
            <SandpackExample />
          </motion.div>

          <Box
            css={{
              position: "absolute",
              top: 0,
              zIndex: visibility ? 2 : 0,

              ".custom-wrapper": {
                "--sp-border-radius": "10px",
              },

              ".custom-layout": {
                width: "342px",
                height: "512px",
                border: 0,

                "@bp1": {
                  width: "384px",
                  height: "608px",
                },

                "@bp2": {
                  height: "448px",
                  width: "996px",
                },
              },

              ".custom-stack": {
                "@bp2": {
                  height: "100% !important",
                  width: "100% !important",
                },
              },
            }}
          >
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
          </Box>
        </Box>
      </motion.div>

      <List
        css={{
          display: "flex",
          flexDirection: "column",
          gap: "148px",

          "@bp2": { gap: "0" },
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
