import * as React from "react";

import { css, THEME_PREFIX } from "../../styles";
import { useClassNames } from "../../utils/classNames";
import { CodeEditor } from "../CodeEditor";

import { fromConsoleToString } from "./utils/fromConsoleToString";
import type { SandpackConsoleData } from "./utils/getType";
import { getType } from "./utils/getType";

export const ConsoleList: React.FC<{ data: SandpackConsoleData }> = ({
  data,
}) => {
  const classNames = useClassNames();
  return (
    <>
      {data.map(({ data, id, method }, logIndex, references) => {
        if (!data) return null;

        if (Array.isArray(data)) {
          return (
            <React.Fragment key={id}>
              {data.map((msg, msgIndex) => {
                const fixReferences = references.slice(
                  logIndex,
                  references.length
                );

                return (
                  <div
                    key={`${id}-${msgIndex}`}
                    className={classNames("console-item", [
                      consoleItemClassName({ variant: getType(method) }),
                    ])}
                  >
                    <CodeEditor
                      code={
                        method === "clear"
                          ? (msg as string)
                          : fromConsoleToString(msg, fixReferences)
                      }
                      fileType="js"
                      initMode="user-visible"
                      showReadOnly={false}
                      readOnly
                      wrapContent
                    />
                  </div>
                );
              })}
            </React.Fragment>
          );
        }

        return null;
      })}
    </>
  );
};

const consoleItemClassName = css({
  width: "100%",
  padding: "$space$3 $space$2",
  fontSize: ".8em",
  position: "relative",

  "&:not(:first-child):after": {
    content: "",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    background: "$colors$surface3",
  },

  /**
   * Editor reset
   */
  ".sp-cm": {
    padding: 0,
  },

  ".cm-editor": {
    background: "none",
  },

  ".cm-content": {
    padding: 0,
  },

  [`.${THEME_PREFIX}-pre-placeholder`]: {
    margin: "0 !important",
    fontSize: "1em",
  },

  variants: {
    variant: {
      error: {
        color: "$colors$error",
        background: "$colors$errorSurface",

        "&:not(:first-child):after": {
          background: "$colors$error",
          opacity: 0.07,
        },
      },
      warning: {
        color: "$colors$warning",
        background: "$colors$warningSurface",

        "&:not(:first-child):after": {
          background: "$colors$warning",
          opacity: 0.07,
        },
      },
      clear: {
        fontStyle: "italic",
      },
      info: {},
    },
  },
});
