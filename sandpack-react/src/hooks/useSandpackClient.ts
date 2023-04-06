import type {
  ListenerFunction,
  SandpackClient,
  SandpackMessage,
  UnsubscribeFunction,
} from "@codesandbox/sandpack-client";
import * as React from "react";

import type { ClientPropsOverride } from "../contexts/utils/useClient";
import type { SandpackState } from "../types";
import { generateRandomId } from "../utils/stringUtils";

import { useSandpack } from "./useSandpack";

interface UseSandpackClient {
  sandpack: SandpackState;
  getClient: () => InstanceType<typeof SandpackClient> | null;
  iframe: React.MutableRefObject<HTMLIFrameElement | null>;
  listen: (listener: ListenerFunction) => UnsubscribeFunction;
  dispatch: (message: SandpackMessage) => void;
  clientId: string;
}

/**
 * It registers a new sandpack client and returns its instance,
 * listeners, and dispatch function. Using it when creating a custom
 * component to interact directly with the client is recommended.
 * For other cases, use `useSandpack` instead.
 *
 * @category Hooks
 */
export const useSandpackClient = (
  clientPropsOverride?: ClientPropsOverride
): UseSandpackClient => {
  const { sandpack, listen, dispatch } = useSandpack();
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);
  const clientId = React.useRef<string>(generateRandomId());

  React.useEffect(() => {
    const iframeElement = iframeRef.current;
    const clientIdValue = clientId.current;

    if (iframeElement !== null) {
      sandpack.registerBundler(
        iframeElement,
        clientIdValue,
        clientPropsOverride
      );
    }

    return (): void => sandpack.unregisterBundler(clientIdValue);
  }, []);

  const getClient = (): InstanceType<typeof SandpackClient> | null => {
    return sandpack.clients[clientId.current] || null;
  };

  return {
    sandpack,
    getClient,
    clientId: clientId.current,
    iframe: iframeRef,
    listen: (listener): UnsubscribeFunction =>
      listen(listener, clientId.current),
    dispatch: (message): void => dispatch(message, clientId.current),
  };
};
