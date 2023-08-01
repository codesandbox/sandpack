import { FileIcon } from "..";

import { FileIconCss } from "./file_type_css";
import { FileGulp } from "./file_type_gulp";
import { FileHTML } from "./file_type_html";
import { FileJest } from "./file_type_jest";
import { FileIconJavaScript } from "./file_type_js_official";
import { FileJSON } from "./file_type_json";
import { FilePrisma } from "./file_type_light_prisma";
import { FileNPM } from "./file_type_npm";
import { FileJSX } from "./file_type_reactjs";
import { FileTSX } from "./file_type_reactts";
import { FileSCSS } from "./file_type_scss2";
import { FileStorybook } from "./file_type_storybook";
import { FileSvelte } from "./file_type_svelte";
import { FileSVG } from "./file_type_svg";
import { FileVue } from "./file_type_vue";

interface FileIconType {
  fileName: string;
}

export const DynamicFileIcon = ({ fileName }: FileIconType) => {
  // Extracting extention from fileName Variable  -                               Preview.stories.tsx                 || App.jsx
  const splitedFileName = fileName.split("."); //                                 ["Preview", "stories", "tsx"]       || ["App", "jsx"]
  const extension = splitedFileName.slice(1).join(".").toLocaleLowerCase(); //   "stories.tsx"                       || "jsx"

  switch (extension) {
    case "html":
      return <FileHTML />;

    case "css":
      return <FileIconCss />;

    case "js":
      return <FileIconJavaScript />;

    case "json":
      return <FileJSON />;

    case "gulp":
      return <FileGulp />;

    case "scss":
      return <FileSCSS />;

    case "svelte":
      return <FileSvelte />;

    case "svg":
      return <FileSVG />;

    case "vue":
      return <FileVue />;

    case "jest":
      return <FileJest />;

    case "prisma":
      return <FilePrisma />;

    case "package.json":
      return <FileNPM />;

    case "package-lock.json":
      return <FileNPM />;

    case "jsx":
      return <FileJSX />;

    case "tsx":
      return <FileTSX />;

    case "stories.tsx":
      return <FileStorybook />;

    case "stories.jsx":
      return <FileStorybook />;

    default:
      return <FileIcon />;
  }
};
