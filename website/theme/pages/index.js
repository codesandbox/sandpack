import { Sandpack } from "@codesandbox/sandpack-react";
import * as themeGallery from "@codesandbox/sandpack-themes";
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
import { useEffect, useState, Fragment } from "react";

import { generateBasedOnSimpleColors } from "../lib/generateTheme";

const DEFAULT_COLORS = {
  primary: "#0971F1",
  secondary: "#BF5AF2",
  tertiary: "#FF453A",
};
const DEFAULT_MODE = "light";
const DEFAULT_THEME = generateBasedOnSimpleColors(DEFAULT_COLORS, DEFAULT_MODE);

export default function Home() {
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

  const updateMode = (newMode) => {
    let newTheme = generateBasedOnSimpleColors(simpleColors, newMode);

    setTheme(newTheme);
    setMode(newMode);
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
              <Library setTheme={setTheme} />
            </ContainerColors>
          </ContainerPanels>
        </ContainerControls>

        <ContainerCode>
          <Divider />

          <Title>Preview</Title>

          <ContainerSandpack>
            <Sandpack
              options={{
                showLineNumbers: true,
                showInlineErrors: true,
                showNavigator: true,
              }}
              template="react"
              theme={theme}
            />
          </ContainerSandpack>

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
          onClick={() => updateMode("light")}
        />
        <PickerToggle
          active={mode === "dark"}
          color="#151515"
          label="Dark"
          onClick={() => updateMode("dark")}
        />
      </PickerContainer>
      <Divider />
      <Title>Custom colors</Title>
      <PickerContainer>
        <PickerItem
          color={simpleColors.primary}
          label="Primary"
          onChange={(color) => updateColor("primary", color.hex)}
        />
        <PickerItem
          color={simpleColors.secondary}
          label="Secondary"
          onChange={(color) => updateColor("secondary", color.hex)}
        />
        <PickerItem
          color={simpleColors.tertiary}
          label="Tertiary"
          onChange={(color) => updateColor("tertiary", color.hex)}
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
    colors: { ...theme.colors },
  });

  const [typeControls, setTypeControls] = useState({
    body: theme.font.body,
    mono: theme.font.mono,
    size: Number(theme.font.size.replace("px", "")),
    lineHeight: Number(theme.font.lineHeight.replace("px", "")),
  });

  useEffect(() => {
    let newControls = {
      colors: { ...theme.colors },
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
          <Fragment key={i}>
            <Title>{capitalize(area)}</Title>
            <PickerContainer advanced>
              {Object.keys(controls[area]).map((c, i) => {
                return (
                  <PickerItem
                    key={c + i}
                    color={controls[area][c]}
                    label={c}
                    onChange={(color) => updateTheme(`${area}.${c}`, color.hex)}
                    advanced
                  />
                );
              })}
            </PickerContainer>
          </Fragment>
        );
      })}

      <Divider />
      <Title>font</Title>

      <InputContainer>
        <Input
          label="body"
          onChange={(e) => {
            setTypeControls({ ...typeControls, body: e.target.value });
            updateTheme("font.body", e.target.value);
          }}
          type="text"
          value={typeControls.body}
        />
        <Input
          label="mono"
          onChange={(e) => {
            setTypeControls({ ...typeControls, mono: e.target.value });
            updateTheme("font.mono", e.target.value);
          }}
          type="text"
          value={typeControls.mono}
        />
        <Input
          grid="2"
          label="size (px)"
          onChange={(e) => {
            setTypeControls({ ...typeControls, size: e.target.value });
            updateTheme("font.size", `${e.target.value}px`);
          }}
          type="number"
          value={typeControls.size}
        />
        <Input
          grid="2"
          label="lineHeight"
          onChange={(e) => {
            setTypeControls({
              ...typeControls,
              lineHeight: e.target.value,
            });
            updateTheme("font.lineHeight", e.target.value);
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
function Library({ setTheme }) {
  return (
    <>
      <Title>Themes</Title>
      <PickerContainer>
        {Object.entries(themeGallery).map(([label, payload]) => (
          <PickerTheme
            key={JSON.stringify(payload)}
            colors={[payload.colors.accent, payload.colors.surface1]}
            label={label}
            onClick={() => setTheme(payload)}
          />
        ))}
      </PickerContainer>
    </>
  );
}
