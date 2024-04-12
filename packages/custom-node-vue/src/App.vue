<script setup lang="ts">
import { onMounted, ref } from "vue";
import LogicFlow from "@logicflow/core";
import { DndPanel } from "@logicflow/extension";
import "@logicflow/core/dist/style/index.css";
import "@logicflow/extension/lib/style/index.css";
import VueButtonNode from "./components/button/index";

const buttonTypes = ["primary", "ghost", "dashed", "link", "text", "default"];
const open = ref<boolean>(false);
const container = ref();
const buttonType = ref();
const nodeId = ref();
const lf = ref();

const showModal = (data: { id: string }) => {
  nodeId.value = data.id;
  buttonType.value = buttonTypes[Math.floor(Math.random() * 6)];
  open.value = true;
};

const handleOk = (_e: MouseEvent) => {
  open.value = false;
  lf.value.setProperties(nodeId.value, {
    type: buttonType.value,
  });
};

onMounted(() => {
  lf.value = new LogicFlow({
    container: container.value,
    grid: true,
    plugins: [DndPanel],
  });
  lf.value.register(VueButtonNode);
  lf.value.extension.dndPanel.setPatternItems([
    {
      type: "vue-button-node",
      label: "按钮",
      properties: {
        type: "primary",
        content: "我是一个按钮",
      },
    },
  ]);
  lf.value.render();
  lf.value.on("node:click", (event: any) => {
    showModal(event.data);
  });
});
</script>

<template>
  <div class="container" ref="container"></div>
  <a-modal v-model:open="open" title="修改按钮类型" @ok="handleOk">
    确认修改按钮类型为: {{ buttonType }}
  </a-modal>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
