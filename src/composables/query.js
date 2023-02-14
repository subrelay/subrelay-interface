import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { debounce, isEmpty, findIndex } from 'lodash';
import { useStore } from 'vuex';
import { defaultQuery } from '@/composables/config';

export default function useQuery(module, columns, fetchData = () => {}) {
  const store = useStore();
  const route = useRoute();
  const router = useRouter();

  const searchText = ref('');
  const selectedChain = ref(undefined);
  const selectedStatus = ref(undefined);

  let sortingIndex;
  let prevSortIndex;

  const query = computed(() => store.state[module].query);
  const loading = computed(() => store.state[module].loading);
  const itemCount = computed(() => store.state[module].itemCount);
  const selectedAccount = computed(() => store.state.account.selected);

  const tablePagination = ref({
    itemCount: 0,
    page: 1,
    pageSize: defaultQuery.limit,
  });

  function pushQueryToRoute(newQuery) {
    const { offset, limit } = newQuery;
    const page = offset / limit + 1;
    const perPage = limit;
    const nextQuery = { ...newQuery, page, perPage };
    delete nextQuery.offset;
    delete nextQuery.limit;
    router.push({ query: nextQuery });
  }

  function shouldChangeRoute(nextQuery) {
    const currentPath = route.fullPath;
    const nextPath = router.resolve({ query: nextQuery }).fullPath;
    return currentPath !== nextPath;
  }

  function handleSearch() {
    const nextQuery = {
      ...query.value,
      search: searchText.value || undefined,
      offset: 0,
    };

    if (shouldChangeRoute(nextQuery)) pushQueryToRoute(nextQuery);
  }

  const onDebouncedSearch = debounce(handleSearch, 1000);

  function handleSort({ columnKey: tableOrder, order: tableSort }) {
    if (prevSortIndex !== undefined) {
      // Reset previous sort
      columns.value[prevSortIndex].sortOrder = false;
    }

    sortingIndex = findIndex(columns.value, { key: tableOrder });
    prevSortIndex = sortingIndex;
    columns.value[sortingIndex].sortOrder = tableSort;

    const order = tableSort ? tableOrder : undefined;
    let sort;

    if (tableSort === 'descend') {
      sort = 'DESC';
    } else if (tableSort === 'ascend') {
      sort = 'ASC';
    } else {
      sort = undefined;
    }

    const queryBySort = { order, sort };
    pushQueryToRoute({ ...query.value, ...queryBySort });
  }

  function handlePageChange(nextPage) {
    const offset = query.value.limit * (nextPage - 1);
    pushQueryToRoute({ ...query.value, offset });
  }

  function handleSelectChain(chainUuid) {
    selectedChain.value = chainUuid || undefined;

    pushQueryToRoute({ ...query.value, chainUuid: selectedChain.value });
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

  function getQueryFromRoute(routeQuery) {
    return {
      chainUuid: routeQuery.chainUuid || undefined,
      status: routeQuery.status || undefined,
      search: (routeQuery.search && routeQuery.search.trim()) || undefined,
      order: routeQuery.order || undefined,
      sort: routeQuery.sort || undefined,
      offset: +routeQuery.perPage * (+routeQuery.page - 1) || defaultQuery.offset,
      limit: +routeQuery.perPage || defaultQuery.limit,
    };
  }

  onBeforeRouteUpdate((to, from, next) => {
    const params = getQueryFromRoute(to.query);
    store.commit(`${module}/saveQuery`, params);

    const { order, sort, search, chainUuid, status } = to.query;
    searchText.value = search || '';
    selectedChain.value = chainUuid;
    selectedStatus.value = status;

    // Clear previous order if different
    const prevOrder = from.query.order;
    if (order || prevOrder) {
      sortingIndex = findIndex(columns.value, { key: prevOrder });
      const nextSortIndex = findIndex(columns.value, { key: order });

      let tableSort;

      if (sort === 'ASC') {
        tableSort = 'ascend';
      } else if (sort === 'DESC') {
        tableSort = 'descend';
      } else {
        tableSort = false;
      }

      if (sortingIndex !== -1) columns.value[sortingIndex].sortOrder = false;
      if (nextSortIndex !== -1) columns.value[nextSortIndex].sortOrder = tableSort;
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
    { deep: true },
  );

  watch(
    itemCount,
    (val) => {
      tablePagination.value = { ...tablePagination.value, itemCount: val };
    },
    { immediate: true },
  );

  watch(selectedAccount, () => {
    if (selectedAccount.value) fetchData();
  });

  function initQuery() {
    const params = query.value || getQueryFromRoute(route.query);
    store.commit(`${module}/saveQuery`, params);

    const { order, sort, search, chainUuid, status } = route.query;
    searchText.value = search || '';
    selectedChain.value = chainUuid;
    selectedStatus.value = status;

    if (order) {
      const index = findIndex(columns.value, { key: order });

      let tableSort;

      if (sort === 'ASC') {
        tableSort = 'ascend';
      } else if (sort === 'DESC') {
        tableSort = 'descend';
      } else {
        tableSort = false;
      }

      if (index !== -1) columns.value[index].sortOrder = tableSort;
    }

    pushQueryToRoute(params);
  }

  onMounted(() => {
    initQuery();
    fetchData();
  });

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
}
