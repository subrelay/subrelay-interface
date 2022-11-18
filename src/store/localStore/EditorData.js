import { reactive } from 'vue';
const defaultConfig = {
  name: null,
  tasks: [
    {
      name: 'trigger',
      type: 'trigger',
      depend_on_name: null,
      isError: false,
      config: { event: null, chain_uuid: null, conditions: [] },
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

  loadWorkflow(data) {
    this.workflow = data ? data : { ...defaultConfig };
  },
});

export default editor;
