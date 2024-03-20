<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script>
import * as turf from '@turf/turf'
import mapboxgl from 'mapbox-gl'
mapboxgl.accessToken =
  'pk.eyJ1IjoiYWRyaWFuZGVybyIsImEiOiJjbHR5ZGt6Y2IwamlkMnFsYWp6ZjljOTF4In0.B5z6NbiJ2mAeuw6JzYWELA'

export default {
  mounted() {
    const truckLocation = [16.399277, 48.22467]
    const charityLocation = [16.40013, 48.225155]

    const warehouseLocation = [-83.083, 42.363]
    const lastAtRestaurant = 0
    let keepTrack = []
    const pointHopper = {}
    const warehouse = turf.featureCollection([turf.point(warehouseLocation)])

    const map = new mapboxgl.Map({
      container: this.$refs.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v12', // Replace with your preferred map style
      center: truckLocation,
      zoom: 13
    })

    this.map = map

    //create the markers (truck and charity)
    const truckMarker = document.createElement('div')
    truckMarker.classList = 'truck'
    new mapboxgl.Marker(truckMarker).setLngLat(truckLocation).addTo(map)

    const charityMarker = document.createElement('div')
    charityMarker.classList = 'charity'
    new mapboxgl.Marker(charityMarker).setLngLat(charityLocation).addTo(map)

    const dropoffs = turf.featureCollection([])
    const nothing = turf.featureCollection([])

    async function addWaypoints(event) {
      // When the map is clicked, add a new drop off point
      // and update the `dropoffs-symbol` layer
      await newDropoff(map.unproject(event.point))
      updateDropoffs(dropoffs)
    }

    function updateDropoffs(geojson) {
      map.getSource('dropoffs-symbol').setData(geojson)
    }
    async function newDropoff(coordinates) {
      // Store the clicked point as a new GeoJSON feature with
      // two properties: `orderTime` and `key`
      const pt = turf.point([coordinates.lng, coordinates.lat], {
        orderTime: Date.now(),
        key: Math.random()
      })
      dropoffs.features.push(pt)
    }

    async function getRoute(end) {
      // make a directions request using cycling profile
      // an arbitrary start will always be the same
      // only the end or destination will change
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/cycling/${truckLocation[0]},${truckLocation[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
      )
      const json = await query.json()
      const data = json.routes[0]
      const route = data.geometry.coordinates
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      }
      // if the route already exists on the map, we'll reset it using setData
      if (map.getSource('route')) {
        map.getSource('route').setData(geojson)
      }
      // otherwise, we'll make a new request
      else {
        map.addLayer({
          id: 'route',
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
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        })
      }
      // add turn instructions here at the end
    }

    map.on('load', async () => {
      map.loadImage('/shop.png', function (error, image) {
        if (error) throw error
        map.addImage('ahpoehf', image)
      })
      // Code from previous steps
      map.addLayer({
        id: 'dropoffs-symbol',
        type: 'symbol',
        source: {
          data: dropoffs,
          type: 'geojson'
        },
        layout: {
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
          'icon-image': 'ahpoehf',
          'icon-size': 0.3
        }
      })
      /*

      map.addSource('route', {
        type: 'geojson',
        data: nothing
      })

      map.addLayer(
        {
          id: 'routeline-active',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': ['interpolate', ['linear'], ['zoom'], 12, 3, 22, 12]
          }
        },
        'waterway-label'
      )
      */
      // Listen for a click on the map
      await map.on('click', addWaypoints)
    })
    getRoute(truckLocation)
  },

  unmounted() {
    this.map.remove()
    this.map = null
  }
}
</script>

<style>
.map-container {
  flex: 1;
}
.truck,
.charity {
  width: 20px;
  height: 20px;
  border: 2px solid #f8f9fa;
  border-radius: 50%;
  background: #ed666a;
  pointer-events: none;
}
.charity {
  background: #495057;
}
</style>
