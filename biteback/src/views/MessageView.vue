<template>
    <v-main>
      <v-container>
        <v-card :class="elevation-0">
          <v-card-title>Notifications ✉</v-card-title>
          <v-card-text>
            <v-data-table :items="messages"></v-data-table>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </template>

<script>
export default {
    data() {
        return {
            messages: [
                { Nachricht: 'Willkommen zu BiteBack! Dies ist noch ein Prototype und nutzt Test-Daten.', Datum: '20.03.24 17:00'},
                { Nachricht: 'Rotes-Kreuz hat Billa - Stuwerstraße 1/3, 1020 Wien abgeholt', Datum: '20.03.24 16:21'},
                { Nachricht: 'Filiale hat neues Produkt freigegeben', Datum: '20.03.24 15:06'  },
                // Add more messages as needed
            ]
        };
    }
};
</script>

<style scoped>
/* Add your custom styles here */
</style>