import { styled } from "@stitches/react";

const LogoWrapper = styled("svg", {});

interface SandpackLogoProps {
  theme?: "light" | "dark";
}
export const SandpackLogo: React.FC<SandpackLogoProps> = ({
  theme = "dark",
}) => {
  return (
    <LogoWrapper
      css={{
        color: {
          light: "$darkTextPrimary",
          dark: "$lightTextPrimary",
        }[theme],
      }}
      fill="none"
      height="100%"
      viewBox="0 0 61 75"
      width="100%"
    >
      <path
        clipRule="evenodd"
        d="M54.675 19.806H33.51V68.35h21.165V19.806Zm-26.99-5.826v60.195H60.5V13.98H27.684Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M27.49 5.825H6.325V54.37H27.49V5.825ZM.5 0v60.194h32.816V0H.5Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </LogoWrapper>
  );
};
