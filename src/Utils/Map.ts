import L, { LeafletEventHandlerFn } from 'leaflet'
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
  rectAngelDrawer: L.Draw.Rectangle
  layers: L.Layer[] = []
  private _rectDrawCallback?: L.LeafletEventHandlerFn

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
    this.rectAngelDrawer = new L.Draw.Rectangle(this.map)
    this.initMap()
  }

  initMap() {
    L.tileLayer('https://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
      minZoom: 1,
      maxZoom: 16,
      attribution: '© Amap'
    }).addTo(this.map)
    this.map.zoomControl.setPosition('topright')
  }

  drawRectangle() {
    this.rectAngelDrawer.enable()
  }

  stopDrawRectangle() {
    this.rectAngelDrawer.disable()
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
    }).addTo(this.map)
    this.layers.push(layer)
  }

  destory() {
    this.map.remove()
  }
}