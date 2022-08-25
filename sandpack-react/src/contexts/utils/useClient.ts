import type {
  BundlerState,
  ReactDevToolsMode,
  SandpackClient,
  SandpackError,
} from "@codesandbox/sandpack-client";
import { useEffect, useRef, useState } from "react";

import type {
  SandpackInitMode,
  SandpackProviderProps,
  SandpackStatus,
} from "../..";

interface SandpackConfigState {
  reactDevTools?: ReactDevToolsMode;
  startRoute?: string;
  initMode: SandpackInitMode;
  bundlerState?: BundlerState;
  error: SandpackError | null;
  sandpackStatus: SandpackStatus;
}

type UseClient = (
  props: SandpackProviderProps
) => [SandpackConfigState, { initializeSandpackIframe: () => void }];

export const useClient: UseClient = (props) => {
  const initModeFromProps = props.options?.initMode || "lazy";

  const [state, setState] = useState<SandpackConfigState>({
    startRoute: props.options?.startRoute,
    bundlerState: undefined,
    error: null,
    initMode: initModeFromProps,
    reactDevTools: undefined,
    sandpackStatus: props.options?.autorun ?? true ? "initial" : "idle",
  });

  const intersectionObserver = useRef<IntersectionObserver>(null);
  const lazyAnchorRef = useRef<HTMLDivElement>(null);
  const initializeSandpackIframeHook = useRef<NodeJS.Timer | null>(null);
  const preregisteredIframes = useRef<Record<string, HTMLIFrameElement>>({});
  const clients = useRef<Record<string, SandpackClient>>({});

  useEffect(
    function watchInitMode() {
      if (initModeFromProps !== state.initMode) {
        setState((prev) => ({ ...prev, initMode: initModeFromProps }));
        // TODO: initializeSandpackIframe()
      }
    },
    [initModeFromProps, state]
  );

  const initializeSandpackIframe = (): void => {
    const autorun = props.options?.autorun ?? true;

    if (!autorun) {
      return;
    }

    const observerOptions = props.options?.initModeObserverOptions ?? {
      rootMargin: `1000px 0px`,
    };

    if (intersectionObserver.current && lazyAnchorRef.current) {
      intersectionObserver.current?.unobserve(lazyAnchorRef.current);
    }

    if (lazyAnchorRef.current && state.initMode === "lazy") {
      // If any component registerd a lazy anchor ref component, use that for the intersection observer
      intersectionObserver.current = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          // Delay a cycle so all hooks register the refs for the sub-components (open in csb, loading, error overlay)
          initializeSandpackIframeHook.current = setTimeout(() => {
            runSandpack();
          }, 50);

          if (lazyAnchorRef.current) {
            intersectionObserver.current?.unobserve(lazyAnchorRef.current);
          }
        }
      }, observerOptions);

      intersectionObserver.current.observe(lazyAnchorRef.current);
    } else if (lazyAnchorRef.current && state.initMode === "user-visible") {
      intersectionObserver.current = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          // Delay a cycle so all hooks register the refs for the sub-components (open in csb, loading, error overlay)
          initializeSandpackIframeHook.current = setTimeout(() => {
            runSandpack();
          }, 50);
        } else {
          if (initializeSandpackIframeHook.current) {
            clearTimeout(initializeSandpackIframeHook.current);
          }

          Object.keys(clients.current).map(this.unregisterBundler);
          this.unregisterAllClients();
        }
      }, observerOptions);

      intersectionObserver.current.observe(lazyAnchorRef.current);
    } else {
      // else run the sandpack on mount, with a slight delay to allow all subcomponents to mount/register components
      initializeSandpackIframeHook.current = setTimeout(
        () => runSandpack(),
        50
      );
    }
  };

  const runSandpack = (): void => {
    Object.keys(preregisteredIframes.current).forEach((clientId) => {
      const iframe = preregisteredIframes.current[clientId];
      clients.current[clientId] = this.createClient(iframe, clientId);
    });

    setState((prev) => ({ ...prev, sandpackStatus: "running" }));
  };

  return [state, { initializeSandpackIframe }];
};