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
          >
            <template #empty>
              <n-empty description="Please select a chain and event first" />
            </template>
          </n-select>
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
            :loading="isLoading || getOperatorsLoading"
            :disabled="isLoading || getOperatorsLoading"
            :filter="useDropdownFilter"
            :options="operatorOptions"
            :value="props.condition.operator"
            @update:value="onSelectOperator"
          >
            <template #empty>
              <n-empty description="Please select a property first" />
            </template>
          </n-select>
        </n-form-item>
      </n-gi>

      <n-gi v-if="inputType !== 'boolean'">
        <n-form-item
          :rule="numberRule"
          :path="`conditions[${props.index}][${props.conditionIdx}].value`"
        >
          <n-input
            v-if="inputType === 'string'"
            clearable
            class="w-100"
            :value="props.condition.value"
            @update:value="onValueInput"
          >
          </n-input>

          <n-input-number
            v-else
            class="w-100"
            clearable
            :show-button="false"
            :value="props.condition.value"
            @update:value="onValueInput"
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
import EditorData from '@/store/localStore/EditorData';
import { ref, computed, watch, inject, h, onBeforeMount } from 'vue';
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
const validateForm = inject('validateForm');

const requiredRule = ref({
  trigger: ['input'],
  validator(rule, value) {
    if (value === null) {
      EditorData.setError('trigger', true);
      return new Error('Required!');
    }
    EditorData.setError('trigger', false);
    eventBus.emit('toggleTestFilter', { isDisabled: true });
  },
});

const numberRule = ref({ type: 'number', ...requiredRule.value });
const operators = computed(() => store.state.task.operators);
const getOperatorsLoading = computed(() => store.state.task.loading);
const inputType = ref(null);
const operatorOptions = ref([]);

function onSelectProp(val, options) {
  onInput('variable', val);

  if (!val) {
    validateForm({ changeStep: false });
    onInput('operator', null);
    onInput('value', null);
  }

  isLoading.value = true;
  inputType.value = options?.type;
  operatorOptions.value = operators.value[inputType.value];

  setTimeout(() => {
    isLoading.value = false;
  }, 200);
}

function onSelectOperator(val) {
  onInput('operator', val);
  // EditorData.setError('trigger', !!val);
  // validateForm({ changeStep: false });
}

function onValueInput(val) {
  onInput('value', val);
  // validateForm({ changeStep: false });
}

function onInput(prop, value) {
  emits('input', { prop, value });
}

function renderLabel(option) {
  return [h('div', { class: 'text-capitalize' }, option.name)];
}

onBeforeMount(() => {
  if (!(isEmpty(props.condition) && isEmpty(operators.value))) {
    if (['isTrue', 'isFalse'].includes(props.condition.operator)) {
      inputType.value = 'boolean';
    } else {
      inputType.value = typeof props.condition.value;
    }

    operatorOptions.value = operators.value[inputType.value];
  }
});

watch(
  operators,
  () => {
    if (!isEmpty(operators.value)) {
      operatorOptions.value = operators.value[inputType.value];
    }
  },
  { immediate: true },
  { deep: true }
);
</script>
