import { ref, computed, watch, onBeforeMount } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import debounce from 'lodash/debounce';
import findIndex from 'lodash/findIndex';
import isNumber from 'lodash/isNumber';
import { useStore } from 'vuex';
import defaultQuery from '@/config/defaultQuery';

export default function useQuery({ module, path, columns, saveQueryToRoute = true, fetchPath, fetchParams }) {
  const store = useStore();
  const route = useRoute();
  const router = useRouter();

  let sortingIndex;
  let prevSortIndex;

  const searchText = ref('');
  const selectedChain = ref(undefined);
  const selectedStatus = ref(undefined);
  const page = ref(1);
  const pageSize = ref(defaultQuery.limit);

  const query = computed(() => store.state[module].query[path]);
  const loading = computed(() => store.state[module].loading[path]);
  const itemCount = computed(() => store.state[module].itemCount[path]);
  const selectedAccount = computed(() => store.state.account.selected);

  const pagination = computed(() => ({
    size: 'small',
    page: page.value,
    pageSize: pageSize.value,
    itemCount: itemCount.value,
  }));

  async function initQuery() {
    const params = { ...defaultQuery, ...getQueryFromRoute(route.query) };

    updateQuery(params);

    const { search, chainUuid, status } = params;

    searchText.value = search || '';
    selectedChain.value = chainUuid || null;
    selectedStatus.value = status || null;

    // if (isEmpty(route.query)) pushQueryToRoute(params);
  }

  onBeforeMount(async () => {
    initQuery();
    setColumnSortFromRouteQuery();
  });

  function getQueryFromRoute(query) {
    return {
      ...query,
      offset: +query.perPage * (+query.page - 1) || defaultQuery.offset,
      limit: +query.perPage || defaultQuery.limit,
    };
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
      offset: 0,
      search: searchText.value || undefined,
    };

    if (shouldChangeRoute(nextQuery)) updateQuery(nextQuery);
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
    if (shouldChangeRoute(nextQuery)) updateQuery(nextQuery);
  }

  function handlePageChange(nextPage) {
    const offset = query.value.limit * (nextPage - 1);
    updateQuery({ ...query.value, offset });
  }

  function handleSelectChain(chainUuid) {
    selectedChain.value = chainUuid || undefined;
    updateQuery({ ...query.value, offset: 0, chainUuid: selectedChain.value });
  }

  function handleSelectStatus(status) {
    selectedStatus.value = status || undefined;

    updateQuery({ ...query.value, offset: 0, status: selectedStatus.value });
  }

  function clearAllFilters() {
    searchText.value = '';
    selectedChain.value = null;
    selectedStatus.value = null;
    sortingIndex = findIndex(columns.value, ({ sortOrder }) => !!sortOrder);
    if (sortingIndex !== -1) columns.value[sortingIndex].sortOrder = false;
    pushQueryToRoute({ ...defaultQuery });
  }

  function updateQuery(newQuery) {
    store.commit(`${module}/saveQuery`, { [path]: newQuery });
    if (saveQueryToRoute) pushQueryToRoute(newQuery);
  }

  function pushQueryToRoute(newQuery) {
    const { offset, limit } = newQuery;
    const page = offset / limit + 1;
    const perPage = limit;
    const nextQuery = { ...newQuery, page, perPage };
    delete nextQuery.offset;
    delete nextQuery.limit;
    router.push({ query: nextQuery });
  }

  function fetch() {
    store.dispatch(fetchPath, { ...fetchParams });
  }

  function setColumnSortFromRouteQuery() {
    const { order, sort } = getQueryFromRoute(route.query);
    if (!order || !sort) return;

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

  watch(query, () => {
    const { offset, limit } = query.value || {};

    page.value = offset / limit + 1;
    pageSize.value = limit;
    fetch();
  });

  watch(
    itemCount,
    (val) => {
      const totalPage = Math.ceil(val / pageSize.value);
      if (isNumber(val) && totalPage >= 1 && page.value > totalPage) {
        updateQuery({ ...query.value, offset: 0 });
      }
    },
    { immediate: true },
  );

  watch(selectedAccount, () => {
    if (selectedAccount.value) fetch();
  });

  return [
    {
      query,
      searchText,
      selectedChain,
      selectedStatus,
      loading,
      pagination,
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
