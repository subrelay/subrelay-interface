import { cloneDeep } from 'lodash';
import editor from './EditorData';

describe('EditorData', () => {
  beforeEach(() => {
    editor.loadWorkflow();
  });

  afterEach(() => {
    editor.cleanUpWorkflow();
  });

  test('setName should set the workflow name', () => {
    const name = 'My Workflow';
    editor.setName(name);
    expect(editor.workflow.name).toBe(name);
  });

  test('setChainUuid should set the workflow UUID', () => {
    const uuid = '01H1BE98ER69WGY85D5ABW80Y0';
    editor.setChainUuid(uuid);
    expect(editor.workflow.uuid).toBe(uuid);
  });

  test('resetTrigger should reset the trigger configuration', () => {
    editor.resetTrigger();
    expect(editor.workflow.tasks[editor.triggerIdx].config.eventId).toBeNull();
    expect(editor.workflow.tasks[editor.triggerIdx].isCompleted).toBe(false);
  });

  test('resetFilter should reset the filter configuration', () => {
    editor.resetFilter();
    expect(editor.workflow.tasks[editor.filterIdx].config.conditions).toHaveLength(0);
    expect(editor.workflow.tasks[editor.filterIdx].isCompleted).toBe(false);
  });

  test('resetAction should reset the action configuration', () => {
    editor.resetAction();
    expect(editor.workflow.tasks[editor.actionIdx].type).toBeNull();
    expect(editor.workflow.tasks[editor.actionIdx].config).toEqual({});
    expect(editor.workflow.tasks[editor.actionIdx].isCompleted).toBe(false);
  });

  test('addOr should add a new "OR" condition group', () => {
    const initialConditionsLength = editor.workflow.tasks[editor.filterIdx].config.conditions.length;
    editor.addOr();
    expect(editor.workflow.tasks[editor.filterIdx].config.conditions).toHaveLength(initialConditionsLength + 1);
  });

  test('addAnd should add a new "AND" condition to a group', () => {
    const groupIdx = 0;
    editor.addAnd(groupIdx);
    expect(editor.workflow.tasks[editor.filterIdx].config.conditions[groupIdx]).toHaveLength(1);
  });

  test('removeCondition should remove a condition', () => {
    const groupIdx = 0;
    const conditionIdx = 0;
    editor.addAnd(groupIdx);
    expect(editor.workflow.tasks[editor.filterIdx].config.conditions[groupIdx]).toHaveLength(1);
    editor.removeCondition(groupIdx, conditionIdx);
    expect(editor.workflow.tasks[editor.filterIdx].config.conditions[groupIdx]).toBeUndefined();
  });

  test('updateCondition should update a condition property', () => {
    const groupIdx = 0;
    const conditionIdx = 0;
    editor.addAnd(groupIdx);
    const payload = { value: 'new value', prop: 'variable' };
    editor.updateCondition(payload, groupIdx, conditionIdx);
    expect(editor.workflow.tasks[editor.filterIdx].config.conditions[groupIdx][conditionIdx].variable).toBe(payload.value);
  });

  // test('cleanUpWorkflow should clean up the workflow data for submission', () => {
  //   const initialWorkflow = cloneDeep(editor.workflow);
  //   editor.cleanUpWorkflow();

  //   expect(editor.postWorkflowData).toEqual(initialWorkflow);
  //   expect(editor.postWorkflowData.tasks[editor.filterIdx]).toBeUndefined();
  //   expect(editor.postWorkflowData.uuid).toBeUndefined();
  //   expect(editor.postWorkflowData.tasks[editor.actionIdx].config.chatId).toBeUndefined();
  //   expect(editor.postWorkflowData.tasks[editor.filterIdx].config.conditions[0][0].key).toBeUndefined();
  // });
});
