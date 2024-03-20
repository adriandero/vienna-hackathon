<template>
    <v-card class="ma-3 text-xs-center">
      <v-card-title>
        CO2-Info
      </v-card-title>
      <v-card-text>
        <p>{{ co2Input }} Kg. <v-icon size="30" color="black" icon="mdi-molecule-co2"></v-icon>
             = {{ trees() }} <v-icon size="30" color="green" icon="mdi-tree"></v-icon>pro Jahr
            = {{ wald() }} Minute(n) bis der Wiener-Wald aufgenommen hat <v-icon size="30" color="green" icon="mdi-forest"></v-icon></p>
      </v-card-text>
    </v-card>
  </template>
  
  <script>
export default {
  props: {
    co2: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      co2Input: null, // Initialize to null
    };
  },
  mounted() {
    // Initialize co2Input with the prop value after the component is mounted
    this.co2Input = this.co2.toFixed(2);
  },
  methods: {
    trees(){
        if (this.co2Input == 0) return 0;
        return Math.ceil(this.co2Input / 21);
    },
    wald(){
        if (this.co2Input == 0) return 0;
        return Math.ceil(this.co2Input / 225);
    }
  }
};
</script>
  