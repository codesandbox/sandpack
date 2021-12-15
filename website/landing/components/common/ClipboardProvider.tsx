import {
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";

import { styled } from "../../stitches.config";
import content from "../../website.config.json";

import { Box } from ".";

const ClipboardContext = createContext({
  copyToClipboard: () => {
    return;
  },
});

const ClipboardToast = styled("div", {
  alignItems: "center",
  background: "$primary",
  borderRadius: "72px",
  bottom: "32px",
  display: "flex",
  color: "$lightTextPrimary",
  gap: "10px",
  left: "50%",
  padding: "15px 20px",
  pointerEvents: "none",
  position: "fixed",
  transform: "translateX(-50%) translateY(calc(100% + 240px)) ",
  transition: "transform .5s cubic-bezier(0.190, 1.000, 0.220, 1.000)",
  zIndex: "1",

  span: {
    fontSize: "1.6rem",
    letterSpacing: "-0.025em",
    margin: 0,
  },

  variants: {
    visible: {
      true: {
        transform: "translateX(-50%) translateY(0) ",
      },
    },
  },
});

const ClipboardProvider: React.FC = ({ children }) => {
  const [toastVisible, setToastVisible] = useState(false);

  const copyToClipboard = useCallback(() => {
    try {
      navigator.clipboard.writeText(content.commands.install);
      setToastVisible(true);
    } catch (err) {
      console.error("Failed to copy command to clipboard", err);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setToastVisible(false);
    }, 2000);

    return (): void => clearTimeout(timeout);
  }, [toastVisible]);

  return (
    <ClipboardContext.Provider value={{ copyToClipboard }}>
      <ClipboardToast visible={toastVisible}>
        <Box
          css={{
            display: "flex",
            height: "16px",
            width: "16px",

            "@bp3": {
              height: "24px",
              width: "24px",
            },
          }}
        >
          <svg fill="none" height="100%" viewBox="0 0 24 24" width="100%">
            <path
              d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z"
              fill="currentColor"
            />
          </svg>
        </Box>
        <span>Copied to clipboard</span>
      </ClipboardToast>

      {children}
    </ClipboardContext.Provider>
  );
};

export const useClipboard = (): { copyToClipboard: () => void } =>
  useContext(ClipboardContext);

export { ClipboardProvider };
