import humanizeString from "humanize-string";
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
          <SketchPicker color={color} onChangeComplete={onChange} />
        </div>
      )}
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
