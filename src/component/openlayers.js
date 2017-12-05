import echarts from 'echarts'
import '../coordinate/olCreator'
import './openlayers/olModel'
import './openlayers/olView'

echarts.registerAction({
  type: 'MapRoam',
  event: 'MapRoam',
  update: 'updateLayout'
}, function (payload, ecModel) {
  ecModel.eachComponent('openlayers', function (mapModel) {
    mapModel.setMapOption(payload)
  })
})
