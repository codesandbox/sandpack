import * as React from "react";

const SVG: React.FC<React.SVGAttributes<unknown>> = (props) => (
  <svg
    fill="currentColor"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  />
);

/**
 * @hidden
 */
export const RunIcon = (): React.ReactElement => (
  <SVG viewBox="0 0 17 16">
    <path d="M11.0792 8.1078C11.2793 8.25007 11.27 8.55012 11.0616 8.67981L6.02535 11.8135C5.79638 11.956 5.5 11.7913 5.5 11.5216L5.5 8.40703L5.5 4.80661C5.5 4.52735 5.81537 4.36463 6.04296 4.52647L11.0792 8.1078Z" />
  </SVG>
);

/**
 * @hidden
 */
export const BackwardIcon = (): React.ReactElement => (
  <SVG>
    <path d="M8.99126 12.2106L14.0455 6.98196L13.2998 6.21057L7.5 12.2106L13.2998 18.2106L14.0455 17.3924L8.99126 12.2106Z" />
  </SVG>
);

/**
 * @hidden
 */
export const ForwardIcon = (): React.ReactElement => (
  <SVG>
    <path d="M13.5087 12.2105L8.45455 17.4392L9.2002 18.2106L15 12.2106L9.2002 6.21057L8.45455 7.02875L13.5087 12.2105Z" />
  </SVG>
);

/**
 * @hidden
 */
export const RefreshIcon = (): React.ReactElement => (
  <SVG>
    <path
      clipRule="evenodd"
      d="M16.48 12.8571C16.0883 15.1705 14.1389 16.9286 11.7931 16.9286C9.16499 16.9286 7.03448 14.722 7.03448 12C7.03448 9.27803 9.16499 7.07143 11.7931 7.07143C13.6797 7.07143 15.3099 8.20855 16.0796 9.85714L14.2759 9.85714V11.1429H16.48H16.7586H17.5275H18V6.85714L16.7586 6.85714V8.90778C15.7449 7.16536 13.9004 6 11.7931 6C8.59366 6 6 8.68629 6 12C6 15.3137 8.59366 18 11.7931 18C14.7116 18 17.126 15.7648 17.5275 12.8571H16.48Z"
      fillRule="evenodd"
    />
  </SVG>
);

/**
 * @hidden
 */
export const CleanIcon = (): React.ReactElement => (
  <SVG fill="none" stroke="currentColor">
    <path
      d="M12.0001 19.0001C15.8661 19.0001 19.0001 15.8661 19.0001 12.0001C19.0001 8.13407 15.8661 5.00006 12.0001 5.00006C8.13407 5.00006 5.00006 8.13407 5.00006 12.0001C5.00006 15.8661 8.13407 19.0001 12.0001 19.0001Z"
      strokeLinecap="round"
    />
    <path d="M6.99994 6.99994L16.9999 16.9999" />
  </SVG>
);

/**
 * @hidden
 */
export const ExportIcon = (): React.ReactElement => (
  <svg
    fill="none"
    height="24"
    stroke="currentColor"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10.5714 7H8.07143C7.4797 7 7 7.4797 7 8.07143V15.9286C7 16.5203 7.4797 17 8.07143 17H15.9286C16.5203 17 17 16.5203 17 15.9286V13.4286" />
    <path d="M14.1429 7H16.8929C16.952 7 17 7.04798 17 7.10714V9.85715" />
    <path d="M11.2858 12.7143L16.8572 7.14282" />
  </svg>
);

/**
 * @hidden
 */
export const DirectoryIcon = ({
  isOpen = false,
}: {
  isOpen?: boolean;
}): React.ReactElement => (
  <SVG height="12" viewBox="0 0 12 11" width="11">
    {isOpen ? (
      <>
        <path
          d="M10.5526 9.66667H1.66675C1.2922 9.66667 0.965754 9.46076 0.794425 9.15596L1.81072 5.0908C1.92201 4.64563 2.32199 4.33333 2.78086 4.33333H11.386C12.0365 4.33333 12.5139 4.94472 12.3561 5.57587L11.5228 8.9092C11.4115 9.35437 11.0115 9.66667 10.5526 9.66667Z"
          fill="currentColor"
        />
        <path
          d="M11.3334 3.63333V3.33333C11.3334 2.78105 10.8857 2.33333 10.3334 2.33333H6.30286C6.10543 2.33333 5.91242 2.2749 5.74816 2.16538L4.25201 1.16795C4.08774 1.05844 3.89473 1 3.69731 1H1.66675C1.11446 1 0.666748 1.44772 0.666748 2L0.666748 8.66667C0.666748 9.21895 1.11446 9.66667 1.66675 9.66667H10.5526C11.0115 9.66667 11.4115 9.35437 11.5228 8.9092L12.3561 5.57587C12.5139 4.94472 12.0365 4.33333 11.386 4.33333H2.78086C2.32199 4.33333 1.92201 4.64563 1.81072 5.0908L0.750081 9.33333"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
        />
      </>
    ) : (
      <path
        d="M10.3334 9.66667H1.66675C1.11446 9.66667 0.666748 9.21895 0.666748 8.66667V2C0.666748 1.44772 1.11446 1 1.66675 1H3.69731C3.89473 1 4.08774 1.05844 4.25201 1.16795L5.74816 2.16538C5.91242 2.2749 6.10543 2.33333 6.30286 2.33333H10.3334C10.8857 2.33333 11.3334 2.78105 11.3334 3.33333V8.66667C11.3334 9.21895 10.8857 9.66667 10.3334 9.66667Z"
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
      />
    )}
  </SVG>
);

/**
 * @hidden
 */
export const FileIcon = (): React.ReactElement => (
  <svg
    fill="currentColor"
    height="12"
    viewBox="0 0 10 12"
    width="10"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.5 2.33325C1.5 2.05711 1.72386 1.83325 2 1.83325H5.16675V4.56659C5.16675 4.89795 5.43538 5.16658 5.76675 5.16658H8.5V10.3333C8.5 10.6094 8.27614 10.8333 8 10.8333H2C1.72386 10.8333 1.5 10.6094 1.5 10.3333V2.33325ZM9.5 4.67568C9.50005 4.67265 9.50008 4.66962 9.50008 4.66658C9.50008 4.66355 9.50005 4.66052 9.5 4.65749V4.41413C9.5 4.01631 9.34196 3.63478 9.06066 3.35347L6.97978 1.27259C6.69848 0.991287 6.31694 0.833252 5.91912 0.833252H5.66675H2C1.17157 0.833252 0.5 1.50483 0.5 2.33325V10.3333C0.5 11.1617 1.17157 11.8333 2 11.8333H8C8.82843 11.8333 9.5 11.1617 9.5 10.3333V4.67568ZM6.16675 1.89888C6.20518 1.92078 6.24085 1.94787 6.27267 1.9797L8.35355 4.06058C8.3854 4.09243 8.41251 4.12813 8.43442 4.16658H6.16675V1.89888Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * @hidden
 */
export const CloseIcon = (): React.ReactElement => (
  <SVG height="8" viewBox="0 0 16 16" width="8">
    <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" />
  </SVG>
);

/**
 * @hidden
 */
export const ConsoleIcon = (): React.ReactElement => (
  <SVG height={16} width={16}>
    <path d="M8.32537 5.62037C8.1157 5.44066 7.80005 5.46494 7.62034 5.6746C7.44063 5.88427 7.46491 6.19992 7.67457 6.37963L8.32537 5.62037ZM7.67457 17.6204C7.46491 17.8001 7.44063 18.1157 7.62034 18.3254C7.80005 18.5351 8.1157 18.5593 8.32537 18.3796L7.67457 17.6204ZM7.67457 6.37963L14.586 12.3037L15.2368 11.5444L8.32537 5.62037L7.67457 6.37963ZM14.586 11.6963L7.67457 17.6204L8.32537 18.3796L15.2368 12.4556L14.586 11.6963ZM14.586 12.3037C14.3998 12.1441 14.3997 11.8559 14.586 11.6963L15.2368 12.4556C15.5162 12.2161 15.5162 11.7839 15.2368 11.5444L14.586 12.3037Z" />
    <path d="M15 17.5C14.7239 17.5 14.5 17.7239 14.5 18C14.5 18.2761 14.7239 18.5 15 18.5V17.5ZM22 18.5C22.2761 18.5 22.5 18.2761 22.5 18C22.5 17.7239 22.2761 17.5 22 17.5V18.5ZM15 18.5H22V17.5H15V18.5Z" />
  </SVG>
);
