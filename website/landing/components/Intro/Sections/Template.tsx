import type { SandpackPredefinedTemplate } from "@codesandbox/sandpack-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";

import { styled } from "../../../stitches.config";
import { Box, CodeBlock } from "../../common";
import { useSandpackExample } from "../SandpackExample";

import { Wrapper, Title, Description, Container, SeeMoreLink } from "./common";

const frameworkOptions: SandpackPredefinedTemplate[] = [
  "react",
  "react-ts",
  "vue",
  "vanilla",
  "angular",
];

const SnippetButton = styled("button", {
  background: "none",
  border: "none",

  ".sp-wrapper": {
    cursor: "pointer",
  },
});

const ToolTip = styled(motion.div, {
  alignItems: "center",
  background: "$primary",
  borderRadius: "24px",
  color: "$lightTextPrimary",
  display: "inline-block",
  fontWeight: "$normal",
  fontSize: "inherit",
  lineHeight: "inherit",
  letterSpacing: "inherit",
  padding: "4px 12px",
});

export const TemplateExample: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.5 });
  const { setOptions } = useSandpackExample();
  const [toolTipVisibility, setToolTipVisibility] = useState(false);
  const [mousePosition, setMousePosition] = useState<Record<string, number>>(
    {}
  );
  const boxRef = useRef<unknown>(null);
  const [template, setTemplate] = useState(frameworkOptions[0]);

  useEffect(() => {
    setOptions({ template });
  }, [setOptions, template]);

  useEffect(() => {
    if (!inView) {
      setTemplate(frameworkOptions[0]);
    }
  }, [inView]);

  const shuffleTemplate = () => {
    const currentIndex = frameworkOptions.indexOf(template);

    setTemplate(frameworkOptions[(currentIndex + 1) % frameworkOptions.length]);
  };

  return (
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
          onMouseMove={(event: any) =>
            setMousePosition(getRelativeCoordinates(event, boxRef.current))
          }
        >
          <CodeBlock>{`<Sandpack template="${template}">`}</CodeBlock>
        </SnippetButton>

        <div style={{ height: 0, marginTop: "-24px" }}>
          {toolTipVisibility && (
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

      <Box css={{ width: 800 }} />
    </Wrapper>
  );
};

function getRelativeCoordinates(event: any, referenceElement: any) {
  const position = {
    x: event.pageX,
    y: event.pageY,
  };

  const offset = {
    left: referenceElement.offsetLeft,
    top: referenceElement.offsetTop,
  };

  let reference = referenceElement.offsetParent;

  while (reference) {
    offset.left += reference.offsetLeft;
    offset.top += reference.offsetTop;
    reference = reference.offsetParent;
  }

  return {
    x: position.x - offset.left + 15,
    y: position.y - offset.top - 35,
  };
}
