<template>
  <v-app class="bg-grey-lighten-5">
    <Sidebar :items="sidebarItems" @update="changePage($event)" />
      
      <ShareGoodList v-if="currentPage === 'share'"></ShareGoodList>
      <MessageList v-if="currentPage === 'notifications'"></MessageList>
      <StoreStatsList v-if="currentPage === 'stats'"></StoreStatsList>
  </v-app>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue';
import ShareGoodList from '@/components/ShareGoodList.vue';
import { ref, defineProps, onBeforeMount } from 'vue';
import StoreStatsList from '@/components/StoreStatsList.vue';
import MessageList from '@/components/MessageList.vue';

const sidebarItems = [
  { icon: 'mdi-heart', title: 'Lebensmittel freigeben', value: 'share' },
  { icon: 'mdi-bell', title: 'Benachrichtigungen', value: 'notifications' },
  { icon: 'mdi-database', title: 'Statistiken', value: 'stats' }
];

const currentPage = ref(sidebarItems[0].value);

function changePage(value) {
  currentPage.value = value;
}
</script>

<style scoped></style>../components/ShareGoodList.vue