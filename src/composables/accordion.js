import { computed } from 'vue';
import { useStore } from 'vuex';

export default function useAccordion(task) {
  const store = useStore();
  const expandedNames = computed(() => store.state.editor.expand[task]);

  function setExpand(step) {
    store.commit('editor/setExpand', { [task]: step });
  }

  return [{ expandedNames }, { setExpand }];
}
