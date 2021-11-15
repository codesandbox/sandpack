---
id: "index"
title: "Hooks"
slug: "/api/react/hooks/"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Type aliases

### LoadingOverlayState

Ƭ **LoadingOverlayState**: ``"visible"`` \| ``"fading"`` \| ``"hidden"`` \| ``"timeout"``

#### Defined in

[hooks/useLoadingOverlayState.ts:5](https://github.com/codesandbox/sandpack/blob/b675032/sandpack-react/src/hooks/useLoadingOverlayState.ts#L5)

## Functions

### useActiveCode

▸ `Const` **useActiveCode**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `code` | `string` |
| `updateCode` | (`newCode`: `string`) => `void` |

#### Defined in

[hooks/useActiveCode.ts:3](https://github.com/codesandbox/sandpack/blob/b675032/sandpack-react/src/hooks/useActiveCode.ts#L3)

___

### useCodeSandboxLink

▸ `Const` **useCodeSandboxLink**(): `string`

#### Returns

`string`

#### Defined in

[hooks/useCodeSandboxLink.ts:31](https://github.com/codesandbox/sandpack/blob/b675032/sandpack-react/src/hooks/useCodeSandboxLink.ts#L31)

___

### useErrorMessage

▸ `Const` **useErrorMessage**(): ``null`` \| `string`

#### Returns

``null`` \| `string`

#### Defined in

[hooks/useErrorMessage.ts:5](https://github.com/codesandbox/sandpack/blob/b675032/sandpack-react/src/hooks/useErrorMessage.ts#L5)

___

### useLoadingOverlayState

▸ `Const` **useLoadingOverlayState**(`clientId?`): [`LoadingOverlayState`](#loadingoverlaystate)

#### Parameters

| Name | Type |
| :------ | :------ |
| `clientId?` | `string` |

#### Returns

[`LoadingOverlayState`](#loadingoverlaystate)

#### Defined in

[hooks/useLoadingOverlayState.ts:10](https://github.com/codesandbox/sandpack/blob/b675032/sandpack-react/src/hooks/useLoadingOverlayState.ts#L10)

___

### useSandpack

▸ **useSandpack**(): `UseSandpackReturnType`

#### Returns

`UseSandpackReturnType`

#### Defined in

[hooks/useSandpack.ts:16](https://github.com/codesandbox/sandpack/blob/b675032/sandpack-react/src/hooks/useSandpack.ts#L16)

___

### useSandpackNavigation

▸ `Const` **useSandpackNavigation**(`clientId?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `clientId?` | `string` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `back` | () => `void` |
| `forward` | () => `void` |
| `refresh` | () => `void` |

#### Defined in

[hooks/useSandpackNavigation.ts:3](https://github.com/codesandbox/sandpack/blob/b675032/sandpack-react/src/hooks/useSandpackNavigation.ts#L3)

___

### useSandpackTheme

▸ `Const` **useSandpackTheme**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `theme` | `SandpackTheme` |
| `themeId` | `string` |

#### Defined in

[hooks/useSandpackTheme.ts:6](https://github.com/codesandbox/sandpack/blob/b675032/sandpack-react/src/hooks/useSandpackTheme.ts#L6)

___

### useTranspiledCode

▸ `Const` **useTranspiledCode**(): ``null`` \| `string`

#### Returns

``null`` \| `string`

#### Defined in

[hooks/useTranspiledCode.ts:15](https://github.com/codesandbox/sandpack/blob/b675032/sandpack-react/src/hooks/useTranspiledCode.ts#L15)
