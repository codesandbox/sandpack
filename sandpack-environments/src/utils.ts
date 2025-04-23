export function normalizePath(pathToNormalize: string): string {
  // Normalize the path and ensure it starts with a slash
  const withLeadingSlash = pathToNormalize.startsWith("/")
    ? pathToNormalize
    : "/" + pathToNormalize;

  // Ensure path does not end with a slash (unless it's the root path)
  return withLeadingSlash === "/"
    ? withLeadingSlash
    : withLeadingSlash.endsWith("/")
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  // 'timer' will hold the timeout id for the pending function execution.
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>): void => {
    // If there is an existing timer, clear it to cancel the previous scheduled call.
    clearTimeout(timer);

    // Set a new timeout to call the function after the specified delay.
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
