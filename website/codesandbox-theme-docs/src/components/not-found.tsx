import { useRouter } from "next/router";
import { useMounted } from "nextra/hooks";
import type { ReactElement } from "react";
import React from "react";

import { useConfig } from "../contexts";
import { renderComponent, getGitIssueUrl } from "../utils";


import { Anchor } from "./anchor";

export function NotFoundPage(): ReactElement | null {
  const config = useConfig();
  const mounted = useMounted();
  const { asPath } = useRouter();
  const { content, labels } = config.notFound;
  if (!content) {
    return null;
  }

  return (
    <p className="nx-text-center">
      <Anchor
        className="nx-text-primary-500 nx-underline nx-decoration-from-font [text-underline-position:under]"
        href={getGitIssueUrl({
          repository: config.docsRepositoryBase,
          title: `Found broken \`${mounted ? asPath : ""}\` link. Please fix!`,
          labels,
        })}
        newWindow
      >
        {renderComponent(content)}
      </Anchor>
    </p>
  );
}
