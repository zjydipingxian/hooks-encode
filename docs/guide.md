# Web Vue3 Hooks Code



## ⛰️ 能力支持

### 1. 可靠的代码健壮

使用 Typescript 构建，提供完善的类型定义文件

### 2. 完善的文档能力

支持文档记录，支持 demo 演示

### 2. 支持 cli 以及 watch监听文件变化


- 采用 pnpm cli 命令 构建文件目录
- 采用 watch 监听文件变化
- generate-docs 文档构建

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