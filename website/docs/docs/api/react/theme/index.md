---
id: "index"
title: "Theme"
slug: "/api/react/theme/"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Variables

### SANDPACK\_THEMES

• **SANDPACK\_THEMES**: `Record`<`SandpackPredefinedTheme`, `SandpackTheme`\>

#### Defined in

[themes/index.ts:212](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/themes/index.ts#L212)

___

### SandpackThemeProvider

• **SandpackThemeProvider**: `React.FC`<`Object`\>

#### Defined in

[contexts/themeContext.tsx:19](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/contexts/themeContext.tsx#L19)

___

### aquaBlueTheme

• **aquaBlueTheme**: `SandpackTheme`

#### Defined in

[themes/index.ts:43](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/themes/index.ts#L43)

___

### codesandboxDarkTheme

• **codesandboxDarkTheme**: `SandpackTheme`

#### Defined in

[themes/index.ts:113](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/themes/index.ts#L113)

___

### codesandboxLightTheme

• **codesandboxLightTheme**: `SandpackTheme`

#### Defined in

[themes/index.ts:10](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/themes/index.ts#L10)

___

### githubLightTheme

• **githubLightTheme**: `SandpackTheme`

#### Defined in

[themes/index.ts:77](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/themes/index.ts#L77)

___

### monokaiProTheme

• **monokaiProTheme**: `SandpackTheme`

#### Defined in

[themes/index.ts:179](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/themes/index.ts#L179)

___

### nightOwlTheme

• **nightOwlTheme**: `SandpackTheme`

#### Defined in

[themes/index.ts:146](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/themes/index.ts#L146)

## Functions

### createThemeObject

▸ `Const` **createThemeObject**(`inputTheme?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputTheme?` | `SandpackThemeProp` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `theme` | `SandpackTheme` |

#### Defined in

[themes/index.ts:221](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/themes/index.ts#L221)

___

### getSyntaxStyle

▸ `Const` **getSyntaxStyle**(`token`): `SandpackSyntaxStyle`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | `string` \| `SandpackSyntaxStyle` |

#### Returns

`SandpackSyntaxStyle`

#### Defined in

[themes/index.ts:316](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/themes/index.ts#L316)

___

### getThemeStyleSheet

▸ `Const` **getThemeStyleSheet**(`theme`, `themeId`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `theme` | `SandpackTheme` |
| `themeId` | `string` |

#### Returns

`string`

#### Defined in

[themes/index.ts:288](https://github.com/codesandbox/sandpack/blob/e7cb439/sandpack-react/src/themes/index.ts#L288)
