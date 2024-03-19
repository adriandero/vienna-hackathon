<template>
  <v-main>
    <div v-if="state.products.length === 0" class="d-flex justify-center align-center h-100">
      <div class="bg-white rounded-lg d-block pa-3 text-center font-weight-bold" style="max-width: 75%;">
        <v-icon size="40" color="red-lighten-1" icon="mdi-gauge-empty"></v-icon>
        <h3>Keine Lebensmittel eingetragen.</h3>
        <p class="text-caption text-grey-darken-3">
          Es sind aktuell keine Lebensmittel eingetragen, das bedeutet, dass Abholorganisationen keine nähere
          Informationen haben, welche Lebensmittel bereitstehen. Es ist wünschenswert diese Information weiterzugeben um
          Abholprozesse zu optimieren, ist jedoch keine Voraussetzung. <b>Nutze das "Scan" Symbol unten um Lebensmittel einzutragen.</b>
        </p>
      </div>
    </div>
    <v-list class="ma-4" v-for="(product, index) in state.products" v-else>
      <v-list-item :subtitle="product.description" :title="product.name">
        <template v-slot:prepend>
          <v-avatar color="grey-lighten-1">
            <v-icon color="white" icon="mdi-food-variant"></v-icon>
          </v-avatar>
        </template>

        <template v-slot:append>
          <v-btn variant="tonal" color="red-lighten-1" icon="mdi-delete" @click="deleteProduct(index)"></v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-main>

  <v-footer class="bg-transparent" app>
    <div class="d-flex align-center w-100">
      <PickupGoodsToggle class="flex-fill"></PickupGoodsToggle>

      <v-btn color="green-lighten-1" icon="mdi-qrcode-scan" variant="tonal" class="ml-2 flex-row"></v-btn>
    </div>
  </v-footer>
</template>

<script setup>
import PickupGoodsToggle from '@/components/PickupGoodsToggle.vue';
import { state } from '@/store/index.js';

function deleteProduct(index) {
  state.products.splice(index, 1);
}
</script>