import { computed } from 'vue';
import { useStore } from 'vuex';

export default function useAccordion(task) {
  const store = useStore();
  const expandedNames = computed(() => store.state.editor.expand[task]);

  function setExpand(step) {
    store.commit('editor/setExpand', { [task]: step });
  }

  function nextStep() {
    const newExpandVal = (parseInt(expandedNames.value) + 1).toString();
    store.commit('editor/setExpand', { [task]: newExpandVal });
  }

  function backStep() {
    const newExpandVal = (parseInt(expandedNames.value) - 1).toString();
    store.commit('editor/setExpand', { [task]: newExpandVal });
  }

  return [{ expandedNames }, { nextStep, backStep, setExpand }];
}
