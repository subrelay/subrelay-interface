<template>
  <n-space align="center" justify="center" style="height: 80vh; width: 100%" v-if="loading">
    <Icon icon="eos-icons:three-dots-loading" width="50" color="rgba(230, 0, 122, 1)" />
  </n-space>

  <div v-else class="log-details">
    <n-result
      style="margin-top: 20vh"
      v-if="isEmpty(log)"
      status="error"
      title="Log Not Found"
      description="The log you are looking for is not existed. Let's back to the home page."
    >
      <template #footer>
        <n-button @click="router.push('/')">Go to home page</n-button>
      </template>
    </n-result>

    <div v-else>
      <!-- HEADER -->
      <n-space align="center" justify="space-between">
        <n-breadcrumb separator=">" style="font-family: Unbounded">
          <n-breadcrumb-item>
            <template #default>
              <router-link :to="{ name: 'logs' }" class="text-bold font-size-2rem">
                LOGS
              </router-link>
            </template>
          </n-breadcrumb-item>

          <n-breadcrumb-item>
            <div class="font-size-2rem text-bold">{{ log.workflow.name || '' }}</div>
          </n-breadcrumb-item>
        </n-breadcrumb>

        <n-dropdown
          trigger="hover"
          :options="options"
          @select="handleSelect"
          placement="bottom-end"
        >
          <n-button text><Icon icon="ph:dots-six-vertical-bold" width="1.25rem" /> </n-button>
        </n-dropdown>
      </n-space>

      <!-- INFO -->
      <n-space vertical style="margin: 2rem 0">
        <n-space>
          <div class="info-title">Time:</div>
          <div>{{ moment(log.finishedAt).local().format('MMM Do YYYY, HH:mm:ss') }}</div>
        </n-space>

        <n-space>
          <div class="info-title">Status:</div>

          <n-space align="vertical">
            <StatusIcon :status="log.status" />
            <div class="text-capitalize">{{ log.status }}</div>
          </n-space>

          <n-space vertical> </n-space>
        </n-space>
      </n-space>

      <!-- STEPS -->
      <n-space class="steps" :size="0" :wrap="false">
        <n-space
          v-for="(step, index) in log.taskLogs"
          :key="index"
          align="center"
          :size="0"
          :wrap="false"
        >
          <!-- todo: Change to component -->
          <n-space
            v-if="log.taskLogs[index].task.type === 'trigger'"
            class="step no-input"
            align="center"
            justify="space-between"
            :wrap-item="false"
            :wrap="false"
          >
            <n-space align="center" :wrap-item="false">
              <n-avatar
                style="background: transparent"
                round
                :size="24"
                :src="log.chain.imageUrl"
              />
              <div>{{ log.event.name }}</div>
            </n-space>

            <n-tooltip trigger="hover" class="text-capitalize">
              <template #trigger>
                <StatusIcon :status="log.taskLogs[index].status" />
              </template>
              {{ log.taskLogs[index].status }}
            </n-tooltip>
          </n-space>

          <n-button
            v-if="log.taskLogs[index].task.type === 'filter'"
            size="large"
            round
            class="step"
            style="padding: 1rem; justify-content: start"
            @click="setStep(index)"
          >
            <n-space align="center" justify="space-between" class="w-100" :size="8">
              <n-space align="center" :wrap-item="false">
                <Icon icon="clarity:filter-grid-circle-solid" width="24" />
                <div class="text-capitalize">{{ log.taskLogs[index].task.type }}</div>
              </n-space>

              <n-space align="center" :wrap-item="false">
                <Icon
                  icon="mdi:information-variant-circle-outline"
                  width="1.2rem"
                  :class="['info-icon', { dark: isDarkMode }]"
                />

                <n-tooltip trigger="hover" class="text-capitalize">
                  <template #trigger>
                    <StatusIcon :status="log.taskLogs[index].status" />
                  </template>
                  {{ log.taskLogs[index].status }}
                </n-tooltip>
              </n-space>
            </n-space>

            <div class="text-capitalize" v-if="log.taskLogs[index].task.name === 'action'">
              {{ log.taskLogs[index].task.name }}
            </div>
          </n-button>

          <n-button
            v-if="log.taskLogs[index].task.name === 'action'"
            size="large"
            round
            class="step"
            style="padding: 1rem; justify-content: start"
            @click="setStep(index)"
          >
            <n-space align="center" justify="space-between" class="w-100" :size="8">
              <n-space align="center" :wrap-item="false">
                <Icon :icon="useGetChannelIcon(log.taskLogs[index].task.type)" width="24" />
                <div class="text-capitalize">{{ log.taskLogs[index].task.type }}</div>
              </n-space>

              <n-space align="center" :wrap-item="false">
                <Icon
                  icon="mdi:information-variant-circle-outline"
                  width="1.2rem"
                  :class="['info-icon', { dark: isDarkMode }]"
                />

                <n-tooltip trigger="hover" class="text-capitalize">
                  <template #trigger>
                    <StatusIcon :status="log.taskLogs[index].status" />
                  </template>
                  {{ log.taskLogs[index].status }}
                </n-tooltip>
              </n-space>
            </n-space>
          </n-button>

          <div class="splitor" v-if="index !== log.taskLogs.length - 1"></div>
        </n-space>
      </n-space>

      <!-- DETAILS -->
      <transition name="fade" mode="out-in">
        <n-card style="margin-bottom: 5vh" v-if="currentLogDetails">
          <template #header>
            <n-space align="center" :wrap-item="false">
              <div class="text-capitalize">{{ currentLogDetails.task.type }}</div>
            </n-space>
          </template>

          <!-- Input -->
          <n-space vertical :size="20">
            <n-space v-if="currentLogDetails.input" vertical>
              <div>Input:</div>

              <JsonViewer
                :class="{ 'jv-dark': isDarkMode }"
                :value="currentLogDetails.input"
                :expand-depth="1"
                v-if="currentLogDetails.input.chain"
                copyable
                boxed
                sort
              />

              <n-card embedded v-else>
                <n-space vertical :size="24">
                  <n-space vertical v-if="currentLogDetails.input.subject">
                    <div class="text-semi-bold">Subject:</div>
                    <n-blockquote>{{ currentLogDetails.input.subject }} </n-blockquote>
                  </n-space>

                  <n-collapse
                    arrow-placement="right"
                    default-expanded-names="content"
                    v-if="currentLogDetails.input.body"
                  >
                    <n-collapse-item title="Content" name="content">
                      <template #header><div style="font-weight: bold">Content:</div> </template>

                      <n-blockquote style="white-space: pre-wrap">
                        <div v-html="currentLogDetails.input.body" style="font-size: 0.85em" />
                      </n-blockquote>
                    </n-collapse-item>
                  </n-collapse>

                  <n-collapse
                    arrow-placement="right"
                    default-expanded-names="content"
                    v-if="currentLogDetails.input.message"
                  >
                    <n-collapse-item title="Content" name="content">
                      <template #header><div style="font-weight: bold">Message:</div> </template>

                      <n-blockquote style="white-space: pre-wrap">
                        <div v-html="currentLogDetails.input.message" style="font-size: 0.85em" />
                      </n-blockquote>
                    </n-collapse-item>
                  </n-collapse>
                </n-space>
              </n-card>
            </n-space>

            <!-- Output -->
            <div v-if="currentLogDetails.output">
              <div>Output:</div>
              <JsonViewer
                :class="{ 'jv-dark': isDarkMode }"
                :value="currentLogDetails.output"
                :expand-depth="1"
                copyable
                boxed
                sort
              />
            </div>
          </n-space>

          <!-- Skipped task msg -->
          <div v-if="currentLogDetails.status === 'skipped'">This task was skipped.</div>

          <!-- Failed task error -->
          <n-space v-if="currentLogDetails.status === 'failed'" style="margin-top: 1rem">
            <div>Error:</div>
            <n-text type="error">{{ currentLogDetails.error?.message }}</n-text>
          </n-space>
        </n-card>
      </transition>
    </div>
  </div>
</template>

<script setup>
import StatusIcon from '@/components/StatusIcon';
import { JsonViewer } from 'vue3-json-viewer';
import { computed, watch, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { isEmpty } from 'lodash';
import { useShowError, useRenderIcon as renderIcon, useGetChannelIcon } from '@/composables';
import moment from 'moment';
import Api from '@/api';
import '../assets/vue3-json-viewer.scss';

const props = defineProps(['id']);
const router = useRouter();
const store = useStore();
const account = computed(() => store.state.account.selected);
const signer = computed(() => store.state.account.signer);
const isDarkMode = computed(() => store.state.global.isDarkMode);
const selectedAccount = computed(() => store.state.account.selected);
const currentLogDetails = ref(null);
const loading = ref(true);
const step = ref(null);
const log = ref({});

async function fetch() {
  try {
    const { data } = await Api.getLogDetails({
      account: account.value,
      signer: signer.value,
      id: props.id,
    });
    log.value = data;
  } catch (e) {
    useShowError(e);
    log.value = {};
  } finally {
    loading.value = false;
  }
}

watch(
  selectedAccount,
  () => {
    if (!isEmpty(selectedAccount.value)) fetch();
  },
  { immediate: true },
);

const options = ref([
  {
    label: 'View workflow details',
    key: 'viewDetails',
    icon: renderIcon('bi:eye-fill'),
  },
  {
    label: 'View full workflow logs',
    key: 'logs',
    icon: renderIcon('icon-park-outline:log'),
  },
]);

function handleSelect(key) {
  if (key === 'viewDetails') {
    router.push({ name: 'overview', params: { id: log.value.workflow.id } });
  }

  if (key === 'logs') {
    router.push({ name: 'workflowLogs', params: { id: log.value.workflow.id } });
  }
}

function setStep(newStep) {
  step.value = newStep === step.value ? null : newStep;
  currentLogDetails.value = step.value ? log.value.taskLogs[newStep] : null;
}
</script>

<style lang="scss">
.info-icon {
  color: #2080f0;
  &.dark {
    color: #70c0e8;
  }
}

.log-details {
  .info-title {
    width: 50px;
  }
}

.steps {
  display: flex;
  align-items: center;
  margin-bottom: 3rem;
}

.step {
  width: 20vw;
  max-width: 500px;
  min-width: 220px;

  &.no-input {
    border: 1px solid rgb(224, 224, 230);
    border-radius: 40px;
    padding: 1rem;
    line-height: 1;
    height: 40px;
    user-select: none;
  }

  .n-button__content {
    width: 100%;
  }
}

.splitor {
  background-color: rgba(194, 194, 194, 1);
  height: 1px;
  width: 10vw;
}

/* TRANSITIONS */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
