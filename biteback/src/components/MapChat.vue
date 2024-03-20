<template>
  <div class="map-container">
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script>
import * as turf from '@turf/turf'
import mapboxgl from 'mapbox-gl'

export default {
  props: {
    shopNumber: Number
  },
  data() {
    return {
      truckLocation: [16.399334803053133, 48.223950647912446], // Initial truck location,
      charityLocation: [16.38743271601089, 48.222201370103164], // Initial truck location

      possibleMarkers: [
        { coordinates: [16.384180198441587, 48.217857173410586], name: 'Billa' },
        { coordinates: [16.411282619060376, 48.21241924127161], name: 'Billa' },
        { coordinates: [16.39961940110769, 48.22636510223389], name: 'Penny' },
        { coordinates: [16.405880131204587, 48.22494448995453], name: 'Penny' },
        { coordinates: [16.39254569985874, 48.21084718356092], name: 'Billa' },
        { coordinates: [16.39230698341627, 48.21905963174383], name: 'Billa' },
        { coordinates: [16.39765137777517, 48.21935054476111], name: 'Billa' }
      ],

      chosenMarkers: [],
      chosenMarkersName: [],
      minTime: Infinity,
      markers: [],
      sorted: [],
      start: null // Array to store marker objects
    }
  },
  mounted() {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiYWRyaWFuZGVybyIsImEiOiJjbHR5ZGt6Y2IwamlkMnFsYWp6ZjljOTF4In0.B5z6NbiJ2mAeuw6JzYWELA'

    const map = new mapboxgl.Map({
      container: this.$refs.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.truckLocation,
      zoom: 13
    })

    map.on('load', () => {
      // Add marker for the truck location
      this.addMarker(this.truckLocation, 'You', 'truck')
      this.addMarker(this.charityLocation, 'Charity', 'charity')
      this.createRoute(this.$props.shopNumber)
    })

    map.on('click', (event) => {
      //  const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key])
      //  const markerName = `Marker ${this.markers.length + 1}`
      // this.addBetweenMarker(coords, markerName, 'shop')
      // console.log(this.markers)
      console.log(this.$props.shopNumber)
    })

    this.map = map
  },
  watch: {
    shopNumber: function (newVal, oldVal) {
      // watch it
      console.log('Prop changed: ', newVal, ' | was: ', oldVal)

      this.createRoute(this.$props.shopNumber)
    }
  },
  methods: {
    createRoute(numberOfShops) {
      this.chooseRandomMarkers(numberOfShops)

      for (let i = 0; i < this.chosenMarkers.length; i++) {
        this.addBetweenMarker(this.chosenMarkers[i].coordinates, this.chosenMarkers[i].name, 'shop')
      }
    },
    addMarker(coordinates, title, className) {
      let markerElement = null
      //   if (className == 'truck') {
      //     markerElement = document.createElement('img')
      //     markerElement.className = className
      //     markerElement.src = 'public/shop.png' // Set the image source
      //   } else {
      markerElement = document.createElement('div')
      markerElement.className = className
      //   }

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${title}</h3>`))
        .addTo(this.map)

      this.markers.push(marker)
    },
    addBetweenMarker(coordinates, title, className) {
      const lastMarker = this.markers[this.markers.length - 1] // Get the last marker in the list
      const markerElement = document.createElement('div')
      markerElement.className = className

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${title}</h3>`))
        .addTo(this.map)

      this.markers.splice(this.markers.length - 1, 0, marker)
      //this.sort(this.markers[0], this.markers, this.sorted)
      this.sortMarkers()
      console.log(this.markers)
      this.getRoute()
    },

    sortMarkers() {
      this.markers.sort((a, b) => {
        // Extract longitudes from marker LngLat and compare
        const lngA = a.getLngLat().lng
        const lngB = b.getLngLat().lng
        return lngA - lngB
      })
    },
    chooseRandomMarkers(num) {
      const possibleMarkers = this.possibleMarkers

      // Shuffle possibleMarkers array
      const shuffledMarkers = possibleMarkers.sort(() => Math.random() - 0.5)

      // Choose num markers from shuffledMarkers
      for (let i = 0; i < num; i++) {
        this.chosenMarkers.push(shuffledMarkers[i])
      }
    },

    sort(start, markers, sorted) {
      let currentBest = null
      let next = null

      for (let i = 0; i < markers.length; i++) {
        let other = markers[i]
        console.log(other)
        let distanceDiff =
          Math.abs(start.getLngLat().lat - other.getLngLat().lat) +
          Math.abs(start.getLngLat().lng - other.getLngLat().lng)
        if (currentBest === null || distanceDiff < currentBest) {
          currentBest = distanceDiff
          next = other
          console.log(next)
        }
      }
      // Remove start from markers
      markers.splice(markers.indexOf(start), 1)
      sorted.push(start)

      console.log(this.sorted)

      if (next !== null) this.sort(next, markers, sorted)
      else this.markers = sorted
    },

    async getRoute() {
      const stops = this.markers.map((marker) => marker.getLngLat())

      const waypoints = stops.map((stop) => `${stop.lng},${stop.lat}`).join(';')

      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${this.truckLocation[0]},${this.truckLocation[1]};${waypoints}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
      )

      const json = await query.json()
      const routes = json.routes

      routes.forEach((routeData, index) => {
        const duration = routeData.duration // Get the duration of the route in seconds
        if (duration < this.minTime) {
          this.minTime = (duration / 60 / 60) * 100 // Update minTime if a new minimum duration is found
        }
        console.log(this.minTime)
        const route = routeData.geometry.coordinates
        const geojson = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route
          }
        }

        if (this.map.getSource(`route${index}`)) {
          this.map.getSource(`route${index}`).setData(geojson)
        } else {
          this.map.addLayer({
            id: `route${index}`,
            type: 'line',
            source: {
              type: 'geojson',
              data: geojson
            },
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#ed666a',
              'line-width': 5,
              'line-opacity': 0.75
            }
          })
        }
      })
    }
  }
}
</script>

<style>
.map-container {
  height: 100vh;
  width: 100%;
}
.shop {
  width: 15px;
  height: 15px;
  background-color: #ed666a; /* Color of the dot */
  border-radius: 50%; /* Make it a circle */
  border: 2px solid #fff; /* Optional: Add border */
}
.charity {
  width: 15px;
  height: 15px;
  background-color: #495057; /* Color of the dot */
  border-radius: 50%; /* Make it a circle */
  border: 2px solid #fff; /* Optional: Add border */
}
.truck {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 15px solid #495057; /* Color of the triangle */
  border-radius: 25%;
  transform: rotate(180deg); /* Rotate the triangle to face down */
  border-bottom: 2px solid #495057; /* Optional: Add border */
}
</style>
