import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { pickBy, debounce, isEmpty, findIndex } from 'lodash';
import { useStore } from 'vuex';

export const useQuery = (
  module,
  columns,
  fetchData = () => console.log('default fetchData')
) => {
  const store = useStore();
  const route = useRoute();
  const router = useRouter();
  const query = ref({});
  const searchText = ref('');
  const selectedChain = ref(undefined);
  const selectedStatus = ref(undefined);

  let sortingIndex, prevSortIndex;

  const storedQuery = computed(() => store.state[module].query);
  const loading = computed(() => store.state[module].loading);

  const defaultQuery = computed(() => store.state.global.defaultQuery);

  const tablePagination = ref({
    size: 'small',
    pageSize: defaultQuery.value.limit,
  });

  function pushQueryToRoute(query) {
    router.push({ query });
  }

  function shouldChangeRoute(nextQuery) {
    const currentPath = route.fullPath;
    const nextPath = router.resolve({ query: nextQuery }).fullPath;
    return currentPath !== nextPath;
  }

  const onDebouncedSearch = debounce(handleSearch, 1000);

  function handleSearch() {
    const nextQuery = {
      ...query.value,
      search: searchText.value || undefined,
      offset: 1,
    };

    shouldChangeRoute(nextQuery) && pushQueryToRoute(nextQuery);
  }

  function handleSort(options) {
    // Reset previous sort
    if (prevSortIndex !== undefined) {
      columns.value[prevSortIndex].sortOrder = false;
    }

    const { columnKey, order } = options;
    sortingIndex = findIndex(columns.value, { key: columnKey });
    prevSortIndex = sortingIndex;
    columns.value[sortingIndex].sortOrder = order;

    const queryBySort = order
      ? { order: columnKey, sort: order }
      : { order: undefined, sort: undefined };

    pushQueryToRoute({
      ...query.value,
      ...queryBySort,
    });
  }

  function handlePageChange(nextPage) {
    if (query.value.offset === nextPage) return;
    pushQueryToRoute({ ...query.value, offset: nextPage });
  }

  function handleSelectChain(uuid) {
    selectedChain.value = uuid || undefined;

    pushQueryToRoute({ ...query.value, uuid: selectedChain.value });
  }

  function handleSelectStatus(status) {
    selectedStatus.value = status || undefined;
    router.push({
      query: { ...query.value, status: selectedStatus.value },
    });
  }

  function clearAllFilters() {
    searchText.value = '';
    selectedChain.value = null;
    selectedStatus.value = null;
    query.value = defaultQuery.value;
    pushQueryToRoute({ ...defaultQuery.value });
  }

  function getQueryFromRoute(query) {
    return {
      uuid: query.uuid || undefined,
      status: query.status || undefined,
      search: (query.search && query.search.trim()) || undefined,
      order: query.order || undefined,
      sort: query.sort || undefined,
      offset: +query.offset || defaultQuery.value.offset,
      limit: +query.limit || defaultQuery.value.limit,
    };
  }

  function initQuery() {
    query.value = storedQuery.value || getQueryFromRoute(route.query);

    const { order, sort, search, uuid, status } = route.query;
    searchText.value = search || '';
    selectedChain.value = uuid;
    selectedStatus.value = status;

    if (order) {
      const index = findIndex(columns.value, { key: order });
      columns.value[index].sortOrder = sort;
    }

    pushQueryToRoute(pickBy(query.value));
    store.commit(`${module}/saveQuery`, query.value);
  }

  onBeforeRouteUpdate((to, from, next) => {
    query.value = getQueryFromRoute(to.query);
    store.commit(`${module}/saveQuery`, query.value);

    const { order, sort, search, uuid, status } = to.query;
    searchText.value = search || '';
    selectedChain.value = uuid;
    selectedStatus.value = status;

    // Clear previous order if different
    const prevOrder = from.query.order;
    if (order || prevOrder) {
      sortingIndex = findIndex(columns.value, { key: prevOrder });
      const nextSortIndex = findIndex(columns.value, { key: order });

      if (sortingIndex !== -1) columns.value[sortingIndex].sortOrder = false;
      if (nextSortIndex !== -1) columns.value[nextSortIndex].sortOrder = sort;
    }

    if (!isEmpty(from.query)) fetchData();

    next();
  });

  watch(
    query,
    () => {
      const { offset, limit } = query.value;

      tablePagination.value = {
        ...tablePagination.value,
        pageSize: limit,
        page: offset,
      };
    },
    { deep: true }
  );

  onMounted(() => {
    initQuery();
    fetchData();
  });

  // NOTE TO UPDATE: Watch headers to update pagination params. If offset enterer manually in the url > totalPages => push to last page.
  // ref: Bes1221

  return [
    {
      query,
      searchText,
      selectedChain,
      selectedStatus,
      loading,
      tablePagination,
    },
    {
      onDebouncedSearch,
      handleSort,
      handleSearch,
      handlePageChange,
      handleSelectChain,
      handleSelectStatus,
      initQuery,
      clearAllFilters,
    },
  ];
};
