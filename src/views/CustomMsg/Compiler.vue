<template>
  <div>
    <textarea
      id="editor"
      placeholder="Editor"
      class="border border-dark"
      :value="value"
      @input="emits('change')"
    ></textarea>
  </div>
</template>

<script setup>
const props = defineProps({
  value: { type: String, required: true },
});

const emits = defineEmits(['change']);
</script>
