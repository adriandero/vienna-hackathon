<template>
  <!-- todo: extract to separate components -->
  <v-dialog v-model="scanDialog">
    <v-card class="align-self-center">
      <template v-slot:prepend>
        <v-icon color="red-lighten-1" icon="mdi-qrcode-scan"></v-icon>
      </template>
      <template v-slot:title><span class="font-weight-bold">Strichcode Scannen</span></template>
      <template v-slot:text>
        <p class="text-caption text-grey-darken-3">Füge ein Produkt zur Liste hinzu, indem du den Strichcode des
          Produkts scannst.</p>
      </template>

      <template v-slot:actions>
        <v-btn variant="tonal" class="me-auto" text="Manuelle Eingabe" disabled></v-btn>
        <v-btn variant="tonal" color="red-lighten-1" text="Abbruch" @click="scanDialog = false"></v-btn>
        <v-btn v-if="scanResult === null" variant="tonal" color="green-lighten-1" text="Start"
          @click="startScanning()"></v-btn>
        <v-btn v-if="scanResult !== null" variant="tonal" color="green-lighten-1" text="Weiter"
          @click="createProduct()"></v-btn>
      </template>

      <div class="mx-5 text-center d-block">
        <!-- <v-select v-model="selectedCam" :items="cameras" label="Kamera">
          <template v-slot:item="{ item }">
            <v-list-item-title>{{ item.value.label }}</v-list-item-title>
          </template>
        </v-select> -->
        <v-select v-model="selectedCam" :items="cameras" label="Kamera"></v-select>
        <video id="video" width="80%" height="200" style="border: 1px solid gray"></video>
        <p v-if="scanResult !== null" class="font-weight-bold">Code: <span class="text-color-green-lighten-1">{{ scanResult }}</span></p>
      </div>
    </v-card>
  </v-dialog>
  <v-dialog v-model="productDialog">
    <v-card class="align-self-center">
      <template v-slot:prepend>
        <v-icon color="red-lighten-1" icon="mdi-qrcode-scan"></v-icon>
      </template>
      <template v-slot:title><span class="font-weight-bold">Ist das das Produkt?</span></template>
      <template v-slot:text>
        <p class="text-caption text-grey-darken-3">Überprüfe die Daten falls notwending.</p>
      </template>

      <template v-slot:actions>
        <v-btn variant="tonal" class="me-auto" text="Manuelle Eingabe" disabled></v-btn>
        <v-btn variant="tonal" color="red-lighten-1" text="Abbruch" @click="productDialog = false"></v-btn>
        <v-btn variant="tonal" color="green-lighten-1" text="Ja"
          @click="saveProduct()"></v-btn>
      </template>

      <div class="mx-5 text-center d-block">
        <img class="align-self-cente" max-width="80%" max-height="80%" :src="scannedProduct.image_url"></img>

        <div>
          {{ scannedProduct.brands }} {{ scannedProduct.product_name }}
        </div>
      </div>
    </v-card>
  </v-dialog>

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
            <v-icon v-if="product.img === null" color="white" icon="mdi-food-variant"></v-icon>
            <v-img v-else :src="product.img"></v-img>
          </v-avatar>
        </template>

        <template v-slot:append>
          <v-btn variant="tonal" color="red-lighten-1" icon="mdi-delete" @click="deleteProduct(index)"></v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-main>
  <v-footer class="bg-transparent" app>
    <div class="d-flex align-center w-100 bg-white rounded-lg px-2"
      :class="{ 'elevation-10': state.products.length > 5 }">
      <PickupGoodsToggle class="flex-fill"></PickupGoodsToggle>

      <v-btn color="green-lighten-1" icon="mdi-qrcode-scan" variant="tonal" @click="scanDialog = true"></v-btn>
    </div>
  </v-footer>
</template>

<script setup>
import PickupGoodsToggle from '@/components/PickupGoodsToggle.vue';
import { state } from '@/store/index.js';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { ref, watch } from 'vue';
import axios from 'axios';

const codeReader = new BrowserMultiFormatReader()
const scanDialog = ref(false);
const cameras = ref([]);
const selectedCam = ref(null);
const scanResult = ref(null);

const productDialog = ref(false);
const scannedProduct = ref(null);

codeReader.listVideoInputDevices().then(devices => {
  cameras.value = devices.filter(device => device.kind == "videoinput").map(device => device.label);
  selectedCam.value = cameras.value[0];
}).catch(error => {
  alert('Camera Load ' + error); // todo: handle error
});

function deleteProduct(index) {
  state.products.splice(index, 1);
}

watch(scanDialog, (value) => {
  if (!value) {
    codeReader.reset();
    scanResult.value = null;
  }
})

function startScanning() {
  // TODO: fix dirty fix:
  codeReader.listVideoInputDevices().then(devices => {
    const id = devices.filter(device => device.label === selectedCam.value)[0].deviceId;

    codeReader.decodeFromVideoDevice(id, 'video', (result, error) => {
      if (result) {
        scanResult.value = result.text;
      }

      if (error && !(error instanceof NotFoundException)) {
        scanResult.value = error
      }
    })
  });
}

function createProduct() {
  scanDialog.value = false;

  // make GET: https://world.openfoodfacts.org/api/v0/product/CODE.json

  axios.get('https://world.openfoodfacts.org/api/v0/product/' + scanResult.value + '.json')
    .then(response => {
      const product = response.data.product;
      scannedProduct.value = product;
      productDialog.value = true;
    })
    .catch(error => {
      alert('Product Load ' + error); // todo: handle error
    });
}

function saveProduct() {
  state.products.push({
    name: scannedProduct.value.brands + ' ' + scannedProduct.value.product_name,
    img: scannedProduct.value.image_url,
    description: scannedProduct.value._keywords.toString()
  });

  productDialog.value = false;
}
</script>