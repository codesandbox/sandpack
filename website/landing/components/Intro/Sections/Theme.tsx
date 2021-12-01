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
  THRESHOLD_VIEW,
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
  const { ref, inView } = useInView({ threshold: THRESHOLD_VIEW });
  const { setOptions } = useSandpackExample();
  const [toolTipVisibility, setToolTipVisibility] = useState(false);
  const [mousePosition, setMousePosition] = useState<Record<string, number>>(
    {}
  );
  const boxRef = useRef<HTMLButtonElement>(null);
  const [theme, setTheme] = useState(themeOptions[0]);
  const higherMobile = useBreakpoint("bp2");

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
          <CardTitle>
            Set a theme, or
            <br /> create your own
          </CardTitle>
          <CardDescription>
            You can style Sandpack however you&apos;d like! Use one of our
            predefined{" "}
            <a
              href="https://sandpack.codesandbox.io/docs/getting-started/custom-ui#theming"
              rel="noreferrer"
              target="_blank"
            >
              <code>theme</code>
            </a>{" "}
            or apply your own.
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
                  Click to change
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
