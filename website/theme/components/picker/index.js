import { useState, useRef } from "react";
import { SketchPicker } from "react-color";

import useOnClickOutside from "../../hooks/useClickOutside";

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
  colorKey,
  label,
  color,
  updateColor,
  updateTheme,
  ...props
}) {
  const [isPickerOpen, openPicker] = useState(false);
  const ref = useRef();
  useOnClickOutside(ref, () => openPicker(false));

  const handleChangeComplete = (color) => {
    if (updateColor) {
      updateColor(colorKey, color.hex);
    }

    if (updateTheme) {
      updateTheme(colorKey, color.hex);
    }

    //openPicker(false);
  };

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
          <SketchPicker color={color} onChangeComplete={handleChangeComplete} />
        </div>
      )}
    </div>
  );
}

export function PickerToggle({
  color,
  modeKey,
  label,
  active,
  updateMode,
  ...props
}) {
  return (
    <div className={styles.pickerItem} {...props}>
      <div className={`${styles.pickerWrapper} ${active ? styles.active : ""}`}>
        <button
          className={styles.picker}
          onClick={() => {
            updateMode(modeKey);
          }}
          style={{ backgroundColor: color }}
        ></button>
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export function PickerTheme({
  colors,
  modeKey,
  label,
  active,
  updateMode,
  updateModeFromGallery,
  ...props
}) {
  const [color1, color2] = colors;
  return (
    <div className={styles.pickerItem} {...props}>
      <div className={`${styles.pickerWrapper} ${active ? styles.active : ""}`}>
        <button
          className={styles.picker}
          onClick={() => {
            if (updateModeFromGallery) {
              updateModeFromGallery(modeKey);
            }

            if (updateMode) {
              updateMode(modeKey);
            }
          }}
          style={{
            background: `linear-gradient(-45deg, ${color1} 50%, ${color2} 50%)`,
          }}
        ></button>
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
