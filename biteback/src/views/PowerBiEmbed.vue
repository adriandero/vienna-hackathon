<template>
    <v-app class="bg-grey-lighten-5">
        <v-app-bar :elevation="0">
            <template v-slot:prepend>
                <v-app-bar-nav-icon icon="mdi-arrow-left" to="/"></v-app-bar-nav-icon>
            </template>

            <v-app-bar-title>PowerBI Projekt, Felix Kunaver & Dominik Fluch</v-app-bar-title>

            <template v-slot:append>
                <v-img width="100" height="auto" src="/logo.svg"></v-img>
            </template>
        </v-app-bar>
        <iframe style="padding-top: 64px;" title="DisasterData" width="100%" height="100%"
            src="https://app.powerbi.com/reportEmbed?reportId=72fb56f8-3b95-4c90-8a34-521b92ba9e1d&autoAuth=true&ctid=c61e66aa-01c3-4775-a319-71a07f3c67a4"
            frameborder="0" allowFullScreen="true"></iframe>
    </v-app>
</template>