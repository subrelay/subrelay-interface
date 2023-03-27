<template>
  <div class="toolbar border border-dark">
    <div>
      <Icon icon="line-md:edit" class="edit-icon" />
      {{ text }}
    </div>

    <Icon icon="line-md:edit" class="edit-icon" :class="icon" @click="emits('click')" />
  </div>
</template>

<script setup>
const props = defineProps({
  text: { type: String, required: true },
  icon: { type: String, required: true },
});

const emits = defineEmits(['click']);
</script>
