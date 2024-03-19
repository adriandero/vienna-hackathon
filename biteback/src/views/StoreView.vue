<template>
  <v-app class="bg-grey-lighten-5">
    <v-layout>
      <Sidebar :items="sidebarItems" @update="changePage($event)" />
      
      <ShareGoodList v-if="currentPage === 'share'"></ShareGoodList>
      <StatsView v-if="currentPage === 'stats'"></StatsView>
    </v-layout>
  </v-app>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue';
import ShareGoodList from '@/components/ShareGoodList.vue';
import { ref, defineProps, onBeforeMount } from 'vue';
import StatsView from '@/views/StoreStatsView.vue';

const sidebarItems = [
  { icon: 'mdi-heart', title: 'Lebensmittel freigeben', value: 'share' },
  { icon: 'mdi-bell', title: 'Benachrichtigungen', value: 'notifications' },
  { icon: 'mdi-database', title: 'CO₂ Statistik', value: 'stats' }
];

const currentPage = ref(sidebarItems[0].value);

function changePage(value) {
  currentPage.value = value;
}
</script>

<style scoped></style>../components/ShareGoodList.vue