import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";

import Header from "components/header";
import Menu from "components/menu";
import Footer from "components/footer";
import Input, { InputContainer } from "components/input";

import Container, {
  ContainerControls,
  ContainerCode,
  ContainerPanels,
  ContainerColors,
  ContainerSandpack,
  ContainerPre,
} from "components/container";
import Title from "components/title";
import PickerItem, {
  PickerContainer,
  PickerToogle,
  PickerTheme,
} from "components/picker";

import Divider from "components/divider";

import {
  SandpackProvider,
  SandpackThemeProvider,
  SandpackCodeEditor,
  SandpackCodeViewer,
} from "@codesandbox/sandpack-react";
import { templates } from "../lib/codeExamples";
import { themeGalery } from "../lib/themeGalery";

import { generateBasedOnSimpleColors } from "../lib/generateTheme";

const DEFAULT_COLORS = {
  primary: "#0971F1",
  secondary: "#BF5AF2",
  tertiary: "#FF453A",
};
const DEFAULT_MODE = "light";
const DEFAULT_THEME = generateBasedOnSimpleColors(DEFAULT_COLORS, DEFAULT_MODE);

export default function Home({ ...props }) {
  const { asPath } = useRouter();

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
    const newTheme = themeGalery[index].code;
    setTheme(newTheme);
  };

  // -----------------------
  // Effects

  useEffect(() => {
    setTab(asPath.replace("/#", ""));
  }, [asPath]);

  return (
    <>
      <Header />

      <Container>
        <ContainerControls>
          <Divider />
          <Menu />
          <Divider />

          <ContainerPanels tab={tab}>
            <ContainerColors isActive={tab === "/"}>
              <Basic
                updateColor={updateColor}
                simpleColors={simpleColors}
                mode={mode}
                updateMode={updateMode}
              />
            </ContainerColors>

            <ContainerColors isActive={tab === "advanced"}>
              <Advanced updateTheme={updateTheme} theme={theme} />
            </ContainerColors>

            <ContainerColors isActive={tab === "library"}>
              <Library
                themeGalery={themeGalery}
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
              template="react"
              customSetup={{
                entry: "index.js",
                files: {
                  "/App.js": templates.js,
                  "/style.css": templates.css,
                },
              }}
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
        <PickerToogle
          modeKey="light"
          label="Light"
          color="#f8f9fb"
          active={mode === "light"}
          updateMode={updateMode}
        />
        <PickerToogle
          modeKey="dark"
          label="Dark"
          color="#151515"
          active={mode === "dark"}
          updateMode={updateMode}
        />
      </PickerContainer>
      <Divider />
      <Title>Custom colors</Title>
      <PickerContainer>
        <PickerItem
          colorKey="primary"
          label="Primary"
          color={simpleColors.primary}
          updateColor={updateColor}
        />
        <PickerItem
          colorKey="secondary"
          label="Secondary"
          color={simpleColors.secondary}
          updateColor={updateColor}
        />
        <PickerItem
          colorKey="tertiary"
          label="Tertiary"
          color={simpleColors.tertiary}
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
                    advanced
                    colorKey={`${area}.${c}`}
                    label={c}
                    color={controls[area][c]}
                    updateTheme={updateTheme}
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
          value={typeControls.bodyFont}
          type="text"
          onChange={(e) => {
            setTypeControls({ ...typeControls, bodyFont: e.target.value });
            updateTheme("typography.bodyFont", e.target.value);
          }}
        />
        <Input
          label="monoFont"
          value={typeControls.monoFont}
          type="text"
          onChange={(e) => {
            setTypeControls({ ...typeControls, monoFont: e.target.value });
            updateTheme("typography.monoFont", e.target.value);
          }}
        />
        <Input
          label="fontSize (px)"
          value={typeControls.fontSize}
          type="number"
          grid="2"
          onChange={(e) => {
            setTypeControls({ ...typeControls, fontSize: e.target.value });
            updateTheme("typography.fontSize", `${e.target.value}px`);
          }}
        />
        <Input
          label="lineHeight"
          value={typeControls.lineHeight}
          type="number"
          grid="2"
          onChange={(e) => {
            setTypeControls({
              ...typeControls,
              lineHeight: e.target.value,
            });
            updateTheme("typography.lineHeight", e.target.value);
          }}
        />
      </InputContainer>
    </>
  );
}

// --------------------------------------------
// Library Tab

function Library({ themeGalery, updateModeFromGallery }) {
  return (
    <>
      <Title>Themes</Title>
      <PickerContainer>
        {themeGalery.map((t, i) => (
          <PickerTheme
            key={t.label + i}
            modeKey={i}
            label={t.label}
            colors={[t.code.syntax.keyword, t.code.palette.defaultBackground]}
            updateModeFromGallery={updateModeFromGallery}
          />
        ))}
      </PickerContainer>
    </>
  );
}
