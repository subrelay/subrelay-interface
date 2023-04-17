import { ref, onMounted, computed, watch, onBeforeMount } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { debounce, isEmpty, findIndex } from 'lodash';
import { useStore } from 'vuex';
import { defaultQuery } from '@/composables/config';

export default function useQuery(module, path, columns = {}, fetchData = () => {}) {
  const store = useStore();
  const route = useRoute();
  const router = useRouter();

  const searchText = ref('');
  const selectedChain = ref(undefined);
  const selectedStatus = ref(undefined);

  let sortingIndex;
  let prevSortIndex;

  const query = computed(() => store.state[module].query[path]);
  const loading = computed(() => store.state[module].loading[path]);
  const itemCount = computed(() => store.state[module].itemCount[path]);
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
    const nextQuery = { ...query.value, ...queryBySort };
    if (shouldChangeRoute(nextQuery)) pushQueryToRoute(nextQuery);
  }

  function handlePageChange(nextPage) {
    const offset = query.value.limit * (nextPage - 1);
    pushQueryToRoute({ ...query.value, offset });
  }

  function handleSelectChain(chainUuid) {
    selectedChain.value = chainUuid || undefined;
    pushQueryToRoute({ ...query.value, offset: 0, chainUuid: selectedChain.value });
  }

  function handleSelectStatus(status) {
    selectedStatus.value = status || undefined;

    pushQueryToRoute({ ...query.value, offset: 0, status: selectedStatus.value });
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
    if (from.name !== to.name) {
      next();
    } else {
      const params = getQueryFromRoute(to.query);
      store.commit(`${module}/saveQuery`, { [path]: params });

      if (!isEmpty(from.query)) fetchData();

      next();
    }
  });

  watch(
    query,
    () => {
      const { offset, limit } = query.value || {};

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
      const offset = query.value?.offset;
      if (offset > val) {
        pushQueryToRoute({ ...query.value, offset: 0 });
      }
      tablePagination.value = { ...tablePagination.value, itemCount: val };
    },
    { immediate: true },
  );

  watch(selectedAccount, () => {
    if (selectedAccount.value) fetchData();
  });

  async function initQuery() {
    const params = query.value || getQueryFromRoute(route.query);
    store.commit(`${module}/saveQuery`, { [path]: params });

    const { order, sort, search, chainUuid, status } = params;
    searchText.value = search || '';
    selectedChain.value = chainUuid;
    selectedStatus.value = status;

    if (order) {
      sortingIndex = findIndex(columns.value, { key: order });
      prevSortIndex = sortingIndex;
      let tableSort;

      if (sort === 'ASC') {
        tableSort = 'ascend';
      } else if (sort === 'DESC') {
        tableSort = 'descend';
      } else {
        tableSort = false;
      }

      if (sortingIndex !== -1) columns.value[sortingIndex].sortOrder = tableSort;
    }

    if (isEmpty(route.query)) pushQueryToRoute(params);
  }

  // onMounted(async () => {
  //   setTimeout(() => {
  //     initQuery();
  //     fetchData();
  //   }, 100);
  // });

  onBeforeMount(async () => {
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
