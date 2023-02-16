import { matchSorter } from "match-sorter";
import type { ReactElement } from "react";
import React, { useMemo, useState } from "react";

import type { SearchResult } from "../types";
import type { Item as NormalItem } from "../utils";

import { HighlightMatches } from "./highlight-matches";
import { Search } from "./search";

export function MatchSorterSearch({
  className,
  directories = [],
}: {
  className?: string;
  directories: NormalItem[];
}): ReactElement {
  const [search, setSearch] = useState("");
  const results = useMemo<SearchResult[]>(
    () =>
      // Will need to scrape all the headers from each page and search through them here
      // (similar to what we already do to render the hash links in sidebar)
      // We could also try to search the entire string text from each page
      search
        ? matchSorter(directories, search, { keys: ["title"] }).map(
            ({ route, title }) => ({
              id: route + title,
              route,
              children: <HighlightMatches match={search} value={title} />,
            })
          )
        : [],
    [search]
  );

  return (
    <Search
      className={className}
      onChange={setSearch}
      overlayClassName="nx-w-full"
      results={results}
      value={search}
    />
  );
}
