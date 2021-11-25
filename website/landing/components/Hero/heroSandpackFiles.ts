const TAB = "    ";
const breakpoints = [768, 1440, 1920];
const spacing = [0, 1, 2, 3, 4, 5, 6];

const stitchesConfig = `import { createStitches } from '@stitches/react';

export const {
  globalCss,
  styled,
} = createStitches({
  theme: {
    colors: {
      green: "#6FEC5B",
      purple: "#9013A4",

      gray100: "#808080",
      gray200: "#404040",
      gray300: "#202020",
      gray400: "#151515",
      gray500: "#090909",

      white: "#ffffff",

      surface: "$gray400",
      background: "$gray500",
      textPrimary: "$white",
      textSecondary: "$gray100"
    },
    fontWeights: {
      base: 400,
      semiBold: 600,
    },
    space: [${spacing.map((s) => `"${s}rem"`).join(", ")}],
  },
  media: {
    ${breakpoints
      .map(
        (bp, bpIndex) =>
          `bp${bpIndex + 1}: 'media screen and (min-width: ${bp}px)'`
      )
      .join(`,\n${TAB}`)}
  },
  utils: {
  },
});

export const globalStyles = globalCss({
  "*, *::before, *::after": {
    boxSizing: "border-box",
  },

  html: {
    fontSize: "clamp(10px, calc((100vw * 2) / 720 * 10), calc((100vw * 2) / 960 * 10))",

    "@media screen and (min-width: 720px)": {
      background: "blue",
    }
  },

  body: {
    fontSize: "1.6rem",
    fontSmooth: "antialiased",
    "-webkit-font-smoothing": "antialiased",
    lineHeight: 1.6,
    letterSpacing: "-0.025em",
    margin: 0,
    padding: 0,
  },

  "a, a:visited": {
    color: "inherit",
    textDecoration: "none",

    "&:hover": {
      textDecoration: "underline"
    }
  },

  button: {
    background: "none",
    border: "none",
    borderRradius: 0,
    color: "inherit",
    font: "inherit",
    lineHeight: "normal",
    margin: 0,
    padding: 0,
    width: "auto",
  }
});
`;

const common = `import { styled } from './stitches.config';

const Stack = styled("div", {
  display: "flex",
  variants: {
    horizontal: {
      true: {
        alignItems: "center",
        flexDirection: "row",
      },
    },
    vertical: {
      true: {
        flexDirection: "column",
      },
    }
  }
});

const Box = styled("div", {})

const Text = styled("p", {
  margin: 0,

  variants: {
    screenReader: {
      true: {
        border: "0 !important",
        clipPath: "inset(50%) !important",
        "-webkit-clip-path": "inset(50%) !important",
        height: "1px !important",
        margin: "-1px !important",
        overflow: "hidden !important",
        padding: "0 !important",
        position: "absolute !important",
        width: "1px !important",
        whiteSpace: "nowrap !important",   
      }
    },
    semiBold: {
      true: { fontWeight: "$semiBold" },
    }
  }
});

export { Box, Stack, Text }
`;

const components = `import { Box, Stack, Text } from './common';
import LogoSVG from './logo.svg';
import SandpackSVG from './sandpack.svg';

function Section({ children }) {
  return (
    <Stack
    as="section"
    css={{
      alignItems: "center",
      background: "$surface",
      color: "$textPrimary", 
      height: "max-content",
      minHeight: "100vh",
      justifyContent: "space-between",
      overflow: "hidden",
      position: "relative",
      padding: "$1 calc($1 * 1.5)",
      width: "100%",
    }}
    vertical>
      {children}
    </Stack>
  )
}

function SectionHeader() {
  return (
    <Stack css={{ justifyContent: "space-between", width: "100%" }} horizontal>
      <button>
        <Text as="span">npm install @codesandbox/sandpack-react</Text>
      </button>
      <Stack horizontal>
        <a href="https://github.com/codesandbox/sandpack" target="_blank">
          <Text as="span" semiBold>Github</Text>
        </a>
        <a href="https://sandpack.codesandbox.io/docs/" target="_blank" style={{ marginLeft: "24px" }}>
          <Text as="span" semiBold>Docs</Text>
        </a>
      </Stack>
    </Stack>
  )
}

function SandpackLogo() {
  return (
    <Stack>
      <img alt="Sandpack Logo with composable blocks" src={LogoSVG} />
    </Stack>
  )
}

function SandpackTitle() {
  return (
    <Stack css={{ width: "100%" }}>
      <Text as="h1" screenReader>Sandpack</Text>
      <Box as="img" alt="Sandpack" css={{ width: "100%" }} src={SandpackSVG} />
    </Stack>
  )
}

export { Section, SectionHeader, SandpackLogo, SandpackTitle }
`;

const app = `import { globalStyles } from './stitches.config';
import { SandpackLogo, SandpackTitle, Section, SectionHeader } from './components';

export default function App() {
  globalStyles();

  return (
    <Section>
      <SectionHeader />
      <SandpackLogo />
      <SandpackTitle />
    </Section>
  );
}
`;

const logoFile = `<svg width="178" height="217" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path stroke="#fff" stroke-width="13.5" d="M89.222 48h81.867v162.096H89.222z"/>
  <path stroke="#fff" stroke-width="13.5" d="M7.5 7.128h81.867v162.096H7.5z"/>
</svg>
`;

const sandpackFile = `<svg width="662" height="142" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M63.587 31.59h19.04C82.252 13.135 66.52.07 43.266.07 20.336.07 3.11 12.976 3.163 32.283c0 15.68 11.146 24.692 29.12 29.332l12.426 3.2C56.494 67.802 64.28 71.48 64.334 79.96c-.054 9.333-8.907 15.573-21.813 15.573-12.373 0-21.973-5.547-22.773-17.013H.282c.8 21.706 16.96 33.919 42.399 33.919 26.186 0 41.385-13.066 41.439-32.319-.054-18.933-15.68-27.572-32.106-31.466l-10.24-2.56c-8.96-2.133-18.666-5.92-18.56-15.04.054-8.212 7.414-14.239 19.787-14.239 11.786 0 19.573 5.494 20.586 14.773Zm53.382 80.85c12.853 0 20.533-6.026 24.053-12.906h.64v11.253h18.559V55.962c0-21.653-17.652-28.16-33.279-28.16-17.226 0-30.452 7.68-34.718 22.613l18.026 2.56c1.92-5.6 7.359-10.4 16.799-10.4 8.96 0 13.866 4.587 13.866 12.64v.32c0 5.547-5.813 5.813-20.266 7.36-15.893 1.707-31.092 6.453-31.092 24.906 0 16.106 11.786 24.639 27.412 24.639Zm5.014-14.186c-8.053 0-13.813-3.68-13.813-10.773 0-7.413 6.453-10.506 15.093-11.733 5.066-.693 15.199-1.973 17.706-4v9.653c0 9.12-7.36 16.853-18.986 16.853Zm69.448-35.466c0-11.84 7.147-18.666 17.333-18.666 9.973 0 15.946 6.56 15.946 17.493v49.172h19.306V58.628c.054-19.626-11.146-30.825-28.052-30.825-12.267 0-20.693 5.866-24.426 14.986h-.96v-13.92h-18.453v81.918h19.306V62.788Zm95.101 49.439c14.08 0 20.426-8.373 23.466-14.346h1.174v12.906h18.986V1.563h-19.36v40.853h-.8c-2.933-5.92-8.959-14.613-23.412-14.613-18.933 0-33.813 14.826-33.813 42.132 0 26.986 14.453 42.292 33.759 42.292Zm5.387-15.84c-12.746 0-19.466-11.2-19.466-26.559 0-15.253 6.613-26.186 19.466-26.186 12.426 0 19.253 10.293 19.253 26.186s-6.934 26.56-19.253 26.56Zm51.302 45.119h19.306V97.881h.8c3.04 5.973 9.387 14.346 23.466 14.346 19.306 0 33.759-15.306 33.759-42.292 0-27.306-14.879-42.132-33.812-42.132-14.453 0-20.479 8.693-23.413 14.613h-1.12V28.869h-18.986v112.637Zm18.933-71.678c0-15.893 6.826-26.186 19.253-26.186 12.853 0 19.466 10.933 19.466 26.186 0 15.36-6.72 26.56-19.466 26.56-12.32 0-19.253-10.667-19.253-26.56Zm90.995 42.612c12.853 0 20.532-6.026 24.052-12.906h.64v11.253h18.56V55.962c0-21.653-17.653-28.16-33.279-28.16-17.226 0-30.453 7.68-34.719 22.613l18.026 2.56c1.92-5.6 7.36-10.4 16.799-10.4 8.96 0 13.867 4.587 13.867 12.64v.32c0 5.547-5.814 5.813-20.266 7.36-15.893 1.707-31.093 6.453-31.093 24.906 0 16.106 11.786 24.639 27.413 24.639Zm5.013-14.186c-8.053 0-13.813-3.68-13.813-10.773 0-7.413 6.453-10.506 15.093-11.733 5.066-.693 15.199-1.973 17.706-4v9.653c0 9.12-7.36 16.853-18.986 16.853Zm85.875 14.133c20.586 0 33.705-12.213 35.092-29.6h-18.453c-1.653 8.8-8 13.867-16.479 13.867-12.053 0-19.84-10.08-19.84-26.826 0-16.533 7.947-26.452 19.84-26.452 9.279 0 14.986 5.973 16.479 13.866h18.453c-1.333-17.76-15.2-29.44-35.199-29.44-23.999 0-39.146 17.334-39.146 42.346 0 24.8 14.773 42.239 39.253 42.239Zm43.436-1.6h19.306v-27.52l7.039-7.52 25.066 35.04h23.093l-33.599-46.559L660.11 28.87h-22.559l-29.439 32.906h-1.333V1.563h-19.306v109.224Z" fill="#fff"/>
</svg>`;

export const files = {
  "/App.js": app,
  "/components.js": components,
  "/common.js": common,
  "/stitches.config.js": stitchesConfig,
  "/logo.svg": logoFile,
  "/sandpack.svg": sandpackFile,
};
