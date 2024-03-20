<template>
  <v-main>
    <v-list class="ma-4">
      <v-list-item title="Hallo!">
        <template v-slot:prepend>
          <v-avatar color="red-lighten-1">
            <v-icon color="white" icon="mdi-message-check"></v-icon>
          </v-avatar>
        </template>
        <p class="text-caption text-grey-darken-3">Willkommen zu BiteBack! Dies ist noch ein Prototype und nutzt Test-Daten. Das Grundprinzip funktioniert allerdings schon.</p>
      </v-list-item>
    </v-list>
  </v-main>
</template>

<script setup>
</script>