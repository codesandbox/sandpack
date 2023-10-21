export function ColorSwatch(props) {
  let { value, ...otherProps } = props;
  return (
    <div
      aria-label={value.toString("css")}
      className="inline-block rounded-md [forced-color-adjust:none] relative w-10 h-10 m-0.5 overflow-hidden"
      role="img"
      {...otherProps}
    >
      <div className="color-preview-swatch-background" />
      <div
        className="color-preview-swatch-color"
        style={{
          backgroundColor: value.toString("css"),
        }}
      />
    </div>
  );
}
