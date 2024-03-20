<template>
  <div id="layout">
    <div id="sidebar">
      <div>Longitude: -71.224518 | Latitude: 42.213995 | Zoom: 9</div>
      <div>Longitude: -71.224518 | Latitude: 42.213995 | Zoom: 9</div>
      <div>Longitude: -71.224518 | Latitude: 42.213995 | Zoom: 9</div>
    </div>

    <Map />
  </div>
</template>

<script>
import Map from '../components/Map1.vue'
import '../../node_modules/mapbox-gl/dist/mapbox-gl.css'

export default {
  components: {
    Map
  }
}
</script>

<style>
#layout {
  display: flex;
  height: 100vh;
  width: 100%;
}
#sidebar {
  background-color: #f8f9fa;
  color: #495057;
  padding: 6px 12px;
  font-family: monospace;
  z-index: 1;
  position: absolute;
  top: 0;
  right: 0;
  margin: 12px;
  border-radius: 4px;
}
</style>
