import type { SandpackPredefinedTheme } from "@codesandbox/sandpack-react";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";

import {
  CodeBlock,
  SandpackPreview,
  CardTitle,
  CardDescription,
} from "../../common";
import { useBreakpoint } from "../../common/useBreakpoint";
import { useSandpackExample } from "../SandpackExample";

import {
  Row,
  Content,
  getRelativeCoordinates,
  ToolTip,
  SnippetButton,
  SandpackContainerPlaceholder,
  SandpackContainerMobile,
  FadeAnimation,
} from "./common";

const themeOptions: SandpackPredefinedTheme[] = [
  "dark",
  "light",
  "sandpack-dark",
  "github-light",
  "monokai-pro",
  "night-owl",
  "aqua-blue",
];

export const ThemeExample: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.5 });
  const { setOptions } = useSandpackExample();
  const [toolTipVisibility, setToolTipVisibility] = useState(false);
  const [mousePosition, setMousePosition] = useState<Record<string, number>>(
    {}
  );
  const boxRef = useRef<HTMLButtonElement>(null);
  const [theme, setTheme] = useState(themeOptions[0]);
  const higherMobile = useBreakpoint("bp1");

  useEffect(() => {
    setOptions({ theme });
  }, [theme]);

  useEffect(() => {
    if (!higherMobile) {
      setTheme("light");

      return;
    }

    if (inView) {
      setTheme("light");
    } else {
      setTheme("sandpack-dark");
    }
  }, [inView]);

  const shuffleTheme = () => {
    const currentIndex = themeOptions.indexOf(theme);

    setTheme(themeOptions[(currentIndex + 1) % themeOptions.length]);
  };

  return (
    <FadeAnimation>
      <Row ref={ref}>
        <Content>
          <CardTitle>Apply a theme</CardTitle>
          <CardDescription>
            Use the <code>theme</code> prop to set a predefined option made by
            CodeSandbox. Try below, just click to change code and see all the
            predefined options
          </CardDescription>
          <SnippetButton
            ref={boxRef}
            onClick={shuffleTheme}
            onMouseEnter={() => setToolTipVisibility(true)}
            onMouseLeave={() => setToolTipVisibility(false)}
            onMouseMove={(event) =>
              setMousePosition(getRelativeCoordinates(event, boxRef.current))
            }
          >
            <CodeBlock>{`<Sandpack theme="${theme}">`}</CodeBlock>
          </SnippetButton>

          <div style={{ height: 0, marginTop: "-24px" }}>
            {toolTipVisibility && higherMobile && (
              <AnimatePresence>
                <ToolTip
                  animate={{
                    opacity: 1,
                    x: mousePosition.x,
                    y: mousePosition.y,
                  }}
                  exit={{ opacity: 0 }}
                  initial={{
                    opacity: 0,
                    x: mousePosition.x,
                    y: mousePosition.y,
                  }}
                >
                  click to change
                </ToolTip>
              </AnimatePresence>
            )}
          </div>
        </Content>

        <SandpackContainerMobile>
          <SandpackPreview options={{ theme }} />
        </SandpackContainerMobile>

        <SandpackContainerPlaceholder />
      </Row>
    </FadeAnimation>
  );
};
