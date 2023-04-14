<template>
  <!-- EMAIl LIST -->
  <div>TELE SETUP</div>
</template>

<script setup>
import EditorData from '@/store/localStore/EditorData';
import { h, ref, watch, computed, inject, nextTick } from 'vue';
import { template, set, flow, isEmpty } from 'lodash';
import { useIsCorrectEmailFormat, useCustomMessage } from '@/composables';
import { Icon } from '@iconify/vue';
import { useStore } from 'vuex';
import { NTag } from 'naive-ui';
</script>

<style lang="scss"></style>
