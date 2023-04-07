import { useSandpackPreviewProgress } from "../../hooks/useSandpackPreviewProgress";
import { css } from "../../styles";
import { fadeIn } from "../../styles/shared";

export const DependenciesProgress: React.FC<{ clientId?: string }> = ({
  clientId,
}) => {
  const progressMessage = useSandpackPreviewProgress({
    timeout: 3_000,
    clientId,
  });

  if (!progressMessage) {
    return null;
  }

  return (
    <div className={progressClassName.toString()}>
      <p>{progressMessage}</p>
    </div>
  );
};

const progressClassName = css({
  position: "absolute",
  left: "$space$5",
  bottom: "$space$4",
  zIndex: "$top",
  color: "$colors$clickable",
  animation: `${fadeIn} 150ms ease`,
  fontFamily: "$font$mono",
  fontSize: ".8em",
  width: "75%",
  p: {
    whiteSpace: "nowrap",
    margin: 0,
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
});
