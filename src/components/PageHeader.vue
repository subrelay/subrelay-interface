<template>
  <n-space vertical :size="30">
    <div class="page_title">{{ props.module }}</div>

    <n-space align="center" :wrap="false">
      <n-grid cols="6" :x-gap="20" item-responsive>
        <n-gi span="2 1150:1">
          <n-input
            clearable
            placeholder="Search"
            v-model:value="searchText"
            @input="onDebouncedSearch"
          >
            <template #suffix>
              <Icon icon="akar-icons:search" style="margin-left: 0.5rem" />
            </template>
          </n-input>
        </n-gi>

        <n-gi span="2 1150:1">
          <ChainDropdown v-model="selectedChain" :onSelectChain="handleSelectChain" />
        </n-gi>

        <n-gi span="2 1150:1">
          <n-select
            filterable
            clearable
            placeholder="All statuses"
            :render-label="useRenderDropdownLabel"
            :options="statusOptions"
            :value="selectedStatus"
            @update:value="handleSelectStatus"
          />
        </n-gi>
      </n-grid>

      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button @click="clearAllFilters"> <Icon icon="mdi:filter-remove" /></n-button>
        </template>
        Clear all filters
      </n-tooltip>
    </n-space>
  </n-space>
</template>

<script setup>
import { inject, ref } from 'vue';
import { NAvatar } from 'naive-ui';
import { Icon } from '@iconify/vue';
import { useRenderDropdownLabel } from '@/composables';
import ChainDropdown from '@/components/ChainDropdown';

const {
  selectedChain,
  selectedStatus,
  searchText,
  onDebouncedSearch,
  handleSelectChain,
  handleSelectStatus,
  clearAllFilters,
} = inject('search');

const props = defineProps({
  module: String,
  statusOptions: Array,
});
</script>

<style lang="scss"></style>
