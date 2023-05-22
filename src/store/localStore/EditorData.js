import { reactive } from 'vue';
import { cloneDeep } from 'lodash';

const conditionFormat = { variable: null, operator: null, value: null };

const defaultConfig = () => ({
  name: null,
  uuid: '01GYAC2F61T2KXB62A7XJ2M5H6',
  // uuid: null,
  tasks: [
    {
      name: 'trigger',
      type: 'trigger',
      dependOnName: null,
      config: {
        eventId: '01GYAC2FSW6YSQVBHJ86Z8VHX5',
        // eventId: null,
      },
    },
    { name: 'filter', type: 'filter', dependOnName: 'trigger', config: { conditions: [] } },
    { name: 'action', type: null, dependOnName: 'filter', config: {} },
  ],
});

function randomKey() {
  return Math.random().toString(16).slice(2);
}

const editor = reactive({
  workflow: null,
  postWorkflowData: null,
  triggerIdx: null,
  filterIdx: null,
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

  setChainUuid(uuid) {
    this.workflow.uuid = uuid;
  },

  resetTrigger() {
    this.workflow.tasks[this.triggerIdx].config.eventId = null;
    this.setComplete('trigger', false);
  },

  resetFilter() {
    this.workflow.tasks[this.filterIdx].config.conditions = [];
    this.setComplete('filter', false); // todo: true or false? since filter is an optional step
  },

  resetAction() {
    this.workflow.tasks[this.actionIdx].type = null;
    this.workflow.tasks[this.actionIdx].config = {};
    this.setComplete('action', false);
  },

  addOr() {
    this.workflow.tasks[this.filterIdx].config.conditions.push([
      { ...conditionFormat, key: randomKey() },
    ]);
  },

  addAnd(groupIdx) {
    this.workflow.tasks[this.filterIdx].config.conditions[groupIdx].push({
      ...conditionFormat,
      key: randomKey(),
    });
  },

  removeCondition(groupIdx, conditionIdx) {
    const condition = this.workflow.tasks[this.filterIdx].config.conditions[groupIdx];
    if (condition.length === 1) {
      this.workflow.tasks[this.filterIdx].config.conditions.splice(groupIdx, 1);
    } else {
      this.workflow.tasks[this.filterIdx].config.conditions[groupIdx].splice(conditionIdx, 1);
    }
  },

  updateCondition(payload, groupIdx, conditionIdx) {
    const { value, prop } = payload;
    this.workflow.tasks[this.filterIdx].config.conditions[groupIdx][conditionIdx][prop] = value;
  },

  loadWorkflow() {
    this.workflow = defaultConfig();
    this.triggerIdx = this.workflow.tasks.findIndex((task) => task.type === 'trigger');
    this.filterIdx = this.workflow.tasks.findIndex((task) => task.type === 'filter');
    this.actionIdx = this.workflow.tasks.findIndex((task) => task.name === 'action');

    // Add flag for error validator
    this.workflow.tasks.forEach((task) => {
      task.isError = null;
      task.isCompleted = null;
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

    // Delete uuid:
    delete this.postWorkflowData.uuid;

    // Remove chatId from discord
    if (this.postWorkflowData.tasks[this.actionIdx].type === 'discord') {
      delete this.postWorkflowData.tasks[this.actionIdx].config.chatId;
    }

    if (this.postWorkflowData.tasks[this.filterIdx].config.conditions.length) {
      // Remove key for each condition before submitting
      this.postWorkflowData.tasks[this.filterIdx].config.conditions.forEach((group) => group.forEach((condition) => delete condition.key));
    } else {
      // Remove empty filter conditions
      this.postWorkflowData.tasks[this.actionIdx].dependOnName = 'trigger';
      this.postWorkflowData.tasks.splice(this.filterIdx, 1);
    }
  },
});

export default editor;
