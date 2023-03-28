import { reactive } from 'vue';
import { cloneDeep } from 'lodash';

const conditionFormat = { variable: null, operator: null, value: null };

const defaultConfig = () => ({
  name: null,
  chainUuid: 'f75a269e-3ffb-4ea8-a1f8-e43bfa1a44fd',
  // chainUuid: null,
  tasks: [
    {
      name: 'trigger',
      type: 'trigger',
      dependOnName: null,
      config: {
        // eventId: null,
        eventId: 12,
        conditions: [],
      },
    },
    {
      name: 'action',
      type: 'notification',
      dependOnName: 'trigger',
      config: {
        channel: 'email',
        config: {
          headers: [{ key: null, value: null }],
          url: null,
          // url: 'https://typedwebhook.tools/webhook/f43136d0-e0c1-4757-a05c-247a756b545d',
        },
      },
    },
  ],
});

function randomKey() {
  return Math.random().toString(16).slice(2);
}

const editor = reactive({
  workflow: null,
  postWorkflowData: null,
  triggerIdx: null,
  actionIdx: null,

  setError(taskName, isError) {
    const index = this.workflow.tasks.findIndex((task) => task.name === taskName);
    this.workflow.tasks[index].isError = isError;
  },

  setComplete(taskName, isCompleted) {
    const index = this.workflow.tasks.findIndex((task) => task.name === taskName);
    this.workflow.tasks[index].isCompleted = isCompleted;
  },

  setName(name) {
    this.workflow.name = name || 'Untitled';
  },

  setChainUuid(chainUuid) {
    this.workflow.chainUuid = chainUuid;
  },

  setTrigger(data) {
    this.workflow.tasks[this.triggerIdx].config = {
      ...this.workflow.tasks[this.triggerIdx].config,
      ...data,
    };

    this.setComplete(
      'trigger',
      !!(this.workflow.tasks[this.triggerIdx].config.eventId && this.workflow.chainUuid),
    );
  },

  addOr() {
    this.workflow.tasks[0].config.conditions.push([{ ...conditionFormat, key: randomKey() }]);
  },

  addAnd(groupIdx) {
    this.workflow.tasks[0].config.conditions[groupIdx].push({
      ...conditionFormat,
      key: randomKey(),
    });
  },

  removeCondition(groupIdx, conditionIdx) {
    const condition = this.workflow.tasks[0].config.conditions[groupIdx];
    if (condition.length === 1) {
      this.workflow.tasks[0].config.conditions.splice(groupIdx, 1);
    } else {
      this.workflow.tasks[0].config.conditions[groupIdx].splice(conditionIdx, 1);
    }
  },

  updateCondition(payload, groupIdx, conditionIdx) {
    const { value, prop } = payload;
    this.workflow.tasks[0].config.conditions[groupIdx][conditionIdx][prop] = value;
  },

  loadWorkflow(data) {
    this.workflow = data || defaultConfig();

    this.triggerIdx = this.workflow.tasks.findIndex((task) => task.type === 'trigger');

    this.actionIdx = this.workflow.tasks.findIndex((task) => task.type === 'notification');

    // Add flag for error validator
    this.workflow.tasks.forEach((task, index) => {
      task.isError = null;

      if (index === this.triggerIdx) {
        if (data) {
          task.isCompleted = !!(task.config.eventId && task.chainUuid);
        } else {
          task.isCompleted = null;
        }
      }

      if (index === this.taskIdx) {
        task.isCompleted = null; // UPDATE LATER
      }
    });

    // Add key to each condition
    this.workflow.tasks[this.triggerIdx].config.conditions.forEach((group) => {
      group.forEach((condition) => {
        condition.key = randomKey();
      });
    });
  },

  cleanUpWorkflow() {
    if (!this.workflow.name) this.setName();

    // Create a clean copy data object,
    // so in case the user cancels signer when sending create workflow request
    // supportive props (isComplete, isError, key, etc.) are still remained
    this.postWorkflowData = cloneDeep(this.workflow);

    this.postWorkflowData.tasks.forEach((task) => {
      delete task.isCompleted;
      delete task.isError;
    });

    // Note to emove key for each condition before submitting too.
  },
});

export default editor;
