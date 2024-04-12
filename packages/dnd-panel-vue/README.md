# LogicFlow 自定义可分组拖拽面板

![封面](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202402291450108.png)

近期有小伙伴在使用 **Logic-Flow** 流程图编辑框架的时候, 对于如何实现自定义可分组拖拽面板没有找到思路, 在简单沟通过后, 我觉得可以提供一个简单的示例来帮助大家快速了解;

## 效果展示

![效果展示](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202402291435483.png)

## 涉及内容点

1. Logic-Flow 入门使用;
2. Logic-Flow 内置插件使用;
3. WebComponents 介绍;
4. Logic-Flow 自定义插件;

## 简单的需求分析

## 准备一个基础项目

首先使用 `npm create` 创建一个基于 `vite` 最新版本构建的 `vue + typescript` 项目;

```shell
npm create vite@latest lf-dnd-panel
```

接着删除默认提供的 `HelloWorld.vue` 组件及其引用, 最终的项目目录结构如下;

```
lf-dnd-panel
├─ public
│  └─ vite.svg
├─ src
│  ├─ assets
│  │  └─ vue.svg
│  ├─ App.vue
│  ├─ main.ts
│  ├─ style.css
│  └─ vite-env.d.ts
├─ README.md
├─ index.html
├─ package-lock.json
├─ package.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts
```

尝试启动项目, 确保一切正常;

```shell
npm run dev
```

## 添加 `logic-flow` 基础代码

首先安装 `logic-flow` 核心依赖;

```shell
npm install @logicflow/core --save
```

接着在 `App.vue` 文件中, 添加 `logic-flow` 核心代码;

```vue
<script setup lang="ts">
import { onMounted, ref } from "vue";
import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/style/index.css";

const container = ref();

onMounted(() => {
  const lf = new LogicFlow({
    container: container.value,
    grid: true,
  });
  lf.render();
});
</script>

<template>
  <div class="container" ref="container"></div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
```

同时要将下面的样式覆盖掉 `style.css` 文件内容;

```css
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
```

## 使用内置拖拽面板

安装 `@logicflow/extension` 扩展依赖, 先看一下内置拖拽面板如何使用;

```shell
npm install @logicflow/extension --save
```

再次修改 `App.vue` 文件内容, 导入 DndPanel 对象及扩展所需要的样式模块;

```typescript
import { DndPanel } from "@logicflow/extension";
import "@logicflow/extension/lib/style/index.css";
```

在实例化 `LogicFlow` 对象时, 通过选项 `plugins` 配置 `DndPanel` 对象;

```typescript
const lf = new LogicFlow({
   ...
   plugins: [DndPanel],
});
```

在实例化 `LogicFlow` 对象后, 通过实例对象 `lf.extension.dndPanel` 中的 `setPatternItems` 方法设置拖拽面板的内容;

```typescript
// icons 是一组图标对象(Base64字符串)
import { icons } from "./icons";

lf.extension.dndPanel.setPatternItems([
  {
    label: "选区",
    icon: icons.select,
  },
  {
    type: "circle",
    text: "开始",
    label: "开始节点",
    icon: icons.start,
  },
  {
    type: "rect",
    label: "用户任务",
    icon: icons.task,
  },
  {
    type: "rect",
    label: "系统任务",
    icon: icons.task,
  },
  {
    type: "diamond",
    label: "条件判断",
    icon: icons.condition,
  },
  {
    type: "circle",
    text: "结束",
    label: "结束节点",
    icon: icons.end,
  },
]);
```

重新预览效果, 可以看到内置拖拽面板已经生效;

![dnd-panel](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202402291104775.png)

## 自定义可分组拖拽面板

在自定义可分组拖拽面板时, 我选择在 [dnd-panel 源码](https://github.com/didi/LogicFlow/blob/master/packages/extension/src/components/dnd-panel/index.ts) 的基础上搭配 **Web Component** 组件定制拖拽面板插件.

### Web Component

[Web Component](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components) 浏览器原生支持且可跨前端框架使用的组件开发技术, 哈罗团队利用其开源的 [Quarkc](https://quarkc.hellobike.com/#/) 框架所开发的 [Quarkd](https://vue-quarkd.hellobike.com/#/) 就是典型的 **Web Components** 组件库 (Mobile).

我选择使用 [Quarkc](https://quarkc.hellobike.com/#/) 对 [Quarkd](https://vue-quarkd.hellobike.com/#/) 中 [collapse](https://github.com/hellof2e/quark-design/blob/main/packages/quarkd/src/collapse/index.tsx) 组件的源码提前开发一个适用于 PC 端的折叠组件.

PS: 折叠组件位于项目 (`src/extension/px-collapse.js`) 目录.

### 获取 dnd-panel 源码

1. 在 `src` 目录下创建 `extension/dnd-panel.ts` 文件;
2. 复制 [dnd-panel 源码](https://github.com/didi/LogicFlow/blob/master/packages/extension/src/components/dnd-panel/index.ts) 到 `extension/dnd-panel.ts` ;
3. 修改 `App.vue` 中 `import` 语句, 导入 `extension/dnd-panel.ts` 文件;

### 重写 dnd-panel 插件

安装 `collapse` 组件的唯一依赖 `quarkc`;

```shell
npm i quarkc --save
```

在 `extension/dnd-panel` 导入 `collapse` 组件;

```typescript
// ./extension/dnd-panel.ts
import "./px-collapse";
```

调整 `setPatternItems` 函数的数据结构, 使其支持 `collapse` 组件;

```typescript
type GroupItem = {
  group: string;
  items?: ShapeItem[];
};

setPatternItems(groupList: GroupItem[]) {
  this.groupList = groupList;
  // 支持渲染后重新设置拖拽面板
  if (this.domContainer) {
    this.render(this.lf, this.domContainer);
  }
}
```

使用原生 **DOM** 操作的方式创建 `collapse` 元素;

```typescript
private createCollapse(groupName: string): HTMLElement {
  const collapse = document.createElement("px-collapse");
  collapse.setAttribute("title", groupName);
  return collapse;
}
```

最后调整 `render` 方法, 将每一组的节点都添加到对应的 `collapse` 组件中;

```typescript
render(_lf: LogicFlow, domContainer: HTMLElement) {
  ...
  this.panelEl = document.createElement("div");
  this.panelEl.className = "lf-dndpanel";

  this.groupList.forEach((groupItem) => {
    const collapse = this.createCollapse(groupItem.group);
    const container = document.createElement("div");
    container.className = "collapse-container";
    // 第一步: collapse 组件添加 div 内容容器, 并设置 className, 方便调整样式;
    collapse.appendChild(container);
    groupItem?.items &&
      groupItem.items.forEach((shapeItem) => {
        // 第二步: 循环每组中的 items 数组, 创建 DndItem 元素并添加到 collapse 组件;
        container.appendChild(this.createDndItem(shapeItem));
      });
    // 第三步: 将每一个 collapse 组件添加到面板中;
    this.panelEl.appendChild(collapse);
  });
  domContainer.appendChild(this.panelEl);
  this.domContainer = domContainer;
}
```

![DOM结构图](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202402291430934.png)

当然还要 `setPatternItems` 方法的数据结构变更后还有更新其数据;

```typescript
[
  {
    group: "功能节点",
    items: [
      {
        label: "选区",
        icon: icons.select,
      },
    ],
  },
  {
    group: "起始节点",
    items: [
      {
        type: "circle",
        text: "开始",
        label: "开始节点",
        icon: icons.start,
      },
      {
        type: "circle",
        text: "结束",
        label: "结束节点",
        icon: icons.end,
        group: "GruopB",
      },
    ],
  },
  {
    group: "任务节点",
    items: [
      { type: "rect", label: "用户任务", icon: icons.task },
      { type: "rect", label: "系统任务", icon: icons.task, group: "GruopC" },
    ],
  },
  {
    group: "条件节点",
    items: [{ type: "diamond", label: "条件判断", icon: icons.condition }],
  },
];
```

最终的预览效果如下:

![自定义可分组拖拽面板](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202402291158586.png)

## 总结

在本次的体验中, 我们学习了 LogicFlow 的拖拽面板插件的使用, 也了解了如何自定义拖拽面板的样式和内容, 同时还结合的了 Quarkc 开发的 Web Component 组件, 从而轻松的实现了一个可分组的拖拽面板插件.
