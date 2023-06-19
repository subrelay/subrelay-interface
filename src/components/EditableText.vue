<template>
  <div class="pointer-cursor show-or-edit" @click="handleOnClick">
    <EditNode v-if="isEdit" />

    <div v-else class="show-area">
      <ShowNode />
      <Icon icon="line-md:edit" class="edit-icon" />
    </div>
  </div>
</template>

<script setup>
import { h, ref, defineComponent, nextTick } from 'vue';
import { NInput, NEllipsis, NText } from 'naive-ui';

const props = defineProps({
  loading: Boolean,
  value: [String],
  onUpdateValue: [Function, Array],
});

const isEdit = ref(false);
const inputRef = ref(null);
const inputValue = ref(props.value);

function handleOnClick() {
  if (props.loading) return;
  isEdit.value = true;
  nextTick(() => {
    inputRef.value.focus();
  });
}

function handleChange() {
  props.onUpdateValue(inputValue.value);
  isEdit.value = false;
}

const ShowNode = defineComponent({
  setup() {
    return () =>
      h(
        NEllipsis,
        { style: 'max-width: 250px' },
        {
          tooltip: () => h('div', { style: 'max-width: 250px' }, props.value),
          default: () =>
            h(NText, { class: 'workflow-name' }, { default: () => (props.value ? props.value : 'Unnamed workflow') }),
        },
      );
  },
});

const EditNode = defineComponent({
  setup() {
    return () =>
      h(NInput, {
        style: 'width: 250px',
        ref: inputRef,
        value: inputValue.value,
        size: 'small',
        placeholder: 'Enter name',
        onBlur: handleChange,
        clearable: true,
        disabled: false,
        status: inputValue.value ? 'success' : 'error',
        onUpdateValue: (v) => {
          inputValue.value = v;
        },
        onKeyup: ({ key }) => {
          if (key === 'Enter') handleChange();
        },
      });
  },
});
</script>

<style lang="scss">
.show-or-edit {
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;

  .n-input {
    width: 90%;
  }

  .show-area {
    display: flex;
    align-items: baseline;

    .workflow-name {
      font-size: 1.5rem;
      font-weight: 700;
    }

    .edit-icon {
      margin-left: 0.5rem;
      font-size: 1rem;
    }
  }
}
</style>
