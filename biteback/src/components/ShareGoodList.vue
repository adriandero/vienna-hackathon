<template>
  <!-- todo: extract to separate components -->
  <v-dialog v-model="co2dialog">
    <CO2Calculator :co2="totalCo2" />
  </v-dialog>
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
        <v-btn variant="tonal" class="me-auto" :text="manualEntryFormVisible ? 'Scan' : 'Manuelle Eingabe'" @click="manualEntryFormVisible = !manualEntryFormVisible"></v-btn>
        <v-btn variant="tonal" color="red-lighten-1" text="Abbruch" @click="scanDialog = false"></v-btn>
        <v-btn v-if="scanResult === null && manualEntryFormVisible == false" variant="tonal" color="green-lighten-1" text="Start"
          @click="startScanning()"></v-btn>
        <v-btn v-if="scanResult !== null && manualEntryFormVisible == false" variant="tonal" color="green-lighten-1" text="Weiter"
          @click="createProduct()"></v-btn>
      </template>

      <div v-if="!manualEntryFormVisible" class="mx-5 text-center d-block">
        <v-select v-model="selectedCam" :items="cameras" label="Kamera"></v-select>
        <video id="video" width="80%" height="200" style="border: 1px solid gray"></video>
        <p v-if="scanResult !== null" class="font-weight-bold">Code: <span class="text-color-green-lighten-1">{{
          scanResult
        }}</span></p>
      </div>

      <!-- Manual Entry Form -->
      <div v-if="manualEntryFormVisible" class="mx-5 text-center d-block">
        <v-text-field v-model="productCode" label="Product Code"></v-text-field>
        <v-btn variant="tonal" color="green-lighten-1" text="Manuelle Eingabe Übernehmen" @click="saveManualProduct()"></v-btn>
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
        <v-btn variant="tonal" color="green-lighten-1" text="Ja" @click="saveProduct()"></v-btn>
      </template>

      <div v-if="scannedProduct !== null" class="mx-5 text-center d-block">
        <img class="align-self-cente" max-width="80%" max-height="80%" :src="scannedProduct.image_url"></img>

        <div>
          {{ scannedProduct.brands ?? '' }} {{ scannedProduct.product_name ?? '<unknown>' }}
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
          Abholprozesse zu optimieren, ist jedoch keine Voraussetzung. <b>Nutze das "Scan" Symbol unten um Lebensmittel
            einzutragen.</b>
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
      <v-btn class="pa-0 mx-2" density="compact" variant="text" @click="co2dialog = true">
        <span class="text-caption text-grey-darken-3">{{ totalCo2.toFixed(2) }}kg Co₂</span>
        <v-icon icon="mdi-help"></v-icon>
      </v-btn>

      <v-btn color="green-lighten-1" icon="mdi-qrcode-scan" variant="tonal" @click="scanDialog = true"></v-btn>
    </div>
  </v-footer>
</template>

<script setup>
import PickupGoodsToggle from '@/components/PickupGoodsToggle.vue';
import { state } from '@/store/index.js';
import { BrowserMultiFormatReader, NotFoundException, BarcodeFormat, DecodeHintType } from '@zxing/library';
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';

let codeReader = new BrowserMultiFormatReader()

const formats = [BarcodeFormat.UPC_A, BarcodeFormat.UPC_E, BarcodeFormat.EAN_13, BarcodeFormat.EAN_8]
const hints = new Map()

hints.set(DecodeHintType.POSSIBLE_FORMATS, formats)
hints.set(DecodeHintType.TRY_HARDER, true)

const scanDialog = ref(false);
const co2dialog = ref(false);
const cameras = ref([]);
const selectedCam = ref(null);
const scanResult = ref(null);

const manualEntryFormVisible = ref(false);
const productCode = ref('');

const productDialog = ref(false);
const scannedProduct = ref(null);

const totalCo2 = ref(0);

function updateTotalCo2() {
  totalCo2.value = state.products.reduce((acc, product) => acc + (product.kcal / 2390) * 10 + 1, 0);
}

onMounted(() => updateTotalCo2())

codeReader.listVideoInputDevices().then(devices => {
  console.log(JSON.stringify(devices));
  cameras.value = devices.filter(device => device.kind == "videoinput").map(device => device.label);
  selectedCam.value = cameras.value[0];
}).catch(error => {
  alert('Camera Load ' + error); // todo: handle error
});

function deleteProduct(index) {
  state.products.splice(index, 1);
  updateTotalCo2(); // todo: dirty fix
}

watch(scanDialog, (value) => {
  if (!value) {
    codeReader.reset();
    scanResult.value = null;

    codeReader = new BrowserMultiFormatReader();
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
      });
  });
}

function createProduct() {
  scanDialog.value = false;

  // make GET: https://world.openfoodfacts.org/api/v0/product/CODE.json

  axios.get('https://world.openfoodfacts.org/api/v0/product/' + scanResult.value + '.json')
    .then(response => {
      if (response.data.product === undefined) {
        alert('Produkt nicht in der internationalen Datenbank. Versuche ein anderes Produkt zu scannen oder gebe es manuell ein.');
        return;
      }
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
    kcal: (scannedProduct.value.nutriments['energy-kj'] / 4.184),
    description: scannedProduct.value._keywords.toString()
  });

  

  updateTotalCo2(); // todo: dirty fix
  productDialog.value = false;
}

function saveManualProduct() {
  scanResult.value = productCode.value
  createProduct()
  this.manualEntryFormVisible = false;
  productCode.value = ""  
}

</script>
<script>
import CO2Calculator from '@/components/StatsDialog.vue';

export default {
  components: {
    CO2Calculator
  }
};
</script>