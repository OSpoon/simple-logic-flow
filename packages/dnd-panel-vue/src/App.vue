<script setup lang="ts">
import { onMounted, ref } from "vue";
import LogicFlow from "@logicflow/core";
import { DndPanel } from "./extension/dnd-panel";
import { DndPanelVue } from "./extension/dnd-panel-vue";
import "@logicflow/core/dist/style/index.css";
import "@logicflow/extension/lib/style/index.css";

import { icons } from "./icons";

import VueNode from "./components/VueNode/index";
import AntdVNode from "./components/AntdVNode/index";

const container = ref();

onMounted(() => {
  const lf = new LogicFlow({
    container: container.value,
    grid: true,
    plugins: [DndPanel, DndPanelVue],
  });

  lf.register(VueNode);
  lf.register(AntdVNode);
  lf.extension.dndPanelVue.setPatternItems([
    {
      group: "功能节点",
      items: [
        {
          label: "选区",
          icon: icons.select,
        },
        {
          type: "vue-node",
          label: "Vue节点",
          icon: icons.select,
          properties: {
            innerText: "Vue节点",
          },
        },
        {
          type: "antdv-node",
          label: "AntdV节点",
          icon: icons.select,
          properties: {
            innerText: "AntdV节点",
            type: "primary",
          },
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
  ]);

  lf.render();

  lf.on("vue-node:onClick", (e) => {
    console.log(e);
  });
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
