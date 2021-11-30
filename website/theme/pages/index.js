import {
  SandpackProvider,
  SandpackThemeProvider,
  SandpackCodeEditor,
} from "@codesandbox/sandpack-react";
import Container, {
  ContainerControls,
  ContainerCode,
  ContainerPanels,
  ContainerColors,
  ContainerSandpack,
  ContainerPre,
} from "components/container";
import Divider from "components/divider";
import Footer from "components/footer";
import Header from "components/header";
import Input, { InputContainer } from "components/input";
import Menu from "components/menu";
import PickerItem, {
  PickerContainer,
  PickerToggle,
  PickerTheme,
} from "components/picker";
import Title from "components/title";
import { useEffect, useState } from "react";

import { templates } from "../lib/codeExamples";
import { generateBasedOnSimpleColors } from "../lib/generateTheme";
import { themeGallery } from "../lib/themeGallery";

const DEFAULT_COLORS = {
  primary: "#0971F1",
  secondary: "#BF5AF2",
  tertiary: "#FF453A",
};
const DEFAULT_MODE = "light";
const DEFAULT_THEME = generateBasedOnSimpleColors(DEFAULT_COLORS, DEFAULT_MODE);

export default function Home({ ...props }) {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [simpleColors, setSimpleColors] = useState(DEFAULT_COLORS);
  const [mode, setMode] = useState("light");
  const [tab, setTab] = useState("basic");

  // -----------------------
  // Updates

  const updateColor = (key, color) => {
    let newState = { ...simpleColors };
    newState[key] = color;
    let newTheme = generateBasedOnSimpleColors(newState, mode);

    setTheme(newTheme);
    setSimpleColors(newState);
  };

  const updateTheme = (path, value) => {
    let newTheme = { ...theme };
    let [area, key] = path.split(".");

    // HANDLE Comment 2 level deep
    if (key === "comment") {
      newTheme[area][key] = {
        color: value,
        fontStyle: "italic",
      };
    } else {
      newTheme[area][key] = value;
    }

    setTheme(newTheme);
  };

  const updateMode = (mode) => {
    let newTheme = generateBasedOnSimpleColors(simpleColors, mode);

    setTheme(newTheme);
    setMode(mode);
  };

  const updateModeFromGallery = (index) => {
    const newTheme = themeGallery[index].code;
    setTheme(newTheme);
  };

  // -----------------------
  // Effects

  return (
    <>
      <Header />

      <Container>
        <ContainerControls>
          <Divider />
          <Menu setTab={setTab} />
          <Divider />

          <ContainerPanels tab={tab}>
            <ContainerColors isActive={tab === "basic"}>
              <Basic
                mode={mode}
                simpleColors={simpleColors}
                updateColor={updateColor}
                updateMode={updateMode}
              />
            </ContainerColors>

            <ContainerColors isActive={tab === "advanced"}>
              <Advanced theme={theme} updateTheme={updateTheme} />
            </ContainerColors>

            <ContainerColors isActive={tab === "library"}>
              <Library
                themeGallery={themeGallery}
                updateModeFromGallery={updateModeFromGallery}
              />
            </ContainerColors>
          </ContainerPanels>
        </ContainerControls>

        <ContainerCode>
          <Divider />

          <Title>Preview</Title>

          <ContainerSandpack>
            <SandpackProvider
              customSetup={{
                entry: "index.js",
                files: {
                  "/App.js": templates.js,
                  "/style.css": templates.css,
                },
              }}
              template="react"
            >
              <SandpackThemeProvider theme={theme}>
                <SandpackCodeEditor />
              </SandpackThemeProvider>
            </SandpackProvider>
          </ContainerSandpack>

          <Divider />

          <Title>Export</Title>

          <ContainerSandpack>
            <ContainerPre>{JSON.stringify(theme, null, 2)}</ContainerPre>
          </ContainerSandpack>
        </ContainerCode>
      </Container>
      <Footer />
    </>
  );
}

// --------------------------------------------
// Basic Tab

function Basic({ simpleColors, mode, updateColor, updateMode }) {
  return (
    <>
      <Title>Appearance</Title>
      <PickerContainer>
        <PickerToggle
          active={mode === "light"}
          color="#f8f9fb"
          label="Light"
          modeKey="light"
          updateMode={updateMode}
        />
        <PickerToggle
          active={mode === "dark"}
          color="#151515"
          label="Dark"
          modeKey="dark"
          updateMode={updateMode}
        />
      </PickerContainer>
      <Divider />
      <Title>Custom colors</Title>
      <PickerContainer>
        <PickerItem
          color={simpleColors.primary}
          colorKey="primary"
          label="Primary"
          updateColor={updateColor}
        />
        <PickerItem
          color={simpleColors.secondary}
          colorKey="secondary"
          label="Secondary"
          updateColor={updateColor}
        />
        <PickerItem
          color={simpleColors.tertiary}
          colorKey="tertiary"
          label="Tertiary"
          updateColor={updateColor}
        />
      </PickerContainer>
    </>
  );
}

// --------------------------------------------
// Advanced Tab

function Advanced({ theme, updateTheme }) {
  //Using state to update the pickers when the color change
  const [controls, setControls] = useState({
    syntax: { ...theme.syntax },
    palette: { ...theme.palette },
  });

  const [typeControls, setTypeControls] = useState({
    bodyFont: theme.typography.bodyFont,
    monoFont: theme.typography.monoFont,
    fontSize: Number(theme.typography.fontSize.replace("px", "")),
    lineHeight: Number(theme.typography.lineHeight),
  });

  useEffect(() => {
    let newControls = {
      palette: { ...theme.palette },
      syntax: { ...theme.syntax },
    };

    if (newControls.syntax.comment) {
      newControls.syntax.comment = newControls.syntax.comment.color;
    }

    setControls(newControls);
  }, [theme]);

  const capitalize = (str) => str[0].toUpperCase() + str.slice(1);

  return (
    <>
      {Object.keys(controls).map((area, i) => {
        return (
          <>
            <Title>{capitalize(area)}</Title>
            <PickerContainer advanced>
              {Object.keys(controls[area]).map((c, i) => {
                return (
                  <PickerItem
                    key={c + i}
                    color={controls[area][c]}
                    colorKey={`${area}.${c}`}
                    label={c}
                    updateTheme={updateTheme}
                    advanced
                  />
                );
              })}
            </PickerContainer>
          </>
        );
      })}

      <Divider />
      <Title>Typography</Title>

      <InputContainer>
        <Input
          label="bodyFont"
          onChange={(e) => {
            setTypeControls({ ...typeControls, bodyFont: e.target.value });
            updateTheme("typography.bodyFont", e.target.value);
          }}
          type="text"
          value={typeControls.bodyFont}
        />
        <Input
          label="monoFont"
          onChange={(e) => {
            setTypeControls({ ...typeControls, monoFont: e.target.value });
            updateTheme("typography.monoFont", e.target.value);
          }}
          type="text"
          value={typeControls.monoFont}
        />
        <Input
          grid="2"
          label="fontSize (px)"
          onChange={(e) => {
            setTypeControls({ ...typeControls, fontSize: e.target.value });
            updateTheme("typography.fontSize", `${e.target.value}px`);
          }}
          type="number"
          value={typeControls.fontSize}
        />
        <Input
          grid="2"
          label="lineHeight"
          onChange={(e) => {
            setTypeControls({
              ...typeControls,
              lineHeight: e.target.value,
            });
            updateTheme("typography.lineHeight", e.target.value);
          }}
          type="number"
          value={typeControls.lineHeight}
        />
      </InputContainer>
    </>
  );
}

// --------------------------------------------
// Library Tab

function Library({ themeGallery, updateModeFromGallery }) {
  return (
    <>
      <Title>Themes</Title>
      <PickerContainer>
        {themeGallery.map((t, i) => (
          <PickerTheme
            key={t.label + i}
            colors={[t.code.syntax.keyword, t.code.palette.defaultBackground]}
            label={t.label}
            modeKey={i}
            updateModeFromGallery={updateModeFromGallery}
          />
        ))}
      </PickerContainer>
    </>
  );
}
