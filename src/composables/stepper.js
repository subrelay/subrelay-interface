import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export default function useStepper(task) {
  const store = useStore();
  const expandedNames = computed(() => store.state.editor.expand[task]);

  function nextStep() {
    const newExpandVal = (parseInt(expandedNames.value) + 1).toString();
    store.commit('editor/setExpand', { [task]: newExpandVal });
  }

  function backStep() {
    const newExpandVal = (parseInt(expandedNames.value) - 1).toString();
    store.commit('editor/setExpand', { [task]: newExpandVal });
  }

  function updateExpanded(val) {
    store.commit('editor/setExpand', { [task]: val[0] });
  }

  return [{ expandedNames }, { nextStep, backStep, updateExpanded }];
}
