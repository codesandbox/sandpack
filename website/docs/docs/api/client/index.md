---
id: "index"
title: "Sandpack-client"
slug: "/api/client/"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Classes

- [SandpackClient](classes/SandpackClient)

## Interfaces

- [BaseSandpackMessage](interfaces/BaseSandpackMessage)
- [BundlerState](interfaces/BundlerState)
- [ClientOptions](interfaces/ClientOptions)
- [ErrorStackFrame](interfaces/ErrorStackFrame)
- [Module](interfaces/Module)
- [ModuleSource](interfaces/ModuleSource)
- [SandboxInfo](interfaces/SandboxInfo)
- [SandpackBundlerFile](interfaces/SandpackBundlerFile)
- [SandpackError](interfaces/SandpackError)
- [SandpackErrorMessage](interfaces/SandpackErrorMessage)
- [TranspiledModule](interfaces/TranspiledModule)

## Type aliases

### ClientStatus

Ƭ **ClientStatus**: ``"initializing"`` \| ``"installing-dependencies"`` \| ``"transpiling"`` \| ``"evaluating"`` \| ``"running-tests"`` \| ``"idle"``

#### Defined in

[types.ts:70](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/types.ts#L70)

___

### Dependencies

Ƭ **Dependencies**: `Record`<`string`, `string`\>

#### Defined in

[types.ts:22](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/types.ts#L22)

___

### Dispatch

Ƭ **Dispatch**: (`msg`: [`SandpackMessage`](#sandpackmessage), `clientId?`: `string`) => `void`

#### Type declaration

▸ (`msg`, `clientId?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | [`SandpackMessage`](#sandpackmessage) |
| `clientId?` | `string` |

##### Returns

`void`

#### Defined in

[types.ts:85](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/types.ts#L85)

___

### Listen

Ƭ **Listen**: (`listener`: [`ListenerFunction`](#listenerfunction), `clientId?`: `string`) => [`UnsubscribeFunction`](#unsubscribefunction)

#### Type declaration

▸ (`listener`, `clientId?`): [`UnsubscribeFunction`](#unsubscribefunction)

##### Parameters

| Name | Type |
| :------ | :------ |
| `listener` | [`ListenerFunction`](#listenerfunction) |
| `clientId?` | `string` |

##### Returns

[`UnsubscribeFunction`](#unsubscribefunction)

#### Defined in

[types.ts:81](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/types.ts#L81)

___

### ListenerFunction

Ƭ **ListenerFunction**: (`msg`: [`SandpackMessage`](#sandpackmessage)) => `void`

#### Type declaration

▸ (`msg`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | [`SandpackMessage`](#sandpackmessage) |

##### Returns

`void`

#### Defined in

[types.ts:78](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/types.ts#L78)

___

### Modules

Ƭ **Modules**: `Record`<`string`, `Object`\>

#### Defined in

[types.ts:14](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/types.ts#L14)

___

### SandpackBundlerFiles

Ƭ **SandpackBundlerFiles**: `Record`<`string`, [`SandpackBundlerFile`](interfaces/SandpackBundlerFile)\>

#### Defined in

[types.ts:7](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/types.ts#L7)

___

### SandpackMessage

Ƭ **SandpackMessage**: [`BaseSandpackMessage`](interfaces/BaseSandpackMessage) & { `type`: ``"initialized"``  } \| { `firstLoad?`: `boolean` ; `type`: ``"start"``  } \| { `status`: [`ClientStatus`](#clientstatus) ; `type`: ``"status"``  } \| { `state`: [`BundlerState`](interfaces/BundlerState) ; `type`: ``"state"``  } \| { `type`: ``"success"``  } \| { `action`: ``"show-error"`` ; `type`: ``"action"``  } & [`SandpackErrorMessage`](interfaces/SandpackErrorMessage) \| { `action`: ``"notification"`` ; `notificationType`: ``"error"`` ; `title`: `string` ; `type`: ``"action"``  } \| { `compilatonError`: `boolean` ; `type`: ``"done"``  } \| { `back`: `boolean` ; `forward`: `boolean` ; `type`: ``"urlchange"`` ; `url`: `string`  } \| { `height`: `number` ; `type`: ``"resize"``  } \| { `data`: `Record`<`string`, `Record`<`string`, `unknown`\>\> ; `type`: ``"transpiler-context"``  } \| { `clearConsoleDisabled?`: `boolean` ; `disableDependencyPreprocessing?`: `boolean` ; `externalResources`: `string`[] ; `hasFileResolver`: `boolean` ; `isInitializationCompile?`: `boolean` ; `modules`: [`Modules`](#modules) ; `showErrorScreen`: `boolean` ; `showLoadingScreen`: `boolean` ; `showOpenInCodeSandbox`: `boolean` ; `skipEval`: `boolean` ; `template?`: `string` \| `ITemplate` ; `type`: ``"compile"`` ; `version`: `number`  } \| { `type`: ``"refresh"``  } \| { `type`: ``"urlback"``  } \| { `type`: ``"urlforward"``  } \| { `type`: ``"get-transpiler-context"``  }

#### Defined in

[types.ts:112](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/types.ts#L112)

___

### UnsubscribeFunction

Ƭ **UnsubscribeFunction**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[types.ts:79](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/types.ts#L79)

## Functions

### addPackageJSONIfNeeded

▸ **addPackageJSONIfNeeded**(`files`, `dependencies?`, `devDependencies?`, `entry?`): [`SandpackBundlerFiles`](#sandpackbundlerfiles)

#### Parameters

| Name | Type |
| :------ | :------ |
| `files` | [`SandpackBundlerFiles`](#sandpackbundlerfiles) |
| `dependencies?` | [`Dependencies`](#dependencies) |
| `devDependencies?` | [`Dependencies`](#dependencies) |
| `entry?` | `string` |

#### Returns

[`SandpackBundlerFiles`](#sandpackbundlerfiles)

#### Defined in

[utils.ts:26](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/utils.ts#L26)

___

### createPackageJSON

▸ **createPackageJSON**(`dependencies?`, `devDependencies?`, `entry?`): `string`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `dependencies` | [`Dependencies`](#dependencies) | `{}` |
| `devDependencies` | [`Dependencies`](#dependencies) | `{}` |
| `entry` | `string` | `"/index.js"` |

#### Returns

`string`

#### Defined in

[utils.ts:9](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/utils.ts#L9)

___

### extractErrorDetails

▸ **extractErrorDetails**(`msg`): [`SandpackError`](interfaces/SandpackError)

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | [`SandpackErrorMessage`](interfaces/SandpackErrorMessage) |

#### Returns

[`SandpackError`](interfaces/SandpackError)

#### Defined in

[utils.ts:55](https://github.com/codesandbox/sandpack/blob/443abe8/sandpack-client/src/utils.ts#L55)
