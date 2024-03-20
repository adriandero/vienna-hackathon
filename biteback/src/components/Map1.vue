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

    // create a function to make a directions request
    // Update your getRoute function to accept an array of stops
    async function getRoute(stops) {
      // Construct the waypoints string for the API request
      const waypoints = stops.map((stop) => `${stop[0]},${stop[1]}`).join(';')

      // Make a directions request using the constructed waypoints
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${truckLocation[0]},${truckLocation[1]};${waypoints}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
      )

      // Handle the response
      const json = await query.json()
      const routes = json.routes
      const geojsons = []

      // Iterate over each route in the response
      routes.forEach((routeData, index) => {
        const route = routeData.geometry.coordinates
        const geojson = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route
          }
        }
        geojsons.push(geojson)

        // If the route already exists on the map, reset it using setData
        if (map.getSource(`route${index}`)) {
          map.getSource(`route${index}`).setData(geojson)
        } else {
          // Otherwise, add a new layer for the route
          map.addLayer({
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
      // add turn instructions here at the end
    }

    map.on('load', () => {
      // make an initial directions request that
      // starts and ends at the same location

      // Add starting point to the map
      map.addLayer({
        id: 'point',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: truckLocation
                }
              }
            ]
          }
        },
        paint: {
          'circle-radius': 8,
          'circle-color': '#ed666a'
        }
      })
      // this is where the code from the next step will go
    })

    map.on('click', (event) => {
      const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key])
      const end = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: coords
            }
          }
        ]
      }
      if (map.getLayer('end')) {
        map.getSource('end').setData(end)
      } else {
        map.addLayer({
          id: 'end',
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: coords
                  }
                }
              ]
            }
          },
          paint: {
            'circle-radius': 8,
            'circle-color': '#495057'
          }
        })
      }
      getRoute(coords)
    })
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
