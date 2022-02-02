interface SandpackSyntaxStyle {
  color?: string;
  fontStyle?: "normal" | "italic";
  fontWeight?:
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
  textDecoration?:
    | "none"
    | "underline"
    | "line-through"
    | "underline line-through";
}

export interface SandpackTheme {
  palette: {
    activeText: string;
    defaultText: string;
    inactiveText: string;
    activeBackground: string;
    defaultBackground: string;
    inputBackground: string;
    accent: string;
    errorBackground: string;
    errorForeground: string;
  };
  syntax: {
    plain: string | SandpackSyntaxStyle;
    comment: string | SandpackSyntaxStyle;
    keyword: string | SandpackSyntaxStyle;
    definition: string | SandpackSyntaxStyle;
    punctuation: string | SandpackSyntaxStyle;
    property: string | SandpackSyntaxStyle;
    tag: string | SandpackSyntaxStyle;
    static: string | SandpackSyntaxStyle;
    string?: string | SandpackSyntaxStyle; // use static as fallback
  };
  typography: {
    bodyFont: string;
    monoFont: string;
    fontSize: string;
    lineHeight: string;
  };
}
