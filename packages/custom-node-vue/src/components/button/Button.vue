<template>
  <a-button :type="buttonType">{{ content }}</a-button>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const buttonType = ref("default");

const props = defineProps({
  type: {
    type: String,
    default: "default",
  },
  content: {
    type: String,
    default: "按钮",
  },
});
watch(
  () => props.type,
  (newVal) => {
    console.log(newVal);
    buttonType.value = newVal;
  },
  {
    immediate: true,
  }
);
</script>
