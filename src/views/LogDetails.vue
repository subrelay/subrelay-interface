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
        <n-breadcrumb separator=">">
          <n-breadcrumb-item>
            <template #default>
              <router-link
                :to="{ name: 'logs' }"
                class="text-bold font-size-2rem"
                style="font-family: Unbounded"
              >
                LOGS
              </router-link>
            </template>
          </n-breadcrumb-item>

          <n-breadcrumb-item class="font-size-2rem text-bold">
            {{ log.name || '' }}
          </n-breadcrumb-item>
        </n-breadcrumb>

        <n-dropdown
          trigger="hover"
          :options="options"
          @select="handleSelect"
          placement="bottom-end"
        >
          <n-button text>
            <Icon icon="ph:dots-six-vertical-bold" width="30" />
          </n-button>
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
      <div class="steps">
        <n-button size="large" round class="step" @click="setStep(log.taskLogs[0].task.name)">
          <StatusIcon :status="log.taskLogs[0].status" style="margin: 0 10px 0 -1.5rem" />
          <div class="text-capitalize">{{ log.taskLogs[0].task.name }}</div>
        </n-button>

        <div class="splitor"></div>

        <n-button size="large" round class="step" @click="setStep(log.taskLogs[1].task.name)">
          <n-space align="center">
            <StatusIcon :status="log.taskLogs[1].status" style="margin: 0 10px 0 -1.5rem" />
            <div class="text-capitalize">{{ log.taskLogs[1].task.name }}</div>
          </n-space>
        </n-button>
      </div>

      <!-- DETAILS -->
      <transition name="fade" mode="out-in">
        <!-- Trigger -->
        <n-card v-if="step === log.taskLogs[0].task.name" style="margin-bottom: 5vh">
          <template #header>
            <n-space align="center" :wrap-item="false">
              <StatusIcon :status="log.taskLogs[0].status" />
              <div class="text-capitalize">{{ log.taskLogs[0].task.name }}</div>
            </n-space>
          </template>

          <n-space vertical :size="20">
            <n-space>
              <div class="info-title">Time:</div>
              <div>
                {{ moment(log.taskLogs[0].finishedAt).local().format('MMM Do YYYY, HH:mm:ss') }}
              </div>
            </n-space>

            <div>
              <div>Input:</div>
              <JsonViewer
                :class="{ 'jv-dark': isDarkMode }"
                :value="log.taskLogs[0].input"
                :expand-depth="1"
                copyable
                boxed
                sort
              />
            </div>

            <div>
              <div>Output:</div>
              <JsonViewer
                :class="{ 'jv-dark': isDarkMode }"
                :value="log.taskLogs[0].output"
                :expand-depth="1"
                copyable
                boxed
                sort
              />
            </div>
          </n-space>
        </n-card>

        <!-- Action -->
        <n-card v-else-if="step === log.taskLogs[1].task.name" style="margin-bottom: 5vh">
          <template #header>
            <n-space align="center" :wrap-item="false">
              <StatusIcon :status="log.taskLogs[1].status" />
              <div class="text-capitalize">{{ log.taskLogs[1].task.name }}</div>
            </n-space>
          </template>

          <n-space vertical :size="20">
            <n-space>
              <div class="info-title">Time:</div>
              <div>
                {{ moment(log.taskLogs[1].finishedAt).local().format('MMM Do YYYY, HH:mm:ss') }}
              </div>
            </n-space>

            <div>
              <div>Input:</div>
              <JsonViewer
                :class="{ 'jv-dark': isDarkMode }"
                :value="log.taskLogs[1].input"
                :expand-depth="1"
                copyable
                boxed
                sort
              />
            </div>

            <div>
              <div>Output:</div>
              <JsonViewer
                :class="{ 'jv-dark': isDarkMode }"
                :value="log.taskLogs[1].output"
                :expand-depth="1"
                copyable
                boxed
                sort
              />
            </div>
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
import { useShowError, useRenderIcon as renderIcon } from '@/composables';
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
const loading = ref(true);
const step = ref(null);
const log = ref({});

watch(
  selectedAccount,
  () => {
    if (!isEmpty(selectedAccount.value)) fetch();
  },
  { immediate: true },
);

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

const options = ref([
  {
    label: 'View workflow details',
    key: 'viewDetails',
    icon: renderIcon('bi:eye-fill'),
  },
  {
    label: 'View full workflow logs',
    key: 'log',
    icon: renderIcon('icon-park-outline:log'),
  },
]);

function handleSelect(key) {
  console.log('log ', log.value);
  // if (key === 'viewDetails') {
  //   router.push({ name: 'overview', params: { id: props.id } });
  // }
}

function setStep(newStep) {
  step.value = newStep === step.value ? null : newStep;
}
</script>

<style lang="scss">
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
  width: 15vw;
  max-width: 500px;
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
