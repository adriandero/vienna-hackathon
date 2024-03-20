<template>
  <v-navigation-drawer v-model="drawer" floating :temporary="$vuetify.display.mobile">
    <v-list nav>
      <v-list-item density="comfortable" v-if="!$vuetify.display.mobile">
        <v-img src="/logo.svg"></v-img>
        <v-divider thickness="2"></v-divider>
      </v-list-item>

      <template v-for="item in items" :key="item.value">
        <v-list-item :active="selection === item.value" :value="item.value" @click="selectItem(item)">
          <v-list-item-title class="font-weight-bold">{{ item.title }}</v-list-item-title>
          <template v-slot:prepend>
            <v-icon slot="prependIcon" large :color="selection === item.value ? 'red-lighten-1' : null"
              :icon="item.icon" />
          </template>
        </v-list-item>
      </template>

    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn color="red-lighten-1" prepend-icon="mdi-logout-variant" variant="tonal" block>Abmelden</v-btn>
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
import { ref, defineProps, onBeforeMount } from 'vue';

const props = defineProps({
  items: Array
});

const selection = ref(null);
const drawer = ref(null);

onBeforeMount(() => {
  selection.value = props.items[0].value;
});

const emit = defineEmits(['update']);

function selectItem(item) {
  selection.value = item.value;

  emit('update', item.value);
}
</script>


