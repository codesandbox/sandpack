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
      textSecondary: "$gray100",
      primary: "$green",
    },
    fontWeights: {
      base: 400,
      semiBold: 600,
    },
    transitions: {
      default: "all .2s ease",
    },
  }
});

export const globalStyles = globalCss({
  "*, *::before, *::after": {
    boxSizing: "border-box",
  },

  "html, body": {
    height: "100%",
  },

  html: {
    fontSize: "10px",
  },

  body: {
    background: "$background",
    color: "$textPrimary",
    fontSize: "1.6rem",
    fontSmooth: "antialiased",
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
    "-webkit-font-smoothing": "antialiased",
    lineHeight: 1.6,
    letterSpacing: "-0.025em",
    margin: 0,
    padding: 0,
  },

  "#root": {
    isolation: "isolate",
  },


  "a, a:visited": {
    color: "inherit",
    textDecoration: "none",
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
  lineHeight: 1,
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
        fontWeight: "$base",
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

const Button = styled("button", {})

export { Box, Button, Stack, Text }
`;

const components = `import { Box, Button, Stack, Text } from './common';

function Section({ children }) {
  return (
    <Stack
      as="section"
      css={{
        background: "$surface",
        fontSize: "calc(100vw / (1920 / 2) * 10)",

        width: "100vw",
        height: "100vh",
        
        padding: "1.8em 3.5em",
        position: "relative",

        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      vertical>
      {children}
    </Stack>
  )
}

function HeaderText({ children, ...props }) {
  return (
    <Text
      as="span"
      css={{
        fontSize: "2.4em",
        textAlign: "center",
        letterSpacing: "-0.05em",
        transition: "$default",

        "&:hover": {
          color: "$primary",
        }
      }}
      {...props}>
      {children}
    </Text>
  )
}

function Clipboard() {
  const installCommand = "npm install @codesandbox/sandpack-react"

  return (
    <Button
      aria-label="Copy to clipboard"
      css={{
        alignItems: "center",
        color: "$darkTextPrimary",
        cursor: "pointer",
        display: "flex",
        transition: "$default",

        "&:hover": {
          color: "$primary",
        },

        ".clipboard-icon": {
          color: "$primary",
          transition: "$default",
          opacity: 0,
        },

        "&:hover .clipboard-icon": {
          opacity: 1,
        }
      }}
      onClick={() => navigator.clipboard.writeText(installCommand)}
    >
      <HeaderText>{installCommand}</HeaderText>
      <Box
        className="clipboard-icon"
        css={{
          flexShrink: "0",
          width: "1.6em",
          height: "1.6em",
          
          position: "relative",
          top: 1,
          marginLeft: "1.2em",
        }}
      >
        <svg fill="none" height="100%" viewBox="0 0 12 13" width="100%">
          <g clipPath="url(#a)">
            <path
              d="M8.21 1.344H2.317c-.54 0-.983.463-.983 1.03v7.212h.983V2.374H8.21v-1.03Zm1.474 2.06H4.281c-.54 0-.983.464-.983 1.03v7.213c0 .566.442 1.03.983 1.03h5.403c.54 0 .983-.464.983-1.03V4.435c0-.567-.442-1.03-.983-1.03Zm0 8.243H4.281V4.435h5.403v7.212Z"
              fill="currentColor"
            />
          </g>
          <defs>
            <clipPath id="a">
              <path
                d="M0 0h12v12H0z"
                fill="currentColor"
                transform="translate(0 .676)"
              />
            </clipPath>
          </defs>
        </svg>
      </Box>
    </Button>
  )
}

function Link({ href, children }) {
  return (
    <a href={href} target="_blank" style={{ marginLeft: "2em" }}>
      <HeaderText semiBold>{children}</HeaderText>
    </a>
  )
}

function SectionHeader({children}) {
  return (
    <Stack css={{ justifyContent: "space-between", width: "100%" }} horizontal>
      <Clipboard />
      <Stack horizontal>
        {children}
      </Stack>
    </Stack>
  )
}

function SandpackLogo() {
  return (
    <Box
      css={{
        "$$logoHeight": "18em",
        "$$logoMargin": "-5em",

        display: "flex",
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "center",

        width: "100%",

        "&::before, &::after": {
          boxSizing: "content-box",
          content: "''",
          display: "block",

          border: "2.4em solid #fff",
          width: "9em",
          height: "$$logoHeight",
        },

        "&::before": {
          marginTop: "$$logoMargin",
          marginRight: "-1.1em",
        },

        "&::after": {
          marginBottom: "$$logoMargin",
          marginLeft: "-1.1em",
        },
      }}
    />
  )
}

function SandpackTitle() {
  return (
    <Stack css={{ width: "100%" }}>
      <Text as="h1" screenReader>Sandpack</Text>
      <Box 
        as="svg" 
        alt="Sandpack" 
        css={{ width: "100%" }} 
        
        fill="none" 
        viewBox="0 0 1851 396" 
        height="100%"
        width="100%"
        role="presentation"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M177.264 88.498h53.25C229.47 36.888 185.468.344 120.434.344 56.296.344 8.117 36.441 8.266 90.437c0 43.853 31.174 69.061 81.441 82.038l34.755 8.949c32.964 8.353 54.741 18.645 54.89 42.362-.149 26.103-24.909 43.554-61.006 43.554-34.605 0-61.454-15.512-63.691-47.582H.21c2.238 60.708 47.433 94.866 118.583 94.866 73.237 0 115.748-36.544 115.897-90.391-.149-52.952-43.853-77.116-89.794-88.004l-28.639-7.16c-25.06-5.966-52.206-16.557-51.908-42.063.15-22.97 20.733-39.826 55.338-39.826 32.965 0 54.742 15.364 57.576 41.318Zm149.302 226.126c35.947 0 57.426-16.855 67.271-36.097h1.79V310h51.908V156.664c0-60.56-49.372-78.757-93.076-78.757-48.179 0-85.171 21.48-97.103 63.244l50.416 7.16c5.369-15.662 20.584-29.087 46.985-29.087 25.059 0 38.782 12.828 38.782 35.351v.895c0 15.513-16.259 16.259-56.681 20.584-44.45 4.774-86.96 18.049-86.96 69.658 0 45.046 32.964 68.912 76.668 68.912Zm14.021-39.677c-22.523 0-38.633-10.292-38.633-30.13 0-20.733 18.049-29.384 42.213-32.815 14.17-1.939 42.51-5.519 49.521-11.187v26.998c0 25.506-20.584 47.134-53.101 47.134Zm194.236-99.191c0-33.113 19.987-52.206 48.477-52.206 27.893 0 44.599 18.347 44.599 48.925V310h53.996V164.122c.149-54.891-31.175-86.215-78.459-86.215-34.306 0-57.874 16.408-68.315 41.914h-2.685v-38.93h-51.609V310h53.996V175.756Zm265.982 138.271c39.378 0 57.128-23.418 65.63-40.124h3.282V310h53.101V4.52h-54.145v114.257h-2.238c-8.204-16.557-25.059-40.87-65.481-40.87-52.952 0-94.567 41.467-94.567 117.836 0 75.475 40.422 118.284 94.418 118.284Zm15.065-44.3c-35.649 0-54.443-31.324-54.443-74.282 0-42.66 18.495-73.237 54.443-73.237 34.754 0 53.847 28.788 53.847 73.237 0 44.45-19.391 74.282-53.847 74.282Zm143.484 126.189h53.996V273.903h2.24c8.5 16.706 26.25 40.124 65.63 40.124 53.99 0 94.42-42.809 94.42-118.284 0-76.369-41.62-117.836-94.57-117.836-40.42 0-57.28 24.313-65.48 40.87h-3.13V80.89h-53.106v315.026Zm52.956-200.471c0-44.449 19.09-73.237 53.84-73.237 35.95 0 54.45 30.577 54.45 73.237 0 42.958-18.8 74.282-54.45 74.282-34.45 0-53.84-29.832-53.84-74.282Zm254.49 119.179c35.95 0 57.43-16.855 67.27-36.097h1.79V310h51.91V156.664c0-60.56-49.37-78.757-93.07-78.757-48.18 0-85.17 21.48-97.11 63.244l50.42 7.16c5.37-15.662 20.58-29.087 46.98-29.087 25.06 0 38.79 12.828 38.79 35.351v.895c0 15.513-16.26 16.259-56.69 20.584-44.44 4.774-86.96 18.049-86.96 69.658 0 45.046 32.97 68.912 76.67 68.912Zm14.02-39.677c-22.52 0-38.63-10.292-38.63-30.13 0-20.733 18.05-29.384 42.21-32.815 14.17-1.939 42.51-5.519 49.52-11.187v26.998c0 25.506-20.58 47.134-53.1 47.134ZM1521 314.475c57.58 0 94.27-34.158 98.15-82.784h-51.61c-4.62 24.611-22.37 38.782-46.09 38.782-33.71 0-55.49-28.192-55.49-75.028 0-46.239 22.23-73.983 55.49-73.983 25.95 0 41.91 16.706 46.09 38.781h51.61c-3.73-49.67-42.51-82.336-98.45-82.336-67.12 0-109.48 48.477-109.48 118.433 0 69.36 41.32 118.135 109.78 118.135ZM1642.48 310h54v-76.967l19.69-21.031 70.1 97.998h64.59l-93.97-130.217 88.75-98.893h-63.09l-82.34 92.032h-3.73V4.52h-54V310Z"
          fill="currentColor"
        />
      </Box>
    </Stack>
  )
}

export { Section, SectionHeader, SandpackLogo, SandpackTitle, Link }
`;

const app = `import { globalStyles } from './stitches.config';
import {
  Section,
  SandpackLogo,
  SectionHeader,
  SandpackTitle,
  Link
} from './components';

export default function App() {
  globalStyles();

  return (
    <Section>
      <SectionHeader>
        <Link href="https://sandpack.codesandbox.io/docs">
          Docs
        </Link>
        <Link href="https://github.com/codesandbox/sandpack">
          GitHub
        </Link>
      </SectionHeader>

      <SandpackLogo />
      <SandpackTitle />
    </Section>
  );
}
`;

export const files = {
  "/App.js": app,
  "/components.js": components,
  "/common.js": common,
  "/stitches.config.js": stitchesConfig,
  "/styles.css": { code: "", hidden: true },
};
