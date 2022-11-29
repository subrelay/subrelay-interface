import { reactive } from 'vue';

const conditionFormat = { variable: null, operator: null, value: null };

const defaultConfig = () => ({
  name: null,
  tasks: [
    {
      name: 'trigger',
      type: 'trigger',
      isCompleted: null,
      isError: null,
      depend_on_name: null,
      config: { eventId: null, uuid: null, conditions: [] },
    },
    {
      name: 'action',
      type: 'notification',
      isCompleted: null,
      isError: null,
      config: {
        channel: null,
        depend_on_name: 'trigger',
        config: {
          headers: [{ key: null, value: null }],
          url: null,
        },
      },
    },
  ],
});

const editor = reactive({
  workflow: null,
  triggerIdx: null,
  actionIdx: null,

  setError(taskName, isError) {
    const index = this.workflow.tasks.findIndex(
      (task) => task.name === taskName
    );
    this.workflow.tasks[index].isError = isError;
  },

  setComplete(taskName, isCompleted) {
    const index = this.workflow.tasks.findIndex(
      (task) => task.name === taskName
    );
    this.workflow.tasks[index].isCompleted = isCompleted;
  },

  setName(name) {
    this.workflow.name = name ? name : 'Untitled';
  },

  setTrigger(data) {
    const index = this.workflow.tasks.findIndex(
      (task) => task.name === 'trigger'
    );
    const [prop, value] = Object.entries(data)[0];
    this.workflow.tasks[index].config[prop] = value;

    this.setComplete(
      'trigger',
      !!(
        this.workflow.tasks[index].config.eventId &&
        this.workflow.tasks[index].config.uuid
      )
    );
  },

  addOr() {
    this.workflow.tasks[0].config.conditions.push([{ ...conditionFormat }]);
  },

  addAnd(groupIdx) {
    this.workflow.tasks[0].config.conditions[groupIdx].push({
      ...conditionFormat,
    });
  },

  removeCondition(groupIdx, conditionIdx) {
    const condition = this.workflow.tasks[0].config.conditions[groupIdx];
    if (condition.length === 1) {
      this.workflow.tasks[0].config.conditions.splice(groupIdx, 1);
    } else {
      this.workflow.tasks[0].config.conditions[groupIdx].splice(
        conditionIdx,
        1
      );
    }
  },

  updateCondition(payload, groupIdx, conditionIdx) {
    const { value, prop } = payload;
    this.workflow.tasks[0].config.conditions[groupIdx][conditionIdx][prop] =
      value;
  },

  loadWorkflow(data) {
    if (data) {
      data.tasks.forEach((task) => {
        task.isCompleted = null;
        task.isError = null;
      });
    }
    this.workflow = data ? data : defaultConfig();

    this.triggerIdx = this.workflow.tasks.findIndex(
      (task) => task.type === 'trigger'
    );
    this.actionIdx = this.workflow.tasks.findIndex(
      (task) => task.type === 'notification'
    );
  },
});

export default editor;
