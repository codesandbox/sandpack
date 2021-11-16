---
id: "SandboxInfo"
title: "Interface: SandboxInfo"
sidebar_label: "SandboxInfo"
sidebar_position: 0
custom_edit_url: null
---

## Properties

### dependencies

• `Optional` **dependencies**: [`Dependencies`](../#dependencies)

#### Defined in

[client.ts:69](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-client/src/client.ts#L69)

___

### devDependencies

• `Optional` **devDependencies**: [`Dependencies`](../#dependencies)

#### Defined in

[client.ts:70](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-client/src/client.ts#L70)

___

### disableDependencyPreprocessing

• `Optional` **disableDependencyPreprocessing**: `boolean`

Only use unpkg for fetching the dependencies, no preprocessing. It's slower, but doesn't talk
to AWS.

#### Defined in

[client.ts:83](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-client/src/client.ts#L83)

___

### entry

• `Optional` **entry**: `string`

#### Defined in

[client.ts:71](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-client/src/client.ts#L71)

___

### files

• **files**: [`SandpackBundlerFiles`](../#sandpackbundlerfiles)

#### Defined in

[client.ts:68](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-client/src/client.ts#L68)

___

### template

• `Optional` **template**: `string`

What template we use, if not defined we infer the template from the dependencies or files.

#### Defined in

[client.ts:77](https://github.com/codesandbox/sandpack/blob/9fab5d6/sandpack-client/src/client.ts#L77)
