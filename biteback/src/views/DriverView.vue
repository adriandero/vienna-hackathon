<template>
  <v-app class="bg-grey-lighten-5">
    <v-layout>
      <Sidebar
        :items="sidebarItems"
        @update="changePage($event)"
        @confirmNumberOfShops="confirmShops($event)"
      />

      <v-main class="d-flex">
        <div id="layout">
          <Map :shopNumber="numberOfShops" />
        </div>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup>
import Sidebar from '@/components/SidebarDriver.vue'
import Map from '../components/MapChat.vue'
import '../../node_modules/mapbox-gl/dist/mapbox-gl.css'

import { ref } from 'vue'

const sidebarItems = [{}]
let numberOfShops = ref(0)

function changePage(value) {
  console.log(value)
}

function confirmShops(shopAmount) {
  numberOfShops.value = shopAmount
}
</script>

<style>
#layout {
  display: flex;
  height: 100vh;
  width: 100%;
}
#sidebar {
  background-color: #f8f9fa;
  color: #495057;
  padding: 6px 12px;
  font-family: monospace;
  z-index: 1;
  position: absolute;
  top: 0;
  margin: 12px;
  border-radius: 4px;
}
</style>
