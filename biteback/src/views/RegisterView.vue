<template>
    <v-app class="h-100">
        <v-container class="fill-height">
            <div class="align-self-center">
                <v-img src="/logo.svg" max-width="40%" min-width="200"></v-img>
                <v-divider thickness="2"></v-divider>

                <p class="text-subtitle-1 text-grey-darken-3">
                    Willkommen zu <b>BiteBack</b>! Du befindest dich auf einem isolierten <b>PoC</b>, den wir hier im
                    <b>LSZ Hackathon</b> aufgebaut haben.
                    Der Großteil der Features funktioniert bereits. Unten hast du die Möglichkeit deine Rolle zu wählen.
                    <b>Bist du eine Filiale oder eine Hilfsorganisation?</b>
                </p>

                <v-divider thickness="2" class="mb-2"></v-divider>

                <div class="d-flex justify-center flex-xl-row flex-lg-row flex-md-row flex-sm-column flex-column">
                    <v-card color="red-lighten-1" variant="tonal" class="ma-1 flex-grow-1">
                        <v-card-item>
                            <div>
                                <div class="text-overline mb-1">Rolle</div>
                                <div class="text-h6 mb-1">Filiale</div>
                                <div class="text-caption">Du verkaufst verderbliche Produkte? Dann hier lang!</div>
                            </div>
                        </v-card-item>

                        <v-card-actions>
                            <v-btn @click="state.mode = STORE_OWNER">Testen</v-btn>
                        </v-card-actions>
                    </v-card>
                    <v-card color="red-lighten-1" variant="tonal" class="ma-1 flex-grow-1">
                        <v-card-item>
                            <div>
                                <div class="text-overline mb-1">Rolle</div>
                                <div class="text-h6 mb-1">Hilfsorgansiation</div>
                                <div class="text-caption">Du sammelst verderbliche Produkte? Dann hier lang!</div>
                            </div>
                        </v-card-item>

                        <v-card-actions>
                            <v-btn @click="state.mode = DRIVER">Testen</v-btn>
                        </v-card-actions>
                    </v-card>
                    <v-card color="amber-darken-1" variant="tonal" class="ma-1 flex-grow-1">
                        <v-card-item>
                            <div>
                                <div class="text-overline mb-1">Separat | Schulprojekt</div>
                                <div class="text-h6 mb-1">PowerBI</div>
                                <div class="text-caption">Du bist Prof. Niklas? Dann hier lang!</div>
                            </div>
                        </v-card-item>

                        <v-card-actions>
                            <v-btn to="/powerbi">Testen</v-btn>
                        </v-card-actions>
                    </v-card>
                </div>
            </div>
        </v-container>
    </v-app>
</template>

<script setup>
import { state, STORE_OWNER, DRIVER } from '@/store/index.js';

</script>