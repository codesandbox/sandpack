/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CodeEditorRef } from "@codesandbox/sandpack-react";
import {
  useSandpack,
  useActiveCode,
  SandpackThemeProvider,
  SandpackCodeEditor,
} from "@codesandbox/sandpack-react";
import { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";

import { Box, SandpackPreview } from "../../common";
import { useBreakpoint } from "../../common/useBreakpoint";
import { useSandpackExample } from "../SandpackExample";

import {
  Wrapper,
  Title,
  Description,
  Container,
  SeeMoreLink,
  RefreshButton,
  SandpackContainerPlaceholder,
  SandpackContainerMobile,
  FadeAnimation,
  THRESHOLD_VIEW,
} from "./common";

const ORIGINAL_CODE = `<Sandpack 
  options={{
    showNavigator: true,
    showLineNumbers: true,
    showTabs: true,
    closableTabs: true,
  }} 
/>`;

const ORIGINAL_CUSTOM = {
  showNavigator: true,
  showLineNumbers: true,
  showTabs: true,
  closableTabs: true,
};

export const EditorExample: React.FC = () => {
  const { ref, inView } = useInView({ threshold: THRESHOLD_VIEW });
  const { setOptions } = useSandpackExample();
  const [custom, setCustom] = useState(ORIGINAL_CUSTOM);
  const codeEditorRef = useRef<CodeEditorRef>(null);
  const higherMobile = useBreakpoint("bp1");

  const { sandpack } = useSandpack();
  const { code } = useActiveCode();

  useEffect(() => {
    setOptions({ options: custom });
  }, [custom]);

  useEffect(
    function componentOnView() {
      const position = 43;
      const cmInstance = codeEditorRef.current?.getCodemirror();

      if (higherMobile && inView && cmInstance && code.length > position) {
        cmInstance.focus();
        const newState = cmInstance.state.update({
          selection: { anchor: position },
        });

        if (newState) {
          cmInstance.update([newState]);
        }
      }
    },
    // Ignore code.length
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inView, higherMobile]
  );

  useEffect(function componentMount() {
    sandpack.updateCurrentFile(ORIGINAL_CODE);
  }, []);

  useEffect(
    function listener() {
      const newCustomOptions: Record<string, any> = {};

      Object.keys(custom).map((key) => {
        const value = code.match(new RegExp(`${key}:(.+)`));

        newCustomOptions[key] = value?.[1]?.includes("true") ?? false;
      });

      setCustom((prev) => ({ ...prev, ...(newCustomOptions as any) }));
    },
    [code]
  );

  return (
    <FadeAnimation>
      <Wrapper ref={ref}>
        <Container>
          <Title>Configure your editor</Title>
          <Description>
            The <code>options</code> prop allows you to toggle on/off different
            features of the code editor.
          </Description>

          <Box
            css={{
              position: "relative",
              pre: { padding: 0 },

              ".sp-code-editor": {
                borderRadius: "16px",
                padding: "0 15px",
              },
            }}
          >
            <SandpackThemeProvider theme="sandpack-dark">
              <SandpackCodeEditor ref={codeEditorRef} showTabs={false} />

              <RefreshButton
                onClick={() => {
                  sandpack.updateCurrentFile(ORIGINAL_CODE);
                  setOptions(ORIGINAL_CUSTOM);
                }}
              >
                <svg
                  fill="currentColor"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M16.48 12.8571C16.0883 15.1705 14.1389 16.9286 11.7931 16.9286C9.16499 16.9286 7.03448 14.722 7.03448 12C7.03448 9.27803 9.16499 7.07143 11.7931 7.07143C13.6797 7.07143 15.3099 8.20855 16.0796 9.85714L14.2759 9.85714V11.1429H16.48H16.7586H17.5275H18V6.85714L16.7586 6.85714V8.90778C15.7449 7.16536 13.9004 6 11.7931 6C8.59366 6 6 8.68629 6 12C6 15.3137 8.59366 18 11.7931 18C14.7116 18 17.126 15.7648 17.5275 12.8571H16.48Z"
                    fillRule="evenodd"
                  />
                </svg>
              </RefreshButton>
            </SandpackThemeProvider>
          </Box>

          <SeeMoreLink href="https://sandpack.codesandbox.io/docs/getting-started/custom-ui#visual-options">
            <span>See more</span>
          </SeeMoreLink>
        </Container>

        <SandpackContainerPlaceholder />

        <SandpackContainerMobile>
          <SandpackPreview options={{ options: custom }} />
        </SandpackContainerMobile>
      </Wrapper>
    </FadeAnimation>
  );
};
