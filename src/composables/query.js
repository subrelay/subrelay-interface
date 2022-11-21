import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { pickBy, debounce, isEmpty, findIndex } from 'lodash';
import { useStore } from 'vuex';

export const useQueryParams = (
  module,
  columns,
  fetchData = () => console.log('default fetchData')
) => {
  const store = useStore();
  const route = useRoute();
  const router = useRouter();
  const queryParams = ref({});
  const searchText = ref('');
  const loading = ref(false);
  const selectedChain = ref(undefined);
  const selectedStatus = ref(undefined);

  let sortingIndex, prevSortIndex;

  const storedQueryParams = computed(() => store.state[module].queryParams);

  const defaultQueryParams = computed(
    () => store.state.global.defaultQueryParams
  );

  const tablePagination = ref({
    size: 'small',
    pageSize: defaultQueryParams.value.limit,
  });

  function pushQueryToRoute(query) {
    router.push({ query });
  }

  const onDebouncedSearch = debounce(handleSearch, 1000);

  function shouldChangeRoute(nextQuery) {
    const currentPath = route.fullPath;
    const nextPath = router.resolve({ query: nextQuery }).fullPath;
    return currentPath !== nextPath;
  }

  function handleSearch() {
    const nextQuery = {
      ...queryParams.value,
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
      ...queryParams.value,
      ...queryBySort,
    });
  }

  function handlePageChange(nextPage) {
    if (queryParams.value.offset === nextPage) return;
    pushQueryToRoute({ ...queryParams.value, offset: nextPage });
  }

  function handleSelectChain(chain_uuid) {
    selectedChain.value = chain_uuid || undefined;

    pushQueryToRoute({ ...queryParams.value, chain_uuid: selectedChain.value });
  }

  function handleSelectStatus(status) {
    selectedStatus.value = status || undefined;
    router.push({
      query: { ...queryParams.value, status: selectedStatus.value },
    });
  }

  function clearAllFilters() {
    searchText.value = '';
    selectedChain.value = undefined;
    selectedStatus.value = undefined;
    queryParams.value = defaultQueryParams.value;
    pushQueryToRoute({ ...defaultQueryParams.value });
  }

  function getQueryParamsFromRoute(query) {
    return {
      chain_uuid: query.chain_uuid || undefined,
      status: query.status || undefined,
      search: (query.search && query.search.trim()) || undefined,
      order: query.order || undefined,
      sort: query.sort || undefined,
      offset: +query.offset || defaultQueryParams.value.offset,
      limit: +query.limit || defaultQueryParams.value.limit,
    };
  }

  function initQueryParams() {
    queryParams.value =
      storedQueryParams.value || getQueryParamsFromRoute(route.query);

    const { order, sort, search, chain_uuid, status } = route.query;
    searchText.value = search || '';
    selectedChain.value = chain_uuid;
    selectedStatus.value = status;

    if (order) {
      const index = findIndex(columns.value, { key: order });
      columns.value[index].sortOrder = sort;
    }

    pushQueryToRoute(pickBy(queryParams.value));
  }

  onBeforeRouteUpdate((to, from, next) => {
    queryParams.value = getQueryParamsFromRoute(to.query);

    const { order, sort, search, chain_uuid, status } = to.query;
    searchText.value = search || '';
    selectedChain.value = chain_uuid;
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
    queryParams,
    () => {
      store.commit(`${module}/saveQueryParams`, queryParams.value);

      const { offset, limit } = queryParams.value;

      tablePagination.value = {
        ...tablePagination.value,
        pageSize: limit,
        page: offset,
      };
    },
    { deep: true }
  );

  onMounted(() => {
    initQueryParams();
  });

  // NOTE TO UPDATE: Watch headers to update pagination params. If offset enterer manually in the url > totalPages => push to last page.
  // ref: Bes1221

  return [
    {
      queryParams,
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
      initQueryParams,
      clearAllFilters,
    },
  ];
};
