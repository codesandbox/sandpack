import { parseColor } from "@react-stately/color";
import humanizeString from "humanize-string";
import { useState, useRef, useEffect } from "react";

import useOnClickOutside from "../../hooks/useClickOutside";
import { ColorArea } from "../ColorPickerSwatch/ColorArea";
import { ColorSlider } from "../ColorPickerSwatch/ColorSlider";
import { ColorSwatch } from "../ColorPickerSwatch/ColorSwatch";

import styles from "./Picker.module.scss";

export function PickerContainer({ children, advanced, ...props }) {
  return (
    <div
      className={`${advanced ? styles.containerAdvanced : styles.container}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default function PickerItem({
  advanced,
  label,
  color,
  onChange,
  ...props
}) {
  const [isPickerOpen, openPicker] = useState(false);
  const ref = useRef();
  useOnClickOutside(ref, () => openPicker(false));

  return (
    <div
      className={advanced ? styles.pickerItemAdvanced : styles.pickerItem}
      {...props}
    >
      <div className={styles.pickerWrapper}>
        <button
          className={styles.picker}
          onClick={() => {
            openPicker(true);
          }}
          style={{ backgroundColor: color }}
        ></button>
      </div>
      <span className={styles.label}>{label}</span>

      {isPickerOpen && (
        <div ref={ref} className={styles.colorPicker}>
          <SketchPicker
            color={color}
            onChangeComplete={(color) => onChange(color.toString("hexa"))}
          />
        </div>
      )}
    </div>
  );
}

function SketchPicker(props) {
  const [color, setColor] = useState(parseColor(props.color).toFormat("hsla"));
  let [hChannel, sChannel, lChannel] = color.getColorChannels();
  const [endColor, setEndColor] = useState(color);
  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    if (rendered) props?.onChangeComplete(endColor);
    else setRendered(true);
  }, [endColor]);
  return (
    <div className="flex flex-col gap-y-2 bg-white shadow-xl border rounded-md p-2">
      <ColorArea
        aria-labelledby="hsb-label-id-1"
        onChange={setColor}
        onChangeEnd={setEndColor}
        value={color}
        xChannel={sChannel}
        yChannel={lChannel}
      />
      <div className="flex items-center gap-2">
        <div className="flex flex-col w-full gap-y-2">
          <ColorSlider
            channel={hChannel}
            onChange={setColor}
            onChangeEnd={setEndColor}
            value={color}
          />
          <ColorSlider
            channel="alpha"
            onChange={setColor}
            onChangeEnd={setEndColor}
            value={color}
          />
        </div>
        <div className="h-full flex items-center justify-center">
          <ColorSwatch
            aria-label={`current color swatch with alpha channel: ${color.toString(
              "hsla"
            )}`}
            value={color}
          />
        </div>
      </div>
    </div>
  );
}

export function PickerToggle({ color, label, active, onClick, ...props }) {
  return (
    <div className={styles.pickerItem} {...props}>
      <div className={`${styles.pickerWrapper} ${active ? styles.active : ""}`}>
        <button
          className={styles.picker}
          onClick={onClick}
          style={{ backgroundColor: color }}
        ></button>
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export function PickerTheme({ colors, label, active, onClick, ...props }) {
  const [color1, color2] = colors;
  return (
    <div className={styles.pickerItem} {...props}>
      <div className={`${styles.pickerWrapper} ${active ? styles.active : ""}`}>
        <button
          className={styles.picker}
          onClick={onClick}
          style={{
            background: `linear-gradient(-45deg, ${color2} 50%, ${color1} 50%)`,
          }}
        ></button>
      </div>
      <span className={styles.label}>{humanizeString(label)}</span>
    </div>
  );
}
