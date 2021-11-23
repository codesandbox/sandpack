import type { SandpackPredefinedTemplate } from "@codesandbox/sandpack-react";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";

import { CodeBlock, SandpackPreview } from "../../common";
import { useBreakpoint } from "../../common/useBreakpoint";
import { useSandpackExample } from "../SandpackExample";

import {
  Wrapper,
  Title,
  Description,
  Container,
  SeeMoreLink,
  getRelativeCoordinates,
  ToolTip,
  SnippetButton,
  SandpackContainerPlaceholder,
  SandpackContainerMobile,
  FadeAnimation,
  THRESHOLD_VIEW,
} from "./common";

const frameworkOptions: SandpackPredefinedTemplate[] = [
  "react",
  "react-ts",
  "vue",
  "vanilla",
  "angular",
];

export const TemplateExample: React.FC = () => {
  const { ref, inView } = useInView({ threshold: THRESHOLD_VIEW });
  const { setOptions } = useSandpackExample();
  const [toolTipVisibility, setToolTipVisibility] = useState(false);
  const [mousePosition, setMousePosition] = useState<Record<string, number>>(
    {}
  );
  const boxRef = useRef<HTMLButtonElement>(null);
  const [template, setTemplate] = useState(frameworkOptions[0]);
  const higherMobile = useBreakpoint("bp1");

  useEffect(() => {
    setOptions({ template });
  }, [template]);

  useEffect(() => {
    if (!higherMobile) {
      setTemplate(frameworkOptions[0]);

      return;
    }

    if (inView) {
      setTemplate(frameworkOptions[0]);
    } else {
      setTemplate(frameworkOptions[0]);
    }
  }, [higherMobile, inView]);

  const shuffleTemplate = () => {
    const currentIndex = frameworkOptions.indexOf(template);

    setTemplate(frameworkOptions[(currentIndex + 1) % frameworkOptions.length]);
  };

  return (
    <FadeAnimation>
      <Wrapper ref={ref}>
        <Container>
          <Title>Get started in a few lines</Title>
          <Description>
            Set the <code>template</code> prop to get started with Sandpack in a
            few lines of code.
          </Description>
          <SnippetButton
            ref={boxRef}
            onClick={shuffleTemplate}
            onMouseEnter={() => setToolTipVisibility(true)}
            onMouseLeave={() => setToolTipVisibility(false)}
            onMouseMove={(event) =>
              setMousePosition(getRelativeCoordinates(event, boxRef.current))
            }
          >
            <CodeBlock>{`<Sandpack template="${template}">`}</CodeBlock>
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

          <SeeMoreLink href="https://sandpack.codesandbox.io/docs/getting-started/custom-content#template">
            <span>See more</span>
          </SeeMoreLink>
        </Container>

        <SandpackContainerPlaceholder />

        <SandpackContainerMobile>
          <SandpackPreview options={{ template }} />
        </SandpackContainerMobile>
      </Wrapper>
    </FadeAnimation>
  );
};
