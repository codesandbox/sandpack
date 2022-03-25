import { useEffect, useReducer } from "react";

export interface ISandboxData {
  // dependencies: {}
  entry: string;
  environment: string;
  main: string;
  files: Record<
    string,
    {
      code: string;
    }
  >;
}

export interface SandboxDataHookState {
  sandboxId: string;
  isLoading: boolean;
  error: Error | null;
  data: ISandboxData | null;
}

interface IFetchingAction {
  type: "fetching";
  sandboxId: string;
}

interface IFetchResultAction {
  type: "fetch-result";
  sandboxId: string;
  data: ISandboxData | null;
  error: Error | null;
}

type SandboxDataReducerAction = IFetchingAction | IFetchResultAction;

function sandboxDataReducer(
  prevState: SandboxDataHookState,
  action: SandboxDataReducerAction
): SandboxDataHookState {
  switch (action.type) {
    case "fetching":
      return {
        ...prevState,
        isLoading: true,
        error: null,
        sandboxId: action.sandboxId,
      };
    case "fetch-result":
      if (action.sandboxId === prevState.sandboxId) {
        return {
          ...prevState,
          isLoading: false,
          data: action.data,
          error: action.error,
        };
      }
      break;
  }

  return prevState;
}

export async function fetchSandbox(
  sandboxId: string,
  apiRoot: string
): Promise<ISandboxData> {
  const uri = `${apiRoot}/v1/sandboxes/${encodeURI(sandboxId)}/sandpack`;
  const response = await fetch(uri);
  const content = await response.text();
  if (response.status !== 200) {
    const err = new Error(content);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    err.status = response.status;
    throw err;
  }
  return JSON.parse(content);
}

export function useSandboxData(
  sandboxId: string,
  apiRoot: string
): SandboxDataHookState {
  const [state, dispatch] = useReducer(sandboxDataReducer, {
    sandboxId,
    isLoading: false,
    error: null,
    data: null,
  });

  const windowType = typeof window;
  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchSandbox(sandboxId, apiRoot)
        .then((data) => {
          dispatch({
            type: "fetch-result",
            sandboxId,
            error: null,
            data,
          });
        })
        .catch((error) => {
          dispatch({
            type: "fetch-result",
            sandboxId,
            error,
            data: null,
          });
        });
    }
  }, [apiRoot, sandboxId, windowType]);

  return state;
}
