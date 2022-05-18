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
  colors: {
    // Surface
    surface1: string;
    surface2: string;
    surface3: string;
    // UI
    disabled: string;
    base: string;
    clickable: string;
    hover: string;
    // Brand
    accent: string;
    // Feedbacks
    error?: string;
    errorSurface?: string;
    warning?: string;
    warningSurface?: string;
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
  font: {
    body: string;
    mono: string;
    size: string;
    lineHeight: string;
  };
}
