import echarts from 'echarts'
import echartsGL from 'echarts-gl'
import OpenlayersGL from './openlayersGL/OpenlayersGL'
const retrieve = echartsGL.util.retrieve
const graphicGL = echartsGL.util.graphicGL
const ViewGL = echartsGL.core.ViewGL

function resizeMapbox (mapboxModel, api) {
  var width = api.getWidth();
  var height = api.getHeight();
  var dpr = api.getDevicePixelRatio();
  this.viewGL.setViewport(0, 0, width, height, dpr);

  this.width = width;
  this.height = height;

  this.altitudeScale = mapboxModel.get('altitudeScale');

  this.boxHeight = mapboxModel.get('boxHeight');
  // this.updateTransform();
}

function updateMapbox (ecModel, api) {

  if (this.model.get('boxHeight') === 'auto') {
    return;
  }

  var altitudeDataExtent = [Infinity, -Infinity]

  ecModel.eachSeries(function (seriesModel) {
    if (seriesModel.coordinateSystem !== this) {
      return;
    }

    // Get altitude data extent.
    var data = seriesModel.getData();
    var altDim = seriesModel.coordDimToDataDim('alt')[0];
    if (altDim) {
      // TODO altitiude is in coords of lines.
      var dataExtent = data.getDataExtent(altDim, true);
      altitudeDataExtent[0] = Math.min(
        altitudeDataExtent[0], dataExtent[0]
      );
      altitudeDataExtent[1] = Math.max(
        altitudeDataExtent[1], dataExtent[1]
      );
    }
  }, this);
  if (altitudeDataExtent && isFinite(altitudeDataExtent[1] - altitudeDataExtent[0])) {
    this.altitudeExtent = altitudeDataExtent;
  }
}

const olCreator = {}

olCreator.dimensions = olCreator.prototype.dimensions

/**
 * 注册实例
 * @param echartModel
 * @param api
 */
olCreator.create = function (echartModel, api) {
  let olList = []
  echartModel.eachComponent('openlayers', function (olModel) {
    let viewGL = olModel.__viewGL
    if (!viewGL) {
      viewGL = olModel.__viewGL = new ViewGL()
      viewGL.setRootNode(new graphicGL.Node())
    }
    let olCoordSys = new OpenlayersGL()
    olCoordSys.viewGL = olModel.__viewGL
    // Inject resize
    olCoordSys.resize = resizeMapbox
    olCoordSys.resize(olModel, api)
    olList.push(olCoordSys)
    olModel.coordinateSystem = olCoordSys
    olCoordSys.model = olModel
    olCoordSys.setCameraOption(olModel.getMapOption())
    olCoordSys.update = updateMapbox
  })
  echartModel.eachSeries(function (seriesModel) {
    if (seriesModel.get('coordinateSystem') === 'openlayers') {
      let olModel = seriesModel.getReferringComponents('openlayers')[0]
      if (!olModel) {
        olModel = echartModel.getComponent('openlayers')
      }
      if (!olModel) {
        throw new Error('openlayers "' + retrieve.firstNotNull(
          seriesModel.get('olIndex'),
          seriesModel.get('olId'),
          0
        ) + '" not found')
      }
      seriesModel.coordinateSystem = olModel.coordinateSystem
    }
  })
  return olList
}

echarts.registerCoordinateSystem('openlayers', olCreator)

export default olCreator
