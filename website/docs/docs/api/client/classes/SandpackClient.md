---
id: "SandpackClient"
title: "Class: SandpackClient"
sidebar_label: "SandpackClient"
sidebar_position: 0
custom_edit_url: null
---

## Constructors

### constructor

• **new SandpackClient**(`selector`, `sandboxInfo`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `string` \| `HTMLIFrameElement` |
| `sandboxInfo` | [`SandboxInfo`](../interfaces/SandboxInfo) |
| `options` | [`ClientOptions`](../interfaces/ClientOptions) |

#### Defined in

[client.ts:112](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/client.ts#L112)

## Properties

### bundlerState

• `Optional` **bundlerState**: [`BundlerState`](../interfaces/BundlerState)

#### Defined in

[client.ts:103](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/client.ts#L103)

___

### bundlerURL

• **bundlerURL**: `string`

#### Defined in

[client.ts:102](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/client.ts#L102)

___

### element

• **element**: `Element`

#### Defined in

[client.ts:96](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/client.ts#L96)

___

### errors

• **errors**: [`SandpackError`](../interfaces/SandpackError)[]

#### Defined in

[client.ts:104](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/client.ts#L104)

___

### fileResolverProtocol

• `Optional` **fileResolverProtocol**: `default`

#### Defined in

[client.ts:101](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/client.ts#L101)

___

### iframe

• **iframe**: `HTMLIFrameElement`

#### Defined in

[client.ts:97](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/client.ts#L97)

___

### iframeProtocol

• **iframeProtocol**: `IFrameProtocol`

#### Defined in

[client.ts:98](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/client.ts#L98)

___

### options

• **options**: [`ClientOptions`](../interfaces/ClientOptions)

#### Defined in

[client.ts:99](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/client.ts#L99)

___

### sandboxInfo

• **sandboxInfo**: [`SandboxInfo`](../interfaces/SandboxInfo)

#### Defined in

[client.ts:107](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/client.ts#L107)

___

### selector

• **selector**: `undefined` \| `string`

#### Defined in

[client.ts:95](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/client.ts#L95)

___

### status

• **status**: [`ClientStatus`](../#clientstatus)

#### Defined in

[client.ts:105](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/client.ts#L105)

___

### unsubscribeChannelListener

• **unsubscribeChannelListener**: [`UnsubscribeFunction`](../#unsubscribefunction)

#### Defined in

[client.ts:110](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/client.ts#L110)

___

### unsubscribeGlobalListener

• **unsubscribeGlobalListener**: [`UnsubscribeFunction`](../#unsubscribefunction)

#### Defined in

[client.ts:109](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/client.ts#L109)

## Methods

### cleanup

▸ **cleanup**(): `void`

#### Returns

`void`

#### Defined in

[client.ts:205](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/client.ts#L205)

___

### dispatch

▸ **dispatch**(`message`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`SandpackMessage`](../#sandpackmessage) |

#### Returns

`void`

#### Defined in

[client.ts:285](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/client.ts#L285)

___

### getCodeSandboxURL

▸ **getCodeSandboxURL**(): `Promise`<`Object`\>

Get the URL of the contents of the current sandbox

#### Returns

`Promise`<`Object`\>

#### Defined in

[client.ts:296](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/client.ts#L296)

___

### getFiles

▸ `Private` **getFiles**(): [`SandpackBundlerFiles`](../#sandpackbundlerfiles)

#### Returns

[`SandpackBundlerFiles`](../#sandpackbundlerfiles)

#### Defined in

[client.ts:345](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/client.ts#L345)

___

### getTranspilerContext

▸ **getTranspilerContext**(): `Promise`<`Record`<`string`, `Record`<`string`, `unknown`\>\>\>

#### Returns

`Promise`<`Record`<`string`, `Record`<`string`, `unknown`\>\>\>

#### Defined in

[client.ts:330](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/client.ts#L330)

___

### initializeElement

▸ `Private` **initializeElement**(): `void`

#### Returns

`void`

#### Defined in

[client.ts:360](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/client.ts#L360)

___

### listen

▸ **listen**(`listener`): [`UnsubscribeFunction`](../#unsubscribefunction)

#### Parameters

| Name | Type |
| :------ | :------ |
| `listener` | [`ListenerFunction`](../#listenerfunction) |

#### Returns

[`UnsubscribeFunction`](../#unsubscribefunction)

#### Defined in

[client.ts:289](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/client.ts#L289)

___

### updateOptions

▸ **updateOptions**(`options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`ClientOptions`](../interfaces/ClientOptions) |

#### Returns

`void`

#### Defined in

[client.ts:211](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/client.ts#L211)

___

### updatePreview

▸ **updatePreview**(`sandboxInfo?`, `isInitializationCompile?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sandboxInfo` | [`SandboxInfo`](../interfaces/SandboxInfo) |
| `isInitializationCompile?` | `boolean` |

#### Returns

`void`

#### Defined in

[client.ts:218](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/client.ts#L218)
