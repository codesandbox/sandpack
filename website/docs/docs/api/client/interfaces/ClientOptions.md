---
id: "ClientOptions"
title: "Interface: ClientOptions"
sidebar_label: "ClientOptions"
sidebar_position: 0
custom_edit_url: null
---

## Properties

### bundlerURL

• `Optional` **bundlerURL**: `string`

Location of the bundler.

#### Defined in

[client.ts:27](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-client/src/client.ts#L27)

___

### clearConsoleOnFirstCompile

• `Optional` **clearConsoleOnFirstCompile**: `boolean`

The bundler will clear the console if you set this to true, everytime the iframe refreshes / starts the first compile

#### Defined in

[client.ts:55](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-client/src/client.ts#L55)

___

### fileResolver

• `Optional` **fileResolver**: `Object`

You can pass a custom file resolver that is responsible for resolving files.
We will use this to get all files from the file system.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `isFile` | (`path`: `string`) => `Promise`<`boolean`\> |
| `readFile` | (`path`: `string`) => `Promise`<`string`\> |

#### Defined in

[client.ts:61](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-client/src/client.ts#L61)

___

### height

• `Optional` **height**: `string`

Height of iframe.

#### Defined in

[client.ts:39](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-client/src/client.ts#L39)

___

### showErrorScreen

• `Optional` **showErrorScreen**: `boolean`

#### Defined in

[client.ts:49](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-client/src/client.ts#L49)

___

### showLoadingScreen

• `Optional` **showLoadingScreen**: `boolean`

#### Defined in

[client.ts:50](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-client/src/client.ts#L50)

___

### showOpenInCodeSandbox

• `Optional` **showOpenInCodeSandbox**: `boolean`

Boolean flags to trigger certain UI elements in the bundler

#### Defined in

[client.ts:48](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-client/src/client.ts#L48)

___

### skipEval

• `Optional` **skipEval**: `boolean`

If we should skip the third step: evaluation.

#### Defined in

[client.ts:43](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-client/src/client.ts#L43)

___

### startRoute

• `Optional` **startRoute**: `string`

Relative path that the iframe loads (eg: /about)

#### Defined in

[client.ts:31](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-client/src/client.ts#L31)

___

### width

• `Optional` **width**: `string`

Width of iframe.

#### Defined in

[client.ts:35](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-client/src/client.ts#L35)
