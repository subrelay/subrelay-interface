<template>
  <n-space :wrap="false" :wrap-item="false" class="w-100">
    <n-grid cols="3" x-gap="20" class="grid_area">
      <n-gi>
        <n-form-item
          label="Property"
          :rule="{ ...requiredRule, key: `filterCond_variable_${index}_${conditionIdx}` }"
          :path="`tasks[${filterIdx}].config.conditions[${props.index}][${props.conditionIdx}].variable`"
        >
          <n-select
            filterable
            clearable
            :consistent-menu-width="false"
            :filter="useDropdownFilter"
            :value-field="'name'"
            :render-label="useRenderDropdownLabel"
            :render-tag="renderSelectTagWithDescription"
            :options="properties"
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
          label="Operator"
          :rule="{ ...requiredRule, key: `filterCond_operator_${index}_${conditionIdx}` }"
          :path="`tasks[${filterIdx}].config.conditions[${props.index}][${conditionIdx}].operator`"
        >
          <n-select
            filterable
            clearable
            :consistent-menu-width="false"
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
          label="Value"
          :path="`tasks[${filterIdx}].config.conditions[${props.index}][${props.conditionIdx}].value`"
          :rule="{
            ...requiredRule,
            type: 'number',
            key: `filterCond_value_${index}_${conditionIdx}`,
          }"
        >
          <n-input
            placeholder="Filter value"
            v-if="inputType === 'string'"
            clearable
            class="w-100"
            :value="props.condition.value"
            @update:value="onValueInput"
          >
          </n-input>

          <n-input-number
            v-else
            placeholder="Filter value"
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

    <n-button @click="emits('remove')" text>
      <Icon icon="bi:trash" />
    </n-button>
  </n-space>
</template>

<script setup>
import EditorData from '@/store/localStore/EditorData';
import { ref, computed, watch, h, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { isEmpty } from 'lodash';
import { useRenderDropdownLabel, useDropdownFilter, renderSelectTagWithDescription } from '@/composables';

const props = defineProps({
  index: Number,
  conditionIdx: Number,
  condition: { type: Object, default: () => {} },
});

const emits = defineEmits(['remove', 'input']);
const store = useStore();
const isLoading = ref(false);

const requiredRule = ref({
  trigger: ['input'],
  required: true,
  validator(rule, value) {
    if (value === null) {
      EditorData.setError('filter', true);
      return new Error('Required!');
    }
    // EditorData.setError('filter', false);
    return true;
  },
});

const inputType = ref(null);
const operatorOptions = ref([]);
const properties = computed(() => store.state.editor.properties);
const filterIdx = computed(() => EditorData.filterIdx);
const operators = computed(() => store.state.editor.operators);
const getOperatorsLoading = computed(() => store.state.editor.loading.getOperators);

function onInput(prop, value) {
  emits('input', { prop, value });
}

function onSelectProp(val, options) {
  onInput('variable', val);

  if (!val) {
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
}

function onValueInput(val) {
  onInput('value', val);
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
  { deep: true },
);
</script>
