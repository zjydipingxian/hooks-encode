

# Web Vue3 Hooks Code



## 🚀 前言

### 项目简介

本项目旨在提供一套 Vue 自定义的 `useHooks` 常用工具函数， 随着项目的发展意识到这些 `useHooks` 需要有一个示例文档来帮助用户更好地理解和使用， 并通过自动化工具简化文件管理和文档生成过程。

###  核心功能点

1. 输出 Vue 自定义 useHooks：

::: tip :pinching_hand:
 - 提供一系列常用的工具函数，帮助开发者在项目中复用代码，提高开发效率。
 - 这些 useHooks 涵盖了从状态管理到 API 请求等多个方面，满足不同的开发需求。
:::

   

2. 示例文档：

::: tip :pinching_hand:

 - 为每个 useHooks 提供详细的示例文档，包括使用方法、参数说明和实际案例。
 - 示例文档帮助用户快速理解和应用这些工具函数，减少学习成本。

:::


3. 自动化文件管理：

::: tip :pinching_hand:
  - 使用 inquirer/prompts 实现人机交互，用户可以通过 CLI 命令创建文件夹和文件。
  - 构建文件目录并自动映射到输出目录和 VitePress 目录，确保文件结构清晰且易于维护。
  - 通过 watch 监听文件变化，自动更新 VitePress 目录，确保文档与代码同步。
:::


4. 文档构建：
::: tip :pinching_hand:
  - 使用 generate-docs 命令生成文档，自动化文档构建过程，减少手动操作。
  - 确保文档与代码的一致性，避免因手动更新导致的错误。
:::




###  解决的痛点

::: tip :pinching_hand:
1. 文件管理复杂：
在团队开发中，新增文件夹、导入和导出 useHooks 方法繁琐，容易导致代码合并冲突。
自动化文件管理工具简化了这些操作，减少了人为错误，提高了开发效率。
2. 自动化程度低：
手动更新文档和目录不仅耗时，而且容易出错。
通过自动化工具，文档和目录可以实时更新，确保信息的准确性和及时性。
:::


## ⛰️ 能力支持

### 1. 可靠的代码健壮

使用 Typescript 构建，提供完善的类型定义文件

### 2. 完善的文档能力

支持文档记录，支持 demo 演示

### 3. 支持 cli 以及 watch监听文件变化



## ⚒️ 技术选型

### 包管理工具 -- pnpm

作为基础包，选择社区内更推崇的`pnpm`作为包管理工具，主要原因有：

1. `pnpm`安装速度更快，磁盘空间利用率高；
2. `pnpm`的`lock`文件适用于多个单一子功能的模块，且能保证每个模块的依赖不耦合；
3. 打包产物清晰，打包后产物确保全部为静态站点资源；

### 构建工具 -- rollup 

1. rollup 构建工具，可以打包出 esm、cjs、umd 三种格式的包；

## 其他

```bash
$ pnpm install --save zhongjiayao_v3_hooks
# or
$ yarn add zhongjiayao_v3_hooks

```