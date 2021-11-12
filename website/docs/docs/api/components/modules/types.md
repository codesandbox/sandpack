---
id: "types"
title: "Module: types"
sidebar_label: "types"
sidebar_position: 0
custom_edit_url: null
---

## Interfaces

- [FileResolver](../interfaces/types.FileResolver)
- [SandboxTemplate](../interfaces/types.SandboxTemplate)
- [SandpackFile](../interfaces/types.SandpackFile)
- [SandpackSetup](../interfaces/types.SandpackSetup)
- [SandpackState](../interfaces/types.SandpackState)
- [SandpackSyntaxStyle](../interfaces/types.SandpackSyntaxStyle)
- [SandpackTheme](../interfaces/types.SandpackTheme)

## Type aliases

### DeepPartial

Ƭ **DeepPartial**<`Type`\>: { [Property in keyof Type]?: DeepPartial<Type[Property]\> }

#### Type parameters

| Name |
| :------ |
| `Type` |

#### Defined in

[types.ts:173](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/types.ts#L173)

___

### EditorState

Ƭ **EditorState**: ``"pristine"`` \| ``"dirty"``

#### Defined in

[types.ts:68](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/types.ts#L68)

___

### SandboxEnvironment

Ƭ **SandboxEnvironment**: `ITemplate`

#### Defined in

[types.ts:95](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/types.ts#L95)

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

[types.ts:11](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/types.ts#L11)

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

[types.ts:16](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/types.ts#L16)

___

### SandpackContext

Ƭ **SandpackContext**: [`SandpackState`](../interfaces/types.SandpackState) & { `dispatch`: [`SandpackClientDispatch`](types#sandpackclientdispatch) ; `listen`: [`SandpackClientListen`](types#sandpackclientlisten)  }

#### Defined in

[types.ts:21](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/types.ts#L21)

___

### SandpackFiles

Ƭ **SandpackFiles**: `Record`<`string`, `string` \| [`SandpackFile`](../interfaces/types.SandpackFile)\>

#### Defined in

[types.ts:85](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/types.ts#L85)

___

### SandpackPartialTheme

Ƭ **SandpackPartialTheme**: [`DeepPartial`](types#deeppartial)<[`SandpackTheme`](../interfaces/types.SandpackTheme)\>

#### Defined in

[types.ts:166](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/types.ts#L166)

___

### SandpackPredefinedTemplate

Ƭ **SandpackPredefinedTemplate**: ``"angular"`` \| ``"react"`` \| ``"react-ts"`` \| ``"vanilla"`` \| ``"vue"`` \| ``"vue3"``

#### Defined in

[types.ts:97](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/types.ts#L97)

___

### SandpackPredefinedTheme

Ƭ **SandpackPredefinedTheme**: ``"codesandbox-light"`` \| ``"codesandbox-dark"`` \| ``"night-owl"`` \| ``"aqua-blue"`` \| ``"github-light"`` \| ``"monokai-pro"``

#### Defined in

[types.ts:105](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/types.ts#L105)

___

### SandpackStatus

Ƭ **SandpackStatus**: ``"initial"`` \| ``"idle"`` \| ``"running"`` \| ``"timeout"`` \| ``"done"``

#### Defined in

[types.ts:62](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/types.ts#L62)

___

### SandpackThemeProp

Ƭ **SandpackThemeProp**: [`SandpackPredefinedTheme`](types#sandpackpredefinedtheme) \| [`SandpackPartialTheme`](types#sandpackpartialtheme) \| ``"auto"``

#### Defined in

[types.ts:168](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/types.ts#L168)
