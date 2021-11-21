import { SandpackProvider } from "@codesandbox/sandpack-react";
import { motion, useTransform, useViewportScroll } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

import { Box, List } from "../common";

import { SandpackExample } from "./SandpackExample";
import { CustomExample } from "./Sections/Custom";
import { EditorExample } from "./Sections/Editor";
import { TemplateExample } from "./Sections/Template";
import { ThemeExample } from "./Sections/Theme";

export const Examples: React.FC = () => {
  const sandpackSection = useRef(null);
  const { scrollY } = useViewportScroll();

  const [sandpackSectionTop, setSandpackSectionTop] = useState(0);
  const [sandpackSectionHeight, setSandpackSectionHeight] = useState(0);

  useLayoutEffect(() => {
    if (!sandpackSection.current) return;

    const onResize = () => {
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
  const progressRangeX = ["0vw", "30vw"];
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

            "@bp2": {
              display: "block",
              // transform: "translateX(50vw)",
            },

            "@media (min-width: 1300px)": {
              // transform: "translateX(30vw)",
            },

            // TODO: test it out on big screens
            "@media (min-width: 2400px)": {
              transform: "translateX(20vw)",
            },

            "*": {
              transition: ".2s ease background, .2s ease color",
            },
          }}
        >
          <SandpackExample />
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
      </List>
    </>
  );
};
