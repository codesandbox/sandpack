import { useSandpack } from "./useSandpack";

/**
 * This returns the current state of the active file
 * and a method to update its content.
 *
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
    readOnly: sandpack.files[sandpack.activePath].readOnly ?? false,
    updateCode: sandpack.updateCurrentFile,
  };
};
