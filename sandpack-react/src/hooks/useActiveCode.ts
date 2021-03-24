import { useSandpack } from "./useSandpack";

export const useActiveCode = (): {
  code: string;
  updateCode: (newCode: string) => void;
} => {
  const { sandpack } = useSandpack();

  return {
    code: sandpack.files[sandpack.activePath].code,
    updateCode: sandpack.updateCurrentFile,
  };
};
