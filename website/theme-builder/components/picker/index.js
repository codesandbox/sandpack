import styles from "./Picker.module.scss";
import { SketchPicker } from "react-color";
import { useState, useRef } from "react";
import useOnClickOutside from "../../hooks/useClickOutside";

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
          style={{ backgroundColor: color }}
          onClick={() => {
            openPicker(true);
          }}
        ></button>
      </div>
      <span className={styles.label}>{label}</span>

      {isPickerOpen && (
        <div className={styles.colorPicker} ref={ref}>
          <SketchPicker color={color} onChangeComplete={handleChangeComplete} />
        </div>
      )}
    </div>
  );
}

export function PickerToogle({
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
          style={{ backgroundColor: color }}
          onClick={() => {
            updateMode(modeKey);
          }}
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
          style={{
            background: `linear-gradient(-45deg, ${color1} 50%, ${color2} 50%)`,
          }}
          onClick={() => {
            if (updateModeFromGallery) {
              updateModeFromGallery(modeKey);
            }

            if (updateMode) {
              updateMode(modeKey);
            }
          }}
        ></button>
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
