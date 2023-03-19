<template>
  <n-space vertical :size="24">
    <!-- DETAILS -->
    <n-card header-style="padding-bottom: 0.5rem" :segmented="{ content: 'soft' }">
      <template #header>
        <div class="font-size-1rem">Details</div>
      </template>

      <n-grid cols="3">
        <n-gi>
          <n-space vertical>
            <div class="text-semi-bold">Status</div>
            <WorkflowSwitch :id="props.id" :status="workflow.status" fetchOne />
          </n-space>
        </n-gi>

        <n-gi>
          <n-space vertical>
            <div class="text-semi-bold">Created at</div>
            <div>
              {{ moment(workflow.updatedAt).format('MMM Do YYYY, HH:mm:ss') }}
            </div>
          </n-space>
        </n-gi>

        <n-gi>
          <n-space vertical>
            <div class="text-semi-bold">Updated at</div>
            <div>
              {{ moment(workflow.updatedAt).format('MMM Do YYYY, HH:mm:ss') }}
            </div>
          </n-space>
        </n-gi>
      </n-grid>
    </n-card>

    <!-- TRIGGER -->
    <n-card header-style="padding-bottom: 0.5rem" :segmented="{ content: 'soft' }">
      <template #header>
        <div class="title">Trigger</div>
      </template>

      <n-space vertical :size="24">
        <n-grid cols="3">
          <n-gi span="2">
            <n-space vertical>
              <div class="text-semi-bold">Chain</div>
              <div>{{ workflow.chainName }}</div>
            </n-space>
          </n-gi>

          <n-gi>
            <n-space vertical>
              <div class="text-semi-bold">Event</div>
              <div>{{ eventString }}</div>
            </n-space>
          </n-gi>
        </n-grid>

        <!-- Conditions -->
        <n-space vertical>
          <div class="text-semi-bold">Filters</div>

          <n-space vertical v-if="filtersCondition.length">
            <div v-for="(conditionGroup, index) in filtersCondition" :key="index">
              <b v-if="index !== 0" style="margin-right: 4px">OR</b>

              <span v-for="(condition, subIndex) in conditionGroup" :key="subIndex">
                <b v-if="subIndex !== 0" style="margin-left: 4px"> AND </b>
                <i> {{ condition.variable }} </i>
                <span>
                  {{
                    ['greaterThan', 'greaterThanEqual', 'lessThan'].includes(condition.operator)
                      ? ' is '
                      : ' '
                  }}
                </span>
                <span> {{ useParsePascalCaseStr(condition.operator) }}</span>
                <i>
                  {{ condition.value !== null ? ` ${condition.value}` : '' }}
                </i>
              </span>
            </div>
          </n-space>

          <div v-else>No filter condition</div>
        </n-space>
      </n-space>
    </n-card>

    <n-card header-style="padding-bottom: 0.5rem" :segmented="{ content: 'soft' }">
      <template #header>
        <div class="title">Action</div>
      </template>

      <n-space vertical :size="24">
        <n-grid cols="3">
          <n-gi span="2">
            <n-space vertical>
              <div class="text-semi-bold">Channel</div>
              <div class="text-capitalize">
                {{ actionTask.config.channel }}
              </div>
            </n-space>
          </n-gi>
        </n-grid>

        <!-- ACTION -->
        <n-space vertical>
          <div class="text-semi-bold">Config</div>
          <WebhookInput :config="actionTask.config.config" />
        </n-space>
      </n-space>
    </n-card>
  </n-space>
</template>

<script setup>
import WebhookInput from '@/views/Editor/Action/WebhookInput';
import WorkflowSwitch from '@/components/WorkflowSwitch';
import { useParsePascalCaseStr } from '@/composables';
import { computed, onMounted, ref, watch, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import moment from 'moment';
import { isEmpty } from 'lodash';
import API from '@/api';

const store = useStore();
const props = defineProps({ id: [String, Number] });
const workflow = computed(() => store.state.workflow.workflow);
const event = computed(() => store.state.chain.event);
const eventString = ref(null);
const triggerTask = computed(() => workflow.value.tasks.find((task) => task.type === 'trigger'));
const filtersCondition = computed(() => triggerTask.value.config.conditions);

watch(
  event,
  (event) => {
    if (!isEmpty(event)) {
      const { name, pallet } = event;
      eventString.value = `${pallet}.${name}`;
    }
  },
  { immediate: true },
);

const actionTask = computed(() =>
  workflow.value.tasks.find((task) => task.type === 'notification'),
);

onMounted(() => console.log('overview mount'));
onBeforeUnmount(() => console.log('overview unmount'));
</script>

<style lang="scss"></style>
