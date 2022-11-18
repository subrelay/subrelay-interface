import { reactive } from 'vue';
const conditionFormat = { variable: null, operator: null, value: null };
const defaultConfig = {
  name: null,
  tasks: [
    {
      name: 'trigger',
      type: 'trigger',
      depend_on_name: null,
      isError: false,
      config: { event: 'balance', chain_uuid: '123', conditions: [] },
    },
    {
      name: 'notify',
      type: 'notification',
      config: {
        channel: 'webhook',
        depend_on_name: 'trigger',
        config: { headers: {}, url: null },
      },
    },
  ],
};

const editor = reactive({
  workflow: { ...defaultConfig },

  setName(name) {
    this.workflow.name = name;
  },

  setTrigger(data) {
    const [prop, value] = Object.entries(data)[0];
    this.workflow.tasks[0].config[prop] = value;
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
    // Load data for milestone 2
    this.workflow = data ? data : { ...defaultConfig };
  },
});

export default editor;
