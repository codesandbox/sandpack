---
id: "SandpackProvider"
title: "Class: SandpackProvider"
sidebar_label: "SandpackProvider"
sidebar_position: 0
custom_edit_url: null
---

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

[sandpack-react/src/contexts/sandpackContext.tsx:93](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L93)

## Properties

### clients

• **clients**: `Record`<`string`, `SandpackClient`\>

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:77](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L77)

___

### context

• **context**: `any`

If using the new style context, re-declare this in your class to be the
`React.ContextType` of your `static contextType`.
Should be used with type annotation or static contextType.

```ts
static contextType = MyContext
// For TS pre-3.7:
context!: React.ContextType<typeof MyContext>
// For TS 3.7 and above:
declare context: React.ContextType<typeof MyContext>
```

**`see`** https://reactjs.org/docs/context.html

#### Inherited from

React.PureComponent.context

#### Defined in

node_modules/@types/react/index.d.ts:479

___

### debounceHook

• `Optional` **debounceHook**: `number`

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:90](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L90)

___

### errorScreenRegistered

• **errorScreenRegistered**: `MutableRefObject`<`boolean`\>

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:79](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L79)

___

### intersectionObserver

• `Optional` **intersectionObserver**: `IntersectionObserver`

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:83](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L83)

___

### lazyAnchorRef

• **lazyAnchorRef**: `RefObject`<`HTMLDivElement`\>

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:74](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L74)

___

### loadingScreenRegistered

• **loadingScreenRegistered**: `MutableRefObject`<`boolean`\>

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:81](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L81)

___

### openInCSBRegistered

• **openInCSBRegistered**: `MutableRefObject`<`boolean`\>

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:80](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L80)

___

### preregisteredIframes

• **preregisteredIframes**: `Record`<`string`, `HTMLIFrameElement`\>

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:76](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L76)

___

### props

• `Readonly` **props**: `Readonly`<[`SandpackProviderProps`](../interfaces/SandpackProviderProps)\> & `Readonly`<`Object`\>

#### Inherited from

React.PureComponent.props

#### Defined in

node_modules/@types/react/index.d.ts:504

___

### queuedListeners

• **queuedListeners**: `Record`<`string`, `Record`<`string`, `ListenerFunction`\>\>

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:84](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L84)

___

### refs

• **refs**: `Object`

**`deprecated`**
https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs

#### Index signature

▪ [key: `string`]: `ReactInstance`

#### Inherited from

React.PureComponent.refs

#### Defined in

node_modules/@types/react/index.d.ts:510

___

### state

• **state**: `Readonly`<[`SandpackProviderState`](../interfaces/SandpackProviderState)\>

#### Inherited from

React.PureComponent.state

#### Defined in

node_modules/@types/react/index.d.ts:505

___

### timeoutHook

• **timeoutHook**: ``null`` \| `Timer` = `null`

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:91](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L91)

___

### unsubscribe

• `Optional` **unsubscribe**: `UnsubscribeFunction`

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:89](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L89)

___

### unsubscribeQueuedListeners

• **unsubscribeQueuedListeners**: `Record`<`string`, `Record`<`string`, `UnsubscribeFunction`\>\>

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:85](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L85)

___

### contextType

▪ `Static` `Optional` **contextType**: `Context`<`any`\>

If set, `this.context` will be set at runtime to the current value of the given Context.

Usage:

```ts
type MyContext = number
const Ctx = React.createContext<MyContext>(0)

class Foo extends React.Component {
  static contextType = Ctx
  context!: React.ContextType<typeof Ctx>
  render () {
    return <>My context's value: {this.context}</>;
  }
}
```

**`see`** https://reactjs.org/docs/context.html#classcontexttype

#### Inherited from

React.PureComponent.contextType

#### Defined in

node_modules/@types/react/index.d.ts:461

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

[sandpack-react/src/contexts/sandpackContext.tsx:67](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L67)

## Methods

### UNSAFE\_componentWillMount

▸ `Optional` **UNSAFE_componentWillMount**(): `void`

Called immediately before mounting occurs, and before `Component#render`.
Avoid introducing any side-effects or subscriptions in this method.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use componentDidMount or the constructor instead

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Returns

`void`

#### Inherited from

React.PureComponent.UNSAFE\_componentWillMount

#### Defined in

node_modules/@types/react/index.d.ts:717

___

### UNSAFE\_componentWillReceiveProps

▸ `Optional` **UNSAFE_componentWillReceiveProps**(`nextProps`, `nextContext`): `void`

Called when the component may be receiving new props.
React may call this even if props have not changed, so be sure to compare new and existing
props if you only want to handle changes.

Calling `Component#setState` generally does not trigger this method.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use static getDerivedStateFromProps instead

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Parameters

| Name | Type |
| :------ | :------ |
| `nextProps` | `Readonly`<[`SandpackProviderProps`](../interfaces/SandpackProviderProps)\> |
| `nextContext` | `any` |

#### Returns

`void`

#### Inherited from

React.PureComponent.UNSAFE\_componentWillReceiveProps

#### Defined in

node_modules/@types/react/index.d.ts:749

___

### UNSAFE\_componentWillUpdate

▸ `Optional` **UNSAFE_componentWillUpdate**(`nextProps`, `nextState`, `nextContext`): `void`

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use getSnapshotBeforeUpdate instead

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Parameters

| Name | Type |
| :------ | :------ |
| `nextProps` | `Readonly`<[`SandpackProviderProps`](../interfaces/SandpackProviderProps)\> |
| `nextState` | `Readonly`<[`SandpackProviderState`](../interfaces/SandpackProviderState)\> |
| `nextContext` | `any` |

#### Returns

`void`

#### Inherited from

React.PureComponent.UNSAFE\_componentWillUpdate

#### Defined in

node_modules/@types/react/index.d.ts:777

___

### \_getSandpackState

▸ **_getSandpackState**(): `SandpackContext`

#### Returns

`SandpackContext`

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:538](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L538)

___

### addListener

▸ **addListener**(`listener`, `clientId?`): `UnsubscribeFunction`

#### Parameters

| Name | Type |
| :------ | :------ |
| `listener` | `ListenerFunction` |
| `clientId?` | `string` |

#### Returns

`UnsubscribeFunction`

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:454](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L454)

___

### closeFile

▸ **closeFile**(`path`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`void`

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:394](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L394)

___

### componentDidCatch

▸ `Optional` **componentDidCatch**(`error`, `errorInfo`): `void`

Catches exceptions generated in descendant components. Unhandled exceptions will cause
the entire component tree to unmount.

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `Error` |
| `errorInfo` | `ErrorInfo` |

#### Returns

`void`

#### Inherited from

React.PureComponent.componentDidCatch

#### Defined in

node_modules/@types/react/index.d.ts:646

___

### componentDidMount

▸ **componentDidMount**(): `void`

#### Returns

`void`

#### Overrides

React.PureComponent.componentDidMount

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:205](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L205)

___

### componentDidUpdate

▸ **componentDidUpdate**(`prevProps`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `prevProps` | [`SandpackProviderProps`](../interfaces/SandpackProviderProps) |

#### Returns

`void`

#### Overrides

React.PureComponent.componentDidUpdate

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:235](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L235)

___

### componentWillMount

▸ `Optional` **componentWillMount**(): `void`

Called immediately before mounting occurs, and before `Component#render`.
Avoid introducing any side-effects or subscriptions in this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use componentDidMount or the constructor instead; will stop working in React 17

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Returns

`void`

#### Inherited from

React.PureComponent.componentWillMount

#### Defined in

node_modules/@types/react/index.d.ts:703

___

### componentWillReceiveProps

▸ `Optional` **componentWillReceiveProps**(`nextProps`, `nextContext`): `void`

Called when the component may be receiving new props.
React may call this even if props have not changed, so be sure to compare new and existing
props if you only want to handle changes.

Calling `Component#setState` generally does not trigger this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use static getDerivedStateFromProps instead; will stop working in React 17

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Parameters

| Name | Type |
| :------ | :------ |
| `nextProps` | `Readonly`<[`SandpackProviderProps`](../interfaces/SandpackProviderProps)\> |
| `nextContext` | `any` |

#### Returns

`void`

#### Inherited from

React.PureComponent.componentWillReceiveProps

#### Defined in

node_modules/@types/react/index.d.ts:732

___

### componentWillUnmount

▸ **componentWillUnmount**(): `void`

#### Returns

`void`

#### Overrides

React.PureComponent.componentWillUnmount

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:267](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L267)

___

### componentWillUpdate

▸ `Optional` **componentWillUpdate**(`nextProps`, `nextState`, `nextContext`): `void`

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use getSnapshotBeforeUpdate instead; will stop working in React 17

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Parameters

| Name | Type |
| :------ | :------ |
| `nextProps` | `Readonly`<[`SandpackProviderProps`](../interfaces/SandpackProviderProps)\> |
| `nextState` | `Readonly`<[`SandpackProviderState`](../interfaces/SandpackProviderState)\> |
| `nextContext` | `any` |

#### Returns

`void`

#### Inherited from

React.PureComponent.componentWillUpdate

#### Defined in

node_modules/@types/react/index.d.ts:762

___

### createClient

▸ **createClient**(`iframe`, `clientId`): `SandpackClient`

#### Parameters

| Name | Type |
| :------ | :------ |
| `iframe` | `HTMLIFrameElement` |
| `clientId` | `string` |

#### Returns

`SandpackClient`

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:285](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L285)

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

[sandpack-react/src/contexts/sandpackContext.tsx:416](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L416)

___

### dispatchMessage

▸ **dispatchMessage**(`message`, `clientId?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `SandpackMessage` |
| `clientId?` | `string` |

#### Returns

`void`

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:439](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L439)

___

### forceUpdate

▸ **forceUpdate**(`callback?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback?` | () => `void` |

#### Returns

`void`

#### Inherited from

React.PureComponent.forceUpdate

#### Defined in

node_modules/@types/react/index.d.ts:496

___

### getSnapshotBeforeUpdate

▸ `Optional` **getSnapshotBeforeUpdate**(`prevProps`, `prevState`): `any`

Runs before React applies the result of `render` to the document, and
returns an object to be given to componentDidUpdate. Useful for saving
things such as scroll position before `render` causes changes to it.

Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated
lifecycle events from running.

#### Parameters

| Name | Type |
| :------ | :------ |
| `prevProps` | `Readonly`<[`SandpackProviderProps`](../interfaces/SandpackProviderProps)\> |
| `prevState` | `Readonly`<[`SandpackProviderState`](../interfaces/SandpackProviderState)\> |

#### Returns

`any`

#### Inherited from

React.PureComponent.getSnapshotBeforeUpdate

#### Defined in

node_modules/@types/react/index.d.ts:682

___

### handleMessage

▸ **handleMessage**(`msg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `SandpackMessage` |

#### Returns

`void`

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:138](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L138)

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

[sandpack-react/src/contexts/sandpackContext.tsx:380](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L380)

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

[sandpack-react/src/contexts/sandpackContext.tsx:358](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L358)

___

### render

▸ **render**(): `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\>

#### Returns

`ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\>

#### Overrides

React.PureComponent.render

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:581](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L581)

___

### resetAllFiles

▸ **resetAllFiles**(): `void`

#### Returns

`void`

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:532](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L532)

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

[sandpack-react/src/contexts/sandpackContext.tsx:521](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L521)

___

### runSandpack

▸ **runSandpack**(): `void`

#### Returns

`void`

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:349](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L349)

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

[sandpack-react/src/contexts/sandpackContext.tsx:376](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L376)

___

### setState

▸ **setState**<`K`\>(`state`, `callback?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`SandpackProviderState`](../interfaces/SandpackProviderState) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | ``null`` \| [`SandpackProviderState`](../interfaces/SandpackProviderState) \| (`prevState`: `Readonly`<[`SandpackProviderState`](../interfaces/SandpackProviderState)\>, `props`: `Readonly`<[`SandpackProviderProps`](../interfaces/SandpackProviderProps)\>) => ``null`` \| [`SandpackProviderState`](../interfaces/SandpackProviderState) \| `Pick`<[`SandpackProviderState`](../interfaces/SandpackProviderState), `K`\> \| `Pick`<[`SandpackProviderState`](../interfaces/SandpackProviderState), `K`\> |
| `callback?` | () => `void` |

#### Returns

`void`

#### Inherited from

React.PureComponent.setState

#### Defined in

node_modules/@types/react/index.d.ts:491

___

### shouldComponentUpdate

▸ `Optional` **shouldComponentUpdate**(`nextProps`, `nextState`, `nextContext`): `boolean`

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true.
`PureComponent` implements a shallow comparison on props and state and returns true if any
props or states have changed.

If false is returned, `Component#render`, `componentWillUpdate`
and `componentDidUpdate` will not be called.

#### Parameters

| Name | Type |
| :------ | :------ |
| `nextProps` | `Readonly`<[`SandpackProviderProps`](../interfaces/SandpackProviderProps)\> |
| `nextState` | `Readonly`<[`SandpackProviderState`](../interfaces/SandpackProviderState)\> |
| `nextContext` | `any` |

#### Returns

`boolean`

#### Inherited from

React.PureComponent.shouldComponentUpdate

#### Defined in

node_modules/@types/react/index.d.ts:636

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

[sandpack-react/src/contexts/sandpackContext.tsx:366](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L366)

___

### updateClients

▸ **updateClients**(): `void`

#### Returns

`void`

#### Defined in

[sandpack-react/src/contexts/sandpackContext.tsx:178](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L178)

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

[sandpack-react/src/contexts/sandpackContext.tsx:160](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L160)

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

[sandpack-react/src/contexts/sandpackContext.tsx:164](https://github.com/codesandbox/sandpack/blob/097389f/sandpack-react/src/contexts/sandpackContext.tsx#L164)
