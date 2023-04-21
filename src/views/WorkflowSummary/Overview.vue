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
              {{ moment(workflow.updatedAt).local().format('MMM Do YYYY, HH:mm:ss') }}
            </div>
          </n-space>
        </n-gi>

        <n-gi>
          <n-space vertical>
            <div class="text-semi-bold">Updated at</div>
            <div>
              {{ moment(workflow.updatedAt).local().format('MMM Do YYYY, HH:mm:ss') }}
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
          <!-- Chain -->
          <n-gi span="1">
            <n-space vertical>
              <div class="text-semi-bold">Chain</div>
              <div>{{ workflow.chain.name }}</div>
            </n-space>
          </n-gi>

          <!-- Event -->
          <n-gi>
            <n-space vertical>
              <div class="text-semi-bold">Event</div>
              <div>{{ workflow.event.name }}</div>
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
          <!-- Channel -->
          <n-gi span="1">
            <n-space vertical>
              <div class="text-semi-bold">Channel</div>
              <div class="text-capitalize">
                {{ actionTask.type }}
              </div>
            </n-space>
          </n-gi>

          <!-- Email recipients-->
          <n-gi span="2" v-if="actionTask.type === 'email'">
            <n-space vertical>
              <div class="text-semi-bold">Recipients</div>
              <n-ellipsis>
                <span
                  v-for="(add, idx) in actionTask.config.addresses"
                  style="font-size: 0.85em"
                  :key="idx"
                >
                  <span>{{ add }}</span>
                  <span v-if="idx !== actionTask.config.addresses.length - 1">,&nbsp;</span>
                </span>
              </n-ellipsis>
            </n-space>
          </n-gi>

          <!-- Telegram chatId-->
          <n-gi span="2" v-if="actionTask.type === 'telegram'">
            <n-space vertical>
              <div class="text-semi-bold">Chat Id</div>
              <div>{{ actionTask.config.chatId }}</div>
            </n-space>
          </n-gi>

          <!-- Discord chatId-->
          <n-gi span="2" v-if="actionTask.type === 'discord'">
            <n-space vertical v-if="actionTask.config.channelId">
              <div class="text-semi-bold">Channel Id</div>
              <div>{{ actionTask.config.channelId }}</div>
            </n-space>

            <n-space vertical v-if="actionTask.config.userId">
              <div class="text-semi-bold">User Id</div>
              <div>{{ actionTask.config.userId }}</div>
            </n-space>
          </n-gi>
        </n-grid>

        <n-space v-if="actionTask.type === 'email'" vertical :size="24">
          <n-space vertical v-if="!isEmpty(customMsgKeys)">
            <div class="text-semi-bold">Subject</div>
            <n-blockquote>{{ getFormattedText(actionTask.config.subjectTemplate) }} </n-blockquote>
          </n-space>

          <n-space vertical v-if="!isEmpty(customMsgKeys)">
            <div class="text-semi-bold">Content</div>
            <n-blockquote>
              <div v-html="getFormattedText(actionTask.config.bodyTemplate)"></div>
            </n-blockquote>
          </n-space>
        </n-space>

        <!-- Webhook config -->
        <n-space vertical v-if="actionTask.type === 'webhook'">
          <div class="text-semi-bold">Config</div>
          <WebhookInput :config="actionTask.config" />
        </n-space>

        <!-- Telegram & Discord Content -->
        <n-space
          v-if="actionTask.type === 'telegram' || actionTask.type === 'discord'"
          vertical
          :size="24"
        >
          <n-space vertical v-if="!isEmpty(customMsgKeys)">
            <div class="text-semi-bold">Content</div>
            <n-blockquote style="white-space: pre-wrap">
              <div v-html="getFormattedText(actionTask.config.messageTemplate)"></div>
            </n-blockquote>
          </n-space>
        </n-space>
      </n-space>
    </n-card>
  </n-space>
</template>

<script setup>
import WebhookInput from '@/views/Editor/Action/WebhookInput';
import WorkflowSwitch from '@/components/WorkflowSwitch';
import { useParsePascalCaseStr, useCustomMessage } from '@/composables';
import { computed, ref, watch, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { isEmpty } from 'lodash';
import moment from 'moment';

const props = defineProps({ id: [String, Number] });
const store = useStore();
const [{}, { getFormattedText }] = useCustomMessage({ isCustomizing: false });

const customMsgKeys = computed(() => store.state.task.customMsgKeys);
const workflow = computed(() => store.state.workflow.workflow);

const filterTask = computed(() => workflow.value.tasks.find((task) => task.name === 'filter'));
const actionTask = computed(() => workflow.value.tasks.find((task) => task.name === 'action'));
const filtersCondition = computed(() => {
  if (filterTask.value) return filterTask.value.config.conditions;
  return [];
});
</script>

<style lang="scss"></style>
