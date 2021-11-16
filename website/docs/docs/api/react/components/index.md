---
id: "index"
title: "Components"
slug: "/api/react/components/"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Interfaces

- [CodeEditorProps](interfaces/CodeEditorProps)
- [CodeViewerProps](interfaces/CodeViewerProps)
- [FileResolver](interfaces/FileResolver)
- [LoadingOverlayProps](interfaces/LoadingOverlayProps)
- [NavigatorProps](interfaces/NavigatorProps)
- [PreviewProps](interfaces/PreviewProps)
- [SandboxTemplate](interfaces/SandboxTemplate)
- [SandpackFile](interfaces/SandpackFile)
- [SandpackLayoutProps](interfaces/SandpackLayoutProps)
- [SandpackProps](interfaces/SandpackProps)
- [SandpackRunnerProps](interfaces/SandpackRunnerProps)
- [SandpackSetup](interfaces/SandpackSetup)
- [SandpackState](interfaces/SandpackState)
- [SandpackSyntaxStyle](interfaces/SandpackSyntaxStyle)
- [SandpackTheme](interfaces/SandpackTheme)

## Type aliases

### EditorState

Ƭ **EditorState**: ``"pristine"`` \| ``"dirty"``

#### Defined in

[types.ts:68](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/types.ts#L68)

___

### SandboxEnvironment

Ƭ **SandboxEnvironment**: `ITemplate`

#### Defined in

[types.ts:95](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/types.ts#L95)

___

### SandpackClientDispatch

Ƭ **SandpackClientDispatch**: (`msg`: `SandpackMessage`, `clientId?`: `string`) => `void`

#### Type declaration

▸ (`msg`, `clientId?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `SandpackMessage` |
| `clientId?` | `string` |

##### Returns

`void`

#### Defined in

[types.ts:11](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/types.ts#L11)

___

### SandpackClientListen

Ƭ **SandpackClientListen**: (`listener`: `ListenerFunction`, `clientId?`: `string`) => `UnsubscribeFunction`

#### Type declaration

▸ (`listener`, `clientId?`): `UnsubscribeFunction`

##### Parameters

| Name | Type |
| :------ | :------ |
| `listener` | `ListenerFunction` |
| `clientId?` | `string` |

##### Returns

`UnsubscribeFunction`

#### Defined in

[types.ts:16](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/types.ts#L16)

___

### SandpackContext

Ƭ **SandpackContext**: [`SandpackState`](interfaces/SandpackState) & { `dispatch`: [`SandpackClientDispatch`](#sandpackclientdispatch) ; `listen`: [`SandpackClientListen`](#sandpackclientlisten)  }

#### Defined in

[types.ts:21](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/types.ts#L21)

___

### SandpackFiles

Ƭ **SandpackFiles**: `Record`<`string`, `string` \| [`SandpackFile`](interfaces/SandpackFile)\>

#### Defined in

[types.ts:85](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/types.ts#L85)

___

### SandpackPartialTheme

Ƭ **SandpackPartialTheme**: `DeepPartial`<[`SandpackTheme`](interfaces/SandpackTheme)\>

#### Defined in

[types.ts:167](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/types.ts#L167)

___

### SandpackPredefinedTemplate

Ƭ **SandpackPredefinedTemplate**: ``"angular"`` \| ``"react"`` \| ``"react-ts"`` \| ``"vanilla"`` \| ``"vanilla-ts"`` \| ``"vue"`` \| ``"vue3"``

#### Defined in

[types.ts:97](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/types.ts#L97)

___

### SandpackPredefinedTheme

Ƭ **SandpackPredefinedTheme**: ``"codesandbox-light"`` \| ``"codesandbox-dark"`` \| ``"night-owl"`` \| ``"aqua-blue"`` \| ``"github-light"`` \| ``"monokai-pro"``

#### Defined in

[types.ts:106](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/types.ts#L106)

___

### SandpackStatus

Ƭ **SandpackStatus**: ``"initial"`` \| ``"idle"`` \| ``"running"`` \| ``"timeout"`` \| ``"done"``

#### Defined in

[types.ts:62](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/types.ts#L62)

___

### SandpackThemeProp

Ƭ **SandpackThemeProp**: [`SandpackPredefinedTheme`](#sandpackpredefinedtheme) \| [`SandpackPartialTheme`](#sandpackpartialtheme) \| ``"auto"``

#### Defined in

[types.ts:169](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/types.ts#L169)

___

### ViewportOrientation

Ƭ **ViewportOrientation**: ``"portrait"`` \| ``"landscape"``

#### Defined in

[components/Preview/index.tsx:26](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/components/Preview/index.tsx#L26)

___

### ViewportSize

Ƭ **ViewportSize**: [`ViewportSizePreset`](#viewportsizepreset) \| ``"auto"`` \| { `height`: `number` ; `width`: `number`  }

#### Defined in

[components/Preview/index.tsx:21](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/components/Preview/index.tsx#L21)

___

### ViewportSizePreset

Ƭ **ViewportSizePreset**: ``"iPhone X"`` \| ``"Pixel 2"`` \| ``"iPad"`` \| ``"Moto G4"`` \| ``"Surface Duo"``

#### Defined in

[components/Preview/index.tsx:14](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/components/Preview/index.tsx#L14)

## Variables

### CodeEditor

• **CodeEditor**: `ForwardRefExoticComponent`<`CodeMirrorProps` & `RefAttributes`<`HTMLElement`\>\>

#### Defined in

[components/CodeEditor/CodeMirror.tsx:68](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/components/CodeEditor/CodeMirror.tsx#L68)

___

### ErrorOverlay

• **ErrorOverlay**: `React.FC`

#### Defined in

[common/ErrorOverlay.tsx:6](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/common/ErrorOverlay.tsx#L6)

___

### FileTabs

• **FileTabs**: `React.FC`<`FileTabsProps`\>

#### Defined in

[components/FileTabs/index.tsx:12](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/components/FileTabs/index.tsx#L12)

___

### LoadingOverlay

• **LoadingOverlay**: `React.FC`<[`LoadingOverlayProps`](interfaces/LoadingOverlayProps)\>

#### Defined in

[common/LoadingOverlay.tsx:12](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/common/LoadingOverlay.tsx#L12)

___

### Navigator

• **Navigator**: `React.FC`<[`NavigatorProps`](interfaces/NavigatorProps)\>

#### Defined in

[components/Navigator/index.tsx:14](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/components/Navigator/index.tsx#L14)

___

### OpenInCodeSandboxButton

• **OpenInCodeSandboxButton**: `React.FC`

#### Defined in

[common/OpenInCodeSandboxButton.tsx:9](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/common/OpenInCodeSandboxButton.tsx#L9)

___

### RefreshButton

• **RefreshButton**: `React.FC`<`RefreshButtonProps`\>

#### Defined in

[components/Preview/RefreshButton.tsx:11](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/components/Preview/RefreshButton.tsx#L11)

___

### Sandpack

• **Sandpack**: `React.FC`<[`SandpackProps`](interfaces/SandpackProps)\>

#### Defined in

[presets/Sandpack.tsx:51](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/presets/Sandpack.tsx#L51)

___

### SandpackCodeEditor

• **SandpackCodeEditor**: `React.FC`<[`CodeEditorProps`](interfaces/CodeEditorProps)\>

#### Defined in

[components/CodeEditor/index.tsx:24](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/components/CodeEditor/index.tsx#L24)

___

### SandpackCodeViewer

• **SandpackCodeViewer**: `ForwardRefExoticComponent`<[`CodeViewerProps`](interfaces/CodeViewerProps) & `RefAttributes`<`HTMLDivElement`\>\>

#### Defined in

[components/CodeViewer/index.tsx:19](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/components/CodeViewer/index.tsx#L19)

___

### SandpackLayout

• **SandpackLayout**: `React.FC`<[`SandpackLayoutProps`](interfaces/SandpackLayoutProps)\>

#### Defined in

[common/Layout.tsx:12](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/common/Layout.tsx#L12)

___

### SandpackPreview

• **SandpackPreview**: `React.FC`<[`PreviewProps`](interfaces/PreviewProps)\>

#### Defined in

[components/Preview/index.tsx:39](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/components/Preview/index.tsx#L39)

___

### SandpackRunner

• **SandpackRunner**: `React.FC`<[`SandpackRunnerProps`](interfaces/SandpackRunnerProps)\>

#### Defined in

[presets/SandpackRunner.tsx:27](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/presets/SandpackRunner.tsx#L27)

___

### SandpackStack

• **SandpackStack**: `React.FC`<`Object`\>

#### Defined in

[common/Stack.tsx:4](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/common/Stack.tsx#L4)

___

### SandpackTranspiledCode

• **SandpackTranspiledCode**: `React.FC`

#### Defined in

[components/TranspiledCode/index.tsx:10](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-react/src/components/TranspiledCode/index.tsx#L10)
