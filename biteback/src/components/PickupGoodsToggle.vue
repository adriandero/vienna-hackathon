<template>
  <div class="bg-white rounded-lg px-2">
    <v-switch v-model="model" color="green-lighten-1" hide-details inset>
      <template v-slot:label><span class="font-weight-bold text-black">Abholbereitschaft</span></template>
    </v-switch>
  </div>

</template>

<script setup>
import { ref, defineProps, onBeforeMount } from 'vue';

const model = ref(false);
</script>
