<template>
  <div class="box">
    <h2>light</h2>
    <JsonViewer :value="jsonData2" copyable boxed sort />
  </div>
</template>

<script setup>
import { JsonViewer } from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';
import { reactive, ref } from 'vue';

const jsonData = ref(
  JSON.stringify({
    foo: 'bar',
    name: 'qiu', //字符串
    age: 18, //数组
    isMan: false, //布尔值
    date: new Date(),
    fn: () => {},
    arr: [1, 2, 5],
  })
);

let obj = {
  name: 'qiu', //字符串
  age: 18, //数组
  isMan: false, //布尔值
  date: new Date(),
  fn: () => {},
  arr: [1, 2, 5],
};
const jsonData2 = reactive(obj);
</script>

<style>
.box {
  margin-top: 1rem;
}
</style>
