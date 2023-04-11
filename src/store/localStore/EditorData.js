import { reactive } from 'vue';
import { cloneDeep } from 'lodash';

const conditionFormat = { variable: null, operator: null, value: null };

const defaultConfig = () => ({
  name: null,
  chainUuid: '01GXN125QNY368GYCA6JVVF1WZ',
  tasks: [
    {
      name: 'trigger',
      type: 'trigger',
      dependOnName: null,
      config: { eventId: '01GXN125RAQ17WKSGGK02FBA7B' },
    },
    {
      name: 'filter',
      type: 'filter',
      dependOnName: 'trigger',
      config: { conditions: [] },
    },
    {
      name: 'notification',
      type: '',
      dependOnName: 'trigger',
      config: {},
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

  setChainUuid(chainUuid) {
    this.workflow.chainUuid = chainUuid;
  },

  resetTrigger() {
    this.workflow.tasks[this.triggerIdx].config.eventId = null;
    this.setComplete('trigger', false);
  },

  resetFilter() {
    this.workflow.tasks[this.filterIdx].config.conditions = [];
    this.setComplete('filter', false); // todo: true or false?
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
    this.actionIdx = this.workflow.tasks.findIndex((task) => task.name === 'notification');

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

    // Delete chainUuid:
    delete this.postWorkflowData.chainUuid;

    // Note to emove key for each condition before submitting too.
  },
});

export default editor;
