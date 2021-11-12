---
id: "index"
title: "Components"
slug: "/api/components/"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Interfaces

- [CodeEditorProps](interfaces/CodeEditorProps)
- [CodeViewerProps](interfaces/CodeViewerProps)
- [NavigatorProps](interfaces/NavigatorProps)
- [PreviewProps](interfaces/PreviewProps)

## Type aliases

### ViewportOrientation

Ƭ **ViewportOrientation**: ``"portrait"`` \| ``"landscape"``

#### Defined in

[Preview/index.tsx:26](https://github.com/codesandbox/sandpack/blob/eca3fa8/sandpack-react/src/components/Preview/index.tsx#L26)

___

### ViewportSize

Ƭ **ViewportSize**: [`ViewportSizePreset`](#viewportsizepreset) \| ``"auto"`` \| { `height`: `number` ; `width`: `number`  }

#### Defined in

[Preview/index.tsx:21](https://github.com/codesandbox/sandpack/blob/eca3fa8/sandpack-react/src/components/Preview/index.tsx#L21)

___

### ViewportSizePreset

Ƭ **ViewportSizePreset**: ``"iPhone X"`` \| ``"Pixel 2"`` \| ``"iPad"`` \| ``"Moto G4"`` \| ``"Surface Duo"``

#### Defined in

[Preview/index.tsx:14](https://github.com/codesandbox/sandpack/blob/eca3fa8/sandpack-react/src/components/Preview/index.tsx#L14)

## Variables

### CodeEditor

• **CodeEditor**: `ForwardRefExoticComponent`<`CodeMirrorProps` & `RefAttributes`<`HTMLElement`\>\>

#### Defined in

[CodeEditor/CodeMirror.tsx:68](https://github.com/codesandbox/sandpack/blob/eca3fa8/sandpack-react/src/components/CodeEditor/CodeMirror.tsx#L68)

___

### FileTabs

• **FileTabs**: `React.FC`<`FileTabsProps`\>

#### Defined in

[FileTabs/index.tsx:12](https://github.com/codesandbox/sandpack/blob/eca3fa8/sandpack-react/src/components/FileTabs/index.tsx#L12)

___

### Navigator

• **Navigator**: `React.FC`<[`NavigatorProps`](interfaces/NavigatorProps)\>

#### Defined in

[Navigator/index.tsx:14](https://github.com/codesandbox/sandpack/blob/eca3fa8/sandpack-react/src/components/Navigator/index.tsx#L14)

___

### RefreshButton

• **RefreshButton**: `React.FC`<`RefreshButtonProps`\>

#### Defined in

[Preview/RefreshButton.tsx:11](https://github.com/codesandbox/sandpack/blob/eca3fa8/sandpack-react/src/components/Preview/RefreshButton.tsx#L11)

___

### SandpackCodeEditor

• **SandpackCodeEditor**: `React.FC`<[`CodeEditorProps`](interfaces/CodeEditorProps)\>

#### Defined in

[CodeEditor/index.tsx:24](https://github.com/codesandbox/sandpack/blob/eca3fa8/sandpack-react/src/components/CodeEditor/index.tsx#L24)

___

### SandpackCodeViewer

• **SandpackCodeViewer**: `ForwardRefExoticComponent`<[`CodeViewerProps`](interfaces/CodeViewerProps) & `RefAttributes`<`HTMLDivElement`\>\>

#### Defined in

[CodeViewer/index.tsx:19](https://github.com/codesandbox/sandpack/blob/eca3fa8/sandpack-react/src/components/CodeViewer/index.tsx#L19)

___

### SandpackPreview

• **SandpackPreview**: `React.FC`<[`PreviewProps`](interfaces/PreviewProps)\>

#### Defined in

[Preview/index.tsx:39](https://github.com/codesandbox/sandpack/blob/eca3fa8/sandpack-react/src/components/Preview/index.tsx#L39)

___

### SandpackTranspiledCode

• **SandpackTranspiledCode**: `React.FC`

#### Defined in

[TranspiledCode/index.tsx:10](https://github.com/codesandbox/sandpack/blob/eca3fa8/sandpack-react/src/components/TranspiledCode/index.tsx#L10)
