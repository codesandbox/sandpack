---
id: "SandpackState"
title: "Interface: SandpackState"
sidebar_label: "SandpackState"
sidebar_position: 0
custom_edit_url: null
---

## Properties

### activePath

• **activePath**: `string`

#### Defined in

[types.ts:29](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/types.ts#L29)

___

### bundlerState

• **bundlerState**: `undefined` \| `BundlerState`

#### Defined in

[types.ts:27](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/types.ts#L27)

___

### editorState

• **editorState**: [`EditorState`](../#editorstate)

#### Defined in

[types.ts:31](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/types.ts#L31)

___

### environment

• `Optional` **environment**: `ITemplate`

#### Defined in

[types.ts:34](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/types.ts#L34)

___

### error

• **error**: ``null`` \| `SandpackError`

#### Defined in

[types.ts:32](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/types.ts#L32)

___

### errorScreenRegisteredRef

• **errorScreenRegisteredRef**: `MutableRefObject`<`boolean`\>

#### Defined in

[types.ts:57](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/types.ts#L57)

___

### files

• **files**: `SandpackBundlerFiles`

#### Defined in

[types.ts:33](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/types.ts#L33)

___

### lazyAnchorRef

• **lazyAnchorRef**: `RefObject`<`HTMLDivElement`\>

#### Defined in

[types.ts:52](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/types.ts#L52)

___

### loadingScreenRegisteredRef

• **loadingScreenRegisteredRef**: `MutableRefObject`<`boolean`\>

#### Defined in

[types.ts:59](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/types.ts#L59)

___

### openInCSBRegisteredRef

• **openInCSBRegisteredRef**: `MutableRefObject`<`boolean`\>

#### Defined in

[types.ts:58](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/types.ts#L58)

___

### openPaths

• **openPaths**: `string`[]

#### Defined in

[types.ts:28](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/types.ts#L28)

___

### startRoute

• `Optional` **startRoute**: `string`

#### Defined in

[types.ts:30](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/types.ts#L30)

___

### status

• **status**: [`SandpackStatus`](../#sandpackstatus)

#### Defined in

[types.ts:35](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/types.ts#L35)

## Methods

### closeFile

▸ **closeFile**(`path`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`void`

#### Defined in

[types.ts:43](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/types.ts#L43)

___

### deleteFile

▸ **deleteFile**(`path`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`void`

#### Defined in

[types.ts:44](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/types.ts#L44)

___

### openFile

▸ **openFile**(`path`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`void`

#### Defined in

[types.ts:42](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/types.ts#L42)

___

### registerBundler

▸ **registerBundler**(`iframe`, `clientId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `iframe` | `HTMLIFrameElement` |
| `clientId` | `string` |

#### Returns

`void`

#### Defined in

[types.ts:38](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/types.ts#L38)

___

### resetAllFiles

▸ **resetAllFiles**(): `void`

#### Returns

`void`

#### Defined in

[types.ts:47](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/types.ts#L47)

___

### resetFile

▸ **resetFile**(`path`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`void`

#### Defined in

[types.ts:46](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/types.ts#L46)

___

### runSandpack

▸ **runSandpack**(): `void`

#### Returns

`void`

#### Defined in

[types.ts:37](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/types.ts#L37)

___

### setActiveFile

▸ **setActiveFile**(`path`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`void`

#### Defined in

[types.ts:45](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/types.ts#L45)

___

### unregisterBundler

▸ **unregisterBundler**(`clientId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `clientId` | `string` |

#### Returns

`void`

#### Defined in

[types.ts:39](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/types.ts#L39)

___

### updateCurrentFile

▸ **updateCurrentFile**(`newCode`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newCode` | `string` |

#### Returns

`void`

#### Defined in

[types.ts:41](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/types.ts#L41)

___

### updateFile

▸ **updateFile**(`path`, `newCode`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `newCode` | `string` |

#### Returns

`void`

#### Defined in

[types.ts:40](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/types.ts#L40)
