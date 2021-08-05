import { useClasser } from "@code-hike/classer";
import type { Language } from "prism-react-renderer";
import Highlight, { defaultProps, Prism } from "prism-react-renderer";
import * as React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { twilight } from "react-syntax-highlighter/dist/esm/styles/prism";

import { getPrismTheme } from "../components/CodeViewer/utils";
import { useSandpackTheme } from "../hooks/useSandpackTheme";

export interface PrismHighlightProps {
  lang?: Language;
  code: string;
  showLineNumbers?: boolean;
}

export const PrismHighlight: React.FC<PrismHighlightProps> = ({
  lang = "javascript",
  code,
  showLineNumbers,
}) => {
  const { theme } = useSandpackTheme();
  const c = useClasser("sp");

  return (
    <div className={c("code-view")}>
      <SyntaxHighlighter
        language="jsx"
        style={twilight}
        style={{
          ...Object.entries(theme.syntax).reduce((acc, [key, value]) => {
            return { ...acc, [key]: { color: value } };
          }),
          'pre[class*="language-"]': {
            backgroundColor: "none",
          },
          'code[class*="language-"]': {
            fontFamily: "var(--sp-font-mono)",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
      <Highlight
        // {...defaultProps}
        Prism={Prism}
        code={code}
        language={lang}
        theme={getPrismTheme(theme)}
      >
        {({
          className,
          style: preStyle,
          tokens,
          getLineProps,
          getTokenProps,
        }) => (
          <pre
            className={className}
            style={{
              ...preStyle,
              margin: 0,
              fontFamily: "var(--sp-font-mono)",
            }}
          >
            {tokens.map((line, i) => (
              <div
                style={{ display: "table-row" }}
                {...getLineProps({ line, key: i })}
              >
                {showLineNumbers ? (
                  <span
                    style={{
                      display: "table-cell",
                      textAlign: "right",
                      paddingRight: "var(--sp-space-2)",
                      userSelect: "none",
                      color: "var(--sp-colors-fg-default)",
                      minWidth: "28px",
                    }}
                  >
                    {i + 1}
                  </span>
                ) : null}

                <span
                  style={{
                    display: "table-cell",
                    paddingLeft: "var(--sp-space-1)",
                  }}
                >
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};
