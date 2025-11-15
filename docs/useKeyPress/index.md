# useKeyPress

监听键盘按键的 Hook，支持单键、组合键、别名、自定义过滤器等多种使用场景。

## 基本用法

<preview path="./demo/index.vue" title="基本使用" description="演示单键、组合键、方向键、自定义过滤器等场景"></preview>

## API

```typescript
const pressed = useKeyPress(
  keyFilter: KeyType | KeyFilter,
  onKeyPressed?: (event: KeyboardEvent) => void,
  options?: UseKeyPressOptions
): Ref<boolean>
```

## Params

| 参数         | 说明                     | 类型                             | 默认值 |
| ------------ | ------------------------ | -------------------------------- | ------ |
| keyFilter    | 要监听的按键或过滤器函数 | `KeyType` \| `KeyFilter`         | -      |
| onKeyPressed | 按键触发时的回调函数     | `(event: KeyboardEvent) => void` | -      |
| options      | 可选配置项               | `UseKeyPressOptions`             | -      |

## KeyType

支持以下几种类型：

| 类型       | 说明             | 示例                                   |
| ---------- | ---------------- | -------------------------------------- |
| `string`   | 单个按键         | `'Enter'`、`'a'`、`'Escape'`           |
| `string[]` | 组合键（数组）   | `['ctrl', 's']`、`['shift', 'a']`      |
| `Function` | 自定义过滤器函数 | `(event) => /^[0-9]$/.test(event.key)` |

### 支持的按键别名

| 别名                 | 实际按键     |
| -------------------- | ------------ |
| `esc` / `escape`     | `Escape`     |
| `enter` / `return`   | `Enter`      |
| `space` / `spacebar` | ` ` (空格)   |
| `up`                 | `ArrowUp`    |
| `down`               | `ArrowDown`  |
| `left`               | `ArrowLeft`  |
| `right`              | `ArrowRight` |
| `delete`             | `Delete`     |
| `backspace`          | `Backspace`  |
| `tab`                | `Tab`        |

### 修饰键

支持以下修饰键（可与其他按键组合使用）：

- `ctrl` / `control` - Ctrl 键（Mac 上的 ⌘ Cmd 也会被识别为 Ctrl）
- `shift` - Shift 键
- `alt` - Alt 键
- `meta` - Meta 键（Mac 的 ⌘ Cmd 键）

## Options

| 参数       | 说明                                             | 类型                                                                                           | 默认值      |
| ---------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------- | ----------- |
| events     | 监听的键盘事件类型                               | `'keydown'` \| `'keyup'` \| `KeyEvent[]`                                                       | `'keydown'` |
| target     | 监听事件的目标元素                               | `HTMLElement` \| `Window` \| `Document` \| `(() => HTMLElement \| Window \| Document \| null)` | `window`    |
| exactMatch | 是否精确匹配修饰键（要求所有修饰键状态完全一致） | `boolean`                                                                                      | `false`     |
| useCapture | 是否使用事件捕获模式                             | `boolean`                                                                                      | `false`     |

## Result

| 参数    | 说明                               | 类型           |
| ------- | ---------------------------------- | -------------- |
| pressed | 当前按键是否处于按下状态（响应式） | `Ref<boolean>` |

## 使用示例

### 单键监听

```typescript
// 监听 Enter 键
const enterPressed = useKeyPress('Enter');
console.log(enterPressed.value); // true/false
```

### 组合键监听

```typescript
// 监听 Ctrl + S
useKeyPress(['ctrl', 's'], (event) => {
  event.preventDefault(); // 阻止浏览器默认保存
  console.log('保存快捷键触发');
});

// 监听 Shift + A
useKeyPress(['shift', 'a'], () => {
  console.log('Shift + A 按下');
});
```

### 使用别名

```typescript
// 使用 esc 别名
useKeyPress('esc', () => {
  console.log('Escape 键按下');
});

// 使用方向键别名
useKeyPress('up', () => (position.value.y -= 10));
useKeyPress('down', () => (position.value.y += 10));
```

### 自定义过滤器

```typescript
// 只监听数字键
useKeyPress(
  (event) => /^[0-9]$/.test(event.key),
  (event) => {
    console.log('数字键:', event.key);
  },
);

// 只监听字母键
useKeyPress(
  (event) => /^[a-zA-Z]$/.test(event.key),
  (event) => {
    console.log('字母键:', event.key);
  },
);
```

### 配置选项

```typescript
// 监听 keyup 事件
useKeyPress('a', callback, {
  events: 'keyup',
});

// 指定目标元素（监听特定输入框）
const inputRef = ref<HTMLInputElement>();
useKeyPress(
  'Enter',
  () => {
    console.log('在输入框中按下 Enter');
  },
  {
    target: inputRef,
  },
);

// 指定目标元素（使用函数）
useKeyPress(
  'Escape',
  () => {
    console.log('在 modal 中按下 Esc');
  },
  {
    target: () => document.querySelector('.modal'),
  },
);

// 精确匹配修饰键
useKeyPress(['ctrl', 's'], callback, {
  exactMatch: true, // 必须只按 Ctrl+S，不能有其他修饰键
});
```

## 注意事项

1. **修饰键匹配**
   - 默认情况下（`exactMatch: false`），只要包含指定的修饰键即可触发
   - 设置 `exactMatch: true` 时，修饰键必须完全匹配

2. **Mac 兼容性**
   - Mac 的 `⌘ Cmd` 键会被自动识别为 `ctrl`，保证跨平台一致性

3. **事件冒泡**
   - 默认使用事件冒泡，可通过 `useCapture: true` 改为捕获模式

4. **生命周期**
   - 在 Vue 组件中使用时，会自动在组件卸载时清理事件监听
   - 在组件外使用时需要手动管理
