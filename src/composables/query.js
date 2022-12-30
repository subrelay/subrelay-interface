import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { debounce, isEmpty, findIndex } from 'lodash';
import { useStore } from 'vuex';
import { defaultQuery } from '@/composables/config.js';

export const useQuery = (
  module,
  columns,
  fetchData = () => console.log('default fetchData')
) => {
  const store = useStore();
  const route = useRoute();
  const router = useRouter();

  const searchText = ref('');
  const selectedChain = ref(undefined);
  const selectedStatus = ref(undefined);

  let sortingIndex, prevSortIndex;

  const query = computed(() => store.state[module].query);
  const loading = computed(() => store.state[module].loading);
  const itemCount = computed(() => store.state[module].itemCount);

  const tablePagination = ref({
    size: 'small',
    page: 1,
    pageSize: defaultQuery.limit,
  });

  function pushQueryToRoute(query) {
    const { offset, limit } = query;
    const page = offset / limit + 1;
    const perPage = limit;
    const nextQuery = { ...query, page, perPage };
    delete nextQuery.offset;
    delete nextQuery.limit;
    router.push({ query: nextQuery });
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
      offset: 0,
    };

    shouldChangeRoute(nextQuery) && pushQueryToRoute(nextQuery);
  }

  function handleSort({ columnKey: tableOrder, order: tableSort }) {
    if (prevSortIndex !== undefined) {
      // Reset previous sort
      columns.value[prevSortIndex].sortOrder = false;
    }

    sortingIndex = findIndex(columns.value, { key: tableOrder });
    prevSortIndex = sortingIndex;
    columns.value[sortingIndex].sortOrder = tableSort;

    const order = tableSort ? tableOrder : undefined;
    const sort =
      tableSort === 'descend'
        ? 'desc'
        : tableSort === 'ascend'
        ? 'asc'
        : undefined;

    const queryBySort = { order, sort };

    pushQueryToRoute({ ...query.value, ...queryBySort });
  }

  function handlePageChange(nextPage) {
    const offset = query.value.limit * (nextPage - 1);
    pushQueryToRoute({ ...query.value, offset });
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
    pushQueryToRoute({ ...defaultQuery });
  }

  function getQueryFromRoute(query) {
    return {
      uuid: query.uuid || undefined,
      status: query.status || undefined,
      search: (query.search && query.search.trim()) || undefined,
      order: query.order || undefined,
      sort: query.sort || undefined,
      offset: +query.perPage * (+query.page - 1) || defaultQuery.offset,
      limit: +query.perPage || defaultQuery.limit,
    };
  }

  onBeforeRouteUpdate((to, from, next) => {
    const params = getQueryFromRoute(to.query);
    store.commit(`${module}/saveQuery`, params);

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
        page: offset / limit + 1,
        pageSize: limit,
      };
    },
    { deep: true }
  );

  watch(itemCount, (itemCount) => {
    tablePagination.value = { ...tablePagination.value, itemCount };
  });

  function initQuery() {
    const params = query.value || getQueryFromRoute(route.query);
    store.commit(`${module}/saveQuery`, params);

    const { order, sort, search, uuid, status } = route.query;
    searchText.value = search || '';
    selectedChain.value = uuid;
    selectedStatus.value = status;

    if (order) {
      const index = findIndex(columns.value, { key: order });
      columns.value[index].sortOrder = sort;
    }

    pushQueryToRoute(params);
  }

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
