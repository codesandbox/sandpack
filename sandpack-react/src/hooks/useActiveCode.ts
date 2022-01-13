import { useSandpack } from "./useSandpack";

/**
 * @category Hooks
 */
export const useActiveCode = (): {
  code: string;
  readOnly: boolean;
  updateCode: (newCode: string) => void;
} => {
  const { sandpack } = useSandpack();

  return {
    code: sandpack.files[sandpack.activePath].code,
    readOnly: sandpack.files[sandpack.activePath].readOnly,
    updateCode: sandpack.updateCurrentFile,
  };
};
