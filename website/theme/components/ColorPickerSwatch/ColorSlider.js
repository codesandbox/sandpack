import { useColorSlider } from "@react-aria/color";
import { useFocusRing } from "@react-aria/focus";
import { useLocale } from "@react-aria/i18n";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useColorSliderState } from "@react-stately/color";
import { useRef } from "react";

// import { FOCUSED_THUMB_SIZE, SIZE } from "./Shared";

export function ColorSlider(props) {
  let { locale } = useLocale();
  let state = useColorSliderState({ ...props, locale });
  let trackRef = useRef(null);
  let inputRef = useRef(null);

  // Default label to the channel name in the current locale
  let label = props.label || state.value.getChannelName(props.channel, locale);
  // labelProps, outputProps USED THEM FOR LABELS
  let { trackProps, thumbProps, inputProps } = useColorSlider(
    {
      ...props,
      label,
      trackRef,
      inputRef,
    },
    state
  );

  let { focusProps, isFocusVisible } = useFocusRing();
  const thumbCls = "w-3 h-5"; // 20px
  const heightCls = "h-4"; // 28px
  return (
    <div
      className="flex flex-col items-center w-full"
      // style={{
      //   width: SIZE,
      // }}
    >
      {/* Create a flex container for the label and output element. */}
      {/* <div style={{ display: "flex", alignSelf: "stretch" }}>
        <label {...labelProps}>{label}</label>
        <output {...outputProps} style={{ flex: "1 0 auto", textAlign: "end" }}>
          {state.value.formatChannelValue(props.channel, locale)}
        </output>
      </div> */}
      {/* The track element holds the visible track line and the thumb. */}
      <div
        className={`relative w-full rounded-2xl [forced-color-adjust:none] ${heightCls}`}
        {...trackProps}
        ref={trackRef}
      >
        <div className="color-slider-track-background"></div>
        <div
          className="color-slider-track-color"
          style={{
            ...trackProps.style,
          }}
        ></div>
        <div
          className={`color-slider-thumb rounded-md absolute top-2 border border-white box-border ${thumbCls} ${
            isFocusVisible ? " is-focused" : ""
          }`}
          {...thumbProps}
          style={{
            ...thumbProps.style,
          }}
        >
          <div className="color-slider-thumb-background"></div>
          <div
            className="color-slider-thumb-color"
            style={{
              background: state.getDisplayColor().toString("css"),
            }}
          ></div>
          <VisuallyHidden>
            <input ref={inputRef} {...inputProps} {...focusProps} />
          </VisuallyHidden>
        </div>
      </div>
    </div>
  );
}
