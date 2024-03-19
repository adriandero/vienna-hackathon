<template>
    <v-main>
        <v-container>
            <v-row>
                <!-- Bar Chart -->
                <v-col cols="12" sm="12" md="6" lg="6">
                    <v-card class="chart-card">
                        <v-card-title>
                            Lebensmittel Einsparungen
                        </v-card-title>
                        <v-card-text>
                            Lebensmittel Einsparungen über die letzten Monate in Kg.
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-text>
                            <!-- Bar Chart Component -->
                            <Bar id="bar-chart" :options="barChartOptions" :data="barChartData" />
                        </v-card-text>
                    </v-card>
                </v-col>

                <!-- Line Chart -->
                <v-col cols="12" sm="12" md="6" lg="6">
                    <v-card class="chart-card">
                        <v-card-title>
                            Anzahl Abholnungen pro Monat
                        </v-card-title>
                        <v-card-text>
                            Übersicht der Anzahl an Abhlungen durch Wohltätigkeitsorganisationen
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-text>
                            <!-- Line Chart Component -->
                            <Line id="line-chart" :options="lineChartOptions" :data="lineChartData" />
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <v-row>
                <!-- Pie Chart -->
                <v-col cols="12" sm="12" md="6" lg="6">
                    <v-card class="chart-card">
                        <v-card-title>
                            Lebensmittel nach Kategorie
                        </v-card-title>
                        <v-card-text>
                            Kategorie der geretteten Lebensmittel in Prozent
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-text style="height: 500px;"> <!-- Adjust the height as needed -->
                            <!-- Pie Chart Component -->
                            <Pie id="pie-chart" :options="pieChartOptions" :data="pieChartData" />
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="6">
                    <v-card class="chart-card">
                        <v-card-title>
                            Anzahl an Produkten freigegeben
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text>
                            <!-- Bar Chart Component -->
                            <Bar id="abcdssd" :options="barChartOptions2" :data="barChartData2" />
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>

<script>
import { Bar, Line, Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement, ArcElement)

export default {
    components: { Bar, Line, Pie },
    data() {
        return {
            barChartData: {
                labels: ['Jan.', 'Feb.', 'März'],
                datasets: [{ label: 'Kg. Essen', backgroundColor: '#f87979', data: [200, 180, 320] }]
            },
            barChartOptions: {
                responsive: true
            },
            barChartData2: {
                labels: ['Mo.', 'Di.', 'Mi', 'Do.', 'Fr.', 'Sa.', 'So.'],
                datasets: [{ label: '', backgroundColor: '#3e95cd', data: [3, 5, 4, 9, 10, 3, 0] }]
            },
            barChartOptions2: {
                responsive: true
            },
            lineChartData: {
                labels: ['Jan.', 'Feb.', 'März'],
                datasets: [{ label: 'Abholungen', borderColor: '#3e95cd', data: [6, 9, 10] }]
            },
            lineChartOptions: {
                responsive: true
            },
            pieChartData: {
                labels: ['Brot', 'Fleisch', 'Obst', 'Gemüse'],
                datasets: [{ backgroundColor: ['#a86f32', '#f87979', '#bad448', '#32a852'], data: [30, 25, 15, 30] }]
            },
            pieChartOptions: {
                responsive: true
            }
        }
    }
}
</script>

<style scoped>
.chart-card {
    margin-bottom: 20px;
}
</style>