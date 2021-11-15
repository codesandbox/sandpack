---
id: "SandpackProvider"
title: "Class: SandpackProvider"
sidebar_label: "SandpackProvider"
sidebar_position: 0
custom_edit_url: null
---

Main context provider that should wraps your entire component.
Use * [`useSandpack`](/api/react/hooks/#usesandpack) hook, which gives you the entire context object to play with.

## Hierarchy

- `PureComponent`<[`SandpackProviderProps`](../interfaces/SandpackProviderProps), [`SandpackProviderState`](../interfaces/SandpackProviderState)\>

  ↳ **`SandpackProvider`**

## Constructors

### constructor

• **new SandpackProvider**(`props`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`SandpackProviderProps`](../interfaces/SandpackProviderProps) |

#### Overrides

React.PureComponent&lt;
  SandpackProviderProps,
  SandpackProviderState
\&gt;.constructor

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:99](https://github.com/codesandbox/sandpack/blob/b675032/sandpack-react/src/contexts/sandpackContext.tsx#L99)

## Properties

### clients

• **clients**: `Record`<`string`, `SandpackClient`\>

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:83](https://github.com/codesandbox/sandpack/blob/b675032/sandpack-react/src/contexts/sandpackContext.tsx#L83)

___

### debounceHook

• `Optional` **debounceHook**: `number`

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:96](https://github.com/codesandbox/sandpack/blob/b675032/sandpack-react/src/contexts/sandpackContext.tsx#L96)

___

### errorScreenRegistered

• **errorScreenRegistered**: `MutableRefObject`<`boolean`\>

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:85](https://github.com/codesandbox/sandpack/blob/b675032/sandpack-react/src/contexts/sandpackContext.tsx#L85)

___

### intersectionObserver

• `Optional` **intersectionObserver**: `IntersectionObserver`

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:89](https://github.com/codesandbox/sandpack/blob/b675032/sandpack-react/src/contexts/sandpackContext.tsx#L89)

___

### lazyAnchorRef

• **lazyAnchorRef**: `RefObject`<`HTMLDivElement`\>

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:80](https://github.com/codesandbox/sandpack/blob/b675032/sandpack-react/src/contexts/sandpackContext.tsx#L80)

___

### loadingScreenRegistered

• **loadingScreenRegistered**: `MutableRefObject`<`boolean`\>

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:87](https://github.com/codesandbox/sandpack/blob/b675032/sandpack-react/src/contexts/sandpackContext.tsx#L87)

___

### openInCSBRegistered

• **openInCSBRegistered**: `MutableRefObject`<`boolean`\>

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:86](https://github.com/codesandbox/sandpack/blob/b675032/sandpack-react/src/contexts/sandpackContext.tsx#L86)

___

### preregisteredIframes

• **preregisteredIframes**: `Record`<`string`, `HTMLIFrameElement`\>

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:82](https://github.com/codesandbox/sandpack/blob/b675032/sandpack-react/src/contexts/sandpackContext.tsx#L82)

___

### queuedListeners

• **queuedListeners**: `Record`<`string`, `Record`<`string`, `ListenerFunction`\>\>

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:90](https://github.com/codesandbox/sandpack/blob/b675032/sandpack-react/src/contexts/sandpackContext.tsx#L90)

___

### timeoutHook

• **timeoutHook**: ``null`` \| `Timer` = `null`

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:97](https://github.com/codesandbox/sandpack/blob/b675032/sandpack-react/src/contexts/sandpackContext.tsx#L97)

___

### unsubscribe

• `Optional` **unsubscribe**: `UnsubscribeFunction`

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:95](https://github.com/codesandbox/sandpack/blob/b675032/sandpack-react/src/contexts/sandpackContext.tsx#L95)

___

### unsubscribeQueuedListeners

• **unsubscribeQueuedListeners**: `Record`<`string`, `Record`<`string`, `UnsubscribeFunction`\>\>

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:91](https://github.com/codesandbox/sandpack/blob/b675032/sandpack-react/src/contexts/sandpackContext.tsx#L91)

___

### defaultProps

▪ `Static` **defaultProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `autorun` | `boolean` |
| `recompileDelay` | `number` |
| `recompileMode` | `string` |
| `skipEval` | `boolean` |

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:73](https://github.com/codesandbox/sandpack/blob/b675032/sandpack-react/src/contexts/sandpackContext.tsx#L73)
