"use client";
import "./index.css";
import { parseColor } from "@react-stately/color";
import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  OverlayArrow,
  Popover,
} from "react-aria-components";

import { ColorArea } from "./ColorArea";
import { ColorSlider } from "./ColorSlider";
import { ColorSwatch } from "./ColorSwatch";

// ---- PopOver

/**
  value: string;
  onChange: (c: Color) => void;
  horizontal?: boolean;
  label?: string;
*/
export default function ColorPicker(props) {
  const [color, setColor] = useState(parseColor(props?.value).toFormat("hsla"));
  let [hChannel, sChannel, lChannel] = color.getColorChannels();
  const [endColor, setEndColor] = useState(color);
  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    if (rendered) props.onChange(endColor);
    else setRendered(true);
  }, [endColor]);
  return (
    <DialogTrigger>
      <div
        className={`${
          props?.horizontal ? "flex-row" : "flex-col"
        } flex items-center gap-4`}
      >
        <Button
          className={`${swatchCls.outer} border-2 rounded-full bg-white ring-2 focus:outline-none ring-transparent focus:ring-slate-300`}
        >
          <div
            className={swatchCls.inner}
            style={{ backgroundColor: endColor.toString("css") }}
          ></div>
        </Button>
        {props?.label && (
          <span className="text-xl text-slate-700">{props.label}</span>
        )}
      </div>
      <Popover offset={12} placement="bottom left">
        <OverlayArrow>
          <svg className="text-slate-600 fill-slate-900" height={12} width={12}>
            <path
              d="M0 0,L6 6,L12 0"
              fill="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </OverlayArrow>
        <Dialog className="flex flex-col gap-y-2 bg-white shadow-xl border rounded-md p-2">
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
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}

export default function PickerItem({
  advanced,
  label,
  color,
  onChange,
  ...props
}) {
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
