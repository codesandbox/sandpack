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
  updateCode: (newCode: string, shouldUpdatePreview?: boolean) => void;
} => {
  const { sandpack } = useSandpack();

  return {
    code: sandpack.files[sandpack.activeFile]?.code,
    readOnly: sandpack.files[sandpack.activeFile]?.readOnly ?? false,
    updateCode: sandpack.updateCurrentFile,
  };
};
