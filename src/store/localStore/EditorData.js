import { reactive } from 'vue';

const conditionFormat = { variable: null, operator: null, value: null };

const defaultConfig = () => ({
  name: null,
  tasks: [
    {
      name: 'trigger',
      type: 'trigger',
      depend_on_name: null,
      config: {
        eventId: 139,
        uuid: '8b6af998-a145-46f5-8c04-a2d5c717e82a',
        conditions: [
          [
            {
              variable: 'data.index',
              operator: 'greaterThan',
              value: 1,
            },
            {
              variable: 'data.index',
              operator: 'greaterThanEqual',
              value: 3,
            },
          ],
          [
            {
              variable: 'success',
              operator: 'isFalse',
              value: null,
            },
            {
              variable: 'data.child_index',
              operator: 'lessThan',
              value: 5,
            },
          ],
          [
            {
              variable: 'data.child_index',
              operator: 'greaterThan',
              value: 0,
            },
          ],
        ],
      },
    },
    {
      name: 'action',
      type: 'notification',
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

function randomKey() {
  return Math.random().toString(16).slice(2);
}

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
    this.workflow.tasks[0].config.conditions.push([
      { ...conditionFormat, key: randomKey() },
    ]);
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
    this.workflow = data ? data : defaultConfig();

    this.workflow.tasks.forEach((task) => {
      task.isCompleted = null;
      task.isError = null;
    });

    this.triggerIdx = this.workflow.tasks.findIndex(
      (task) => task.type === 'trigger'
    );
    this.actionIdx = this.workflow.tasks.findIndex(
      (task) => task.type === 'notification'
    );
  },
});

export default editor;
