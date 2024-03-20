<template>
  <div v-if="state.mode === DRIVER">
    <DriverView></DriverView>
  </div>
  <div v-else-if="state.mode === STORE_OWNER">
    <StoreView></StoreView>
  </div>
</template>

<script setup>
import DriverView from './DriverView.vue'
import StoreView from './StoreView.vue'
import { state, DRIVER, STORE_OWNER } from '@/store';
</script>