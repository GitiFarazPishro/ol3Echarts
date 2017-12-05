import ol from 'openlayers'
import echarts from 'echarts'
import echartsGL from 'echarts-gl'
const componentPostEffectMixin = echartsGL.common.componentPostEffectMixin
const componentLightMixin = echartsGL.common.componentLightMixin

let MAP_OPTION = ['zoom', 'rotation', 'center', 'extent', 'projection', 'tileSize']
const olModel = echarts.extendComponentModel({
  type: 'openlayers',
  layoutMode: 'box',
  coordinateSystem: null,
  defaultOption: {
    view: new ol.View({
      center: [113.53450137499999, 34.44104525],
      projection: 'EPSG:4326',
      zoom: 5, // resolution
      rotation: 0
    }),
    layers: [
      new ol.layer.Tile({
        preload: 4,
        source: new ol.source.OSM({
          url: 'https://s{1-5}.geohey.com/s/mapping/midnight/all?x={x}&y={y}&z={z}&retina=&ak=ZmI0YmI5MWE4NjEyNDlkNTkxY2NmNmQ1NDYwOWI5ZmU'
        })
      })
    ],
    loadTilesWhileAnimating: false,
    loadTilesWhileInteracting: false
  },

  /**
   * get map option
   * @returns {string|{}}
   */
  getMapOption: function () {
    const self = this
    return MAP_OPTION.reduce(function (obj, key) {
      obj[key] = self.get(key)
      return obj
    }, {})
  },

  /**
   * set map option
   * @param option
   */
  setMapOption: function (option) {
    if (option != null) {
      MAP_OPTION.forEach(function (key) {
        if (option[key] != null) {
          this.option[key] = option[key]
        }
      }, this)
    }
  },

  /**
   * Get map instance
   * @returns {*}
   */
  getMap: function () {
    return this.$Map
  },

  /**
   * set map instance
   * @param map
   */
  setMap: function (map) {
    this.$Map = map
  }
})
echarts.util.merge(olModel.prototype, componentPostEffectMixin)
echarts.util.merge(olModel.prototype, componentLightMixin)
export default olModel
