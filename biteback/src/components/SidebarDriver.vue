<template>
  <v-navigation-drawer v-model="drawer" floating :temporary="$vuetify.display.mobile">
    <v-list nav>
      <v-list-item density="comfortable" v-if="!$vuetify.display.mobile">
        <v-img src="/logo.svg"></v-img>
        <v-divider thickness="2"></v-divider>
      </v-list-item>
    </v-list>

    <div class="px-2 pt-2">
      <v-text-field
        v-model="numberOfShops"
        class="text-sm"
        label="Anzahl an Filialen"
        variant="outlined"
        type="number"
        persistent-hint
        density="compact"
        :rules="[rules.max, rules.min]"
      ></v-text-field>
      <v-btn
        @click="confirmNumberOfShops"
        color="grey-darken-3"
        style="color: black; margin-top: -15px"
        density="comfortable"
        variant="tonal"
        :disabled="buttonDisabled"
        block
        >bestätigen</v-btn
      >
      <p v-if="buttonDisabled" class="mt-1 text-caption text-red-lighten-1">Route wurde erstellt</p>
    </div>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn color="red-lighten-1" prepend-icon="mdi-logout-variant" variant="tonal" block
          >Abmelden</v-btn
        >
      </div>
    </template>
  </v-navigation-drawer>

  <v-app-bar elevation="0" v-if="$vuetify.display.mobile">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </template>

    <template v-slot:append>
      <v-img width="100" height="auto" src="/logo.svg"></v-img>
    </template>
  </v-app-bar>
</template>

<script setup>
import { ref, defineProps, onBeforeMount } from 'vue'

const props = defineProps({
  items: Array
})

const selection = ref(null)
const drawer = ref(null)
const numberOfShops = ref(null)

const buttonDisabled = ref(false) // Added to track the button's disabled state

onBeforeMount(() => {
  selection.value = props.items[0].value
})

const emit = defineEmits(['update', 'confirmNumberOfShops'])

function selectItem(item) {
  selection.value = item.value

  emit('update', item.value)
}

const rules = {
  min: (value) => value >= 0,
  max: (value) => value <= 7 || 'Momentan 7 Filialen verfügbar'
}

function confirmNumberOfShops() {
  if (numberOfShops.value > 0 && numberOfShops.value <= 7) {
    // Value is within the acceptable range, save it or emit an event to notify other components
    // For example, you can emit an event to the parent component
    emit('confirmNumberOfShops', numberOfShops.value)
    buttonDisabled.value = true
  } else {
    // Notify the user that the value is not within the acceptable range
    // For example, you can display a snackbar or a message
    console.log('Please enter a value between 0 and 7.')
  }
}
</script>
