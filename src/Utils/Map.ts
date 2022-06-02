import L from 'leaflet'
import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet/dist/leaflet.css'

export let MapObj: LeafletMap | undefined

export const setMapObj = (obj: LeafletMap | undefined) => {
  if (obj instanceof LeafletMap || obj === undefined) {
    MapObj = obj
    return true
  }
  return false
}

export default class LeafletMap {
  map: L.DrawMap;
  center: [number, number];
  drawControl: L.Control.Draw
  polygonDrawer: L.Draw.Rectangle
  layers: L.Layer[] = []

  constructor(container: string, options?: {
    center?: [number, number]
  }) {
    if (document.querySelector(container)?.children.length) throw Error('already initialized')
    this.center = options?.center ?? [30, 120]
    this.map = L.map(container, {
      center: this.center,
      zoom: 4,
      renderer: L.canvas(),
    })
    this.map.setView(this.center)
    this.drawControl = new L.Control.Draw({
      position: 'topright',
    }).addTo(this.map)
    this.polygonDrawer = new L.Draw.Polygon(this.map)
    this.initMap()
  }

  initMap() {
    L.tileLayer('https://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
      minZoom: 1,
      maxZoom: 16,
      attribution: '© Amap'
    }).addTo(this.map)
    this.map.zoomControl.setPosition('topright')
    this.map.on(L.Draw.Event.CREATED, e => {
      this.addLayer(e.layer)
    })
  }

  drawRectangle() {
    this.removeAllLayers()
    this.polygonDrawer.enable()
  }

  stopDrawRectangle() {
    this.polygonDrawer.disable()
  }

  addLayer(layer: L.Layer) {
    this.map.addLayer(layer)
    this.layers.push(layer)
  }

  removeAllLayers() {
    this.layers.forEach(layer => this.map.removeLayer(layer))
  }

  addGeoJson(geojson: GeoJSON.GeoJSON) {
    const geojsonMarkerOptions = {
      radius: 8,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }
    const layer = L.geoJSON(geojson, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(`<pre>${JSON.stringify(feature.properties, null, 2)}</pre>`)
      }
    })
    this.addLayer(layer)
  }

  destory() {
    this.map.remove()
  }
}