<template>
  <!-- EDIT NODE -->
  <n-space v-if="isEditing" align="center" class="w-100" @click="editNodeClick" :wrap-item="false">
    <n-input
      clearable
      ref="inputRef"
      size="small"
      :loading="loading"
      :disabled="loading"
      :value="inputValue"
      :placeholder="placeholder"
      @update:value="onInput"
      @keyup.enter="onSubmit"
    >
    </n-input>

    <n-space v-if="showActionIcons">
      <n-button text class="icon" @click="onSubmit" :disabled="loading">
        <Icon icon="ic:round-check" :inline="true" />
      </n-button>

      <n-button text class="icon" :disabled="loading" @click="onCancel">
        <Icon icon="iconoir:cancel" class="icon" :inline="true" />
      </n-button>
    </n-space>
  </n-space>

  <!-- SHOW NODE -->
  <n-ellipsis v-else :tooltip="{ style: { maxWidth: '400px' }, placement: 'bottom' }">
    {{ props.value ? props.value : '' }}
  </n-ellipsis>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue';

const props = defineProps({
  showActionIcons: { type: Boolean, default: false },
  isEditing: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  value: [String, Number],
  submit: { type: [Function, Object], default: () => {} },
  placeholder: { type: String, default: '' },
});

const emits = defineEmits(['input', 'cancelEdit']);
const inputRef = ref(null);
const inputValue = ref(props.value);

watch(
  () => props.isEditing,
  (isEditing) => {
    inputValue.value = props.value;
    if (isEditing) {
      nextTick(() => inputRef.value.focus());
    }
  },
);

function editNodeClick(e) {
  e.stopPropagation();
}

async function onSubmit() {
  await props.submit(inputValue.value);
}

function onCancel() {
  emits('cancelEdit');
  inputValue.value = props.value;
}

function onInput(v) {
  inputValue.value = v;
  emits('input', v);
}
</script>

<style lang="scss">
tbody {
  .n-ellipsis {
    width: 100%;
  }
}
</style>
