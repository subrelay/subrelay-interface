<template>
  <n-space :wrap="false" :wrap-item="false" class="w-100">
    <n-grid cols="3" x-gap="20" class="grid_area">
      <n-gi>
        <n-form-item
          :rule="requiredRule"
          :path="`conditions[${props.index}][${props.conditionIdx}].variable`"
        >
          <n-select
            filterable
            clearable
            placeholder="Select Property"
            :filter="useDropdownFilter"
            :value-field="'name'"
            :render-label="useRenderDropdownLabel"
            :render-tag="renderSelectTagWithDescription"
            :options="propertyOptions"
            :value="props.condition.variable"
            @update:value="onSelectProp"
          />
        </n-form-item>
      </n-gi>

      <n-gi>
        <n-form-item
          :rule="requiredRule"
          :path="`conditions[${props.index}][${props.conditionIdx}].operator`"
        >
          <n-select
            filterable
            clearable
            placeholder="Select Operator"
            :render-label="renderLabel"
            :loading="isLoading"
            :filter="useDropdownFilter"
            :options="operatorOptions"
            :value="props.condition.operator"
            @update:value="onInput($event, 'operator')"
          />
        </n-form-item>
      </n-gi>

      <n-gi>
        <n-form-item
          :rule="numberRule"
          :path="`conditions[${props.index}][${props.conditionIdx}].value`"
        >
          <n-input
            v-if="inputType === 'string'"
            clearable
            class="w-100"
            :value="props.condition.value"
            @update:value="onInput($event, 'value')"
          >
          </n-input>

          <n-input-number
            v-else
            class="w-100"
            :show-button="false"
            @update:value="onInput($event, 'value')"
            :value="props.condition.value"
            clearable
          >
          </n-input-number>
        </n-form-item>
      </n-gi>
    </n-grid>

    <n-button @click="emits('remove')" text style="padding-bottom: 24px">
      <Icon icon="bi:trash" />
    </n-button>
  </n-space>
</template>

<script setup>
import { ref, computed, inject, h, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { isEmpty } from 'lodash';
import {
  useRenderDropdownLabel,
  useDropdownFilter,
  renderSelectTagWithDescription,
} from '@/composables';

const store = useStore();

const props = defineProps({
  index: Number,
  conditionIdx: Number,
  condition: { type: Object, default: () => {} },
});

const emits = defineEmits(['remove', 'input']);

const propertyOptions = computed(() => store.state.chain.event.fields);
const isLoading = ref(false);
const eventBus = inject('eventBus');

const requiredRule = ref({
  trigger: ['input'],
  validator(rule, value) {
    if (!value) {
      return new Error('Required!');
    }
    eventBus.emit('toggleTestFilter', { isDisabled: true });
  },
});

const numberRule = ref({ type: 'number', ...requiredRule.value });
const operators = computed(() => store.state.task.operators);
const inputType = ref(null);
const operatorOptions = ref([]);

function onSelectProp(val, options) {
  onInput(null, 'operator');
  onInput(null, 'value');
  onInput(val, 'variable');

  isLoading.value = true;

  inputType.value = options?.type;
  operatorOptions.value = operators.value[inputType.value];

  setTimeout(() => {
    isLoading.value = false;
  }, 200);
}

function onInput(value, prop) {
  emits('input', { value, prop });
}

function renderLabel(option) {
  return [h('div', { class: 'text-capitalize' }, option.name)];
}

onBeforeMount(() => {
  if (!isEmpty(props.condition)) {
    inputType.value = typeof props.condition.value;
    operatorOptions.value = operators.value[inputType.value];
  }
});
</script>
