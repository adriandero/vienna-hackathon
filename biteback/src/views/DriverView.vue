<template>
  <v-app class="bg-grey-lighten-5">
    <v-layout>
      <Sidebar :items="sidebarItems" @update="changePage($event)" />

      <v-main class="d-flex">
        
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue';

const sidebarItems = [
  { icon: 'mdi-heart', title: 'Lebensmittel freigeben', value: 'share' },
  { icon: 'mdi-bell', title: 'Benachrichtigungen', value: 'notifications' },
  { icon: 'mdi-database', title: 'CO₂ Statistik', value: 'stats' }
];

function changePage(value) {
  console.log(value)
}
</script>