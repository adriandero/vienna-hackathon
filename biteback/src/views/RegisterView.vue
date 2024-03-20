<template>
    <v-btn variant="tonal" @click="state.mode = STORE_OWNER">Filiale</v-btn>
    <v-btn variant="tonal" @click="state.mode = DRIVER">Hilfsorganisation</v-btn>
</template>

<script setup>
import { state, STORE_OWNER, DRIVER } from '@/store/index.js';

</script>