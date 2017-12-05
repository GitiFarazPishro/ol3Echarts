import echarts from 'echarts'
import ol from 'openlayers'

const OpenlayersGL = function (map, options = {}) {
  this.$map = map
  this.$options = options
  this._mapOffset = [0, 0]
  this.dimensions = ['lng', 'lat']
  this.projCode_ = this._getProjectionCode()
}

OpenlayersGL.prototype.dimensions = ['lng', 'lat']

/**
 * 设置地图窗口的偏移
 * @param mapOffset
 */
OpenlayersGL.prototype.setMapOffset = function (mapOffset) {
  this._mapOffset = mapOffset
}

/**
 * 跟据坐标转换成屏幕像素
 * @param coords
 * @returns {ol.Pixel}
 */
OpenlayersGL.prototype.dataToPoint = function (coords) {
  if (coords && Array.isArray(coords) && coords.length > 0) {
    coords = coords.map(function (item) {
      if (typeof item === 'string') {
        item = Number(item)
      }
      return item
    })
  }
  let source = this.$options['source'] || 'EPSG:4326'
  let destination = this.$options['destination'] || this.projCode_
  let pixel = this.$map.getPixelFromCoordinate(ol.proj.transform(coords, source, destination))
  const mapOffset = this._mapOffset
  return [pixel[0] - mapOffset[0], pixel[1] - mapOffset[1]]
}

/**
 * 获取地图视图投影
 * @returns {string}
 * @private
 */
OpenlayersGL.prototype._getProjectionCode = function () {
  let code = ''
  if (this.$map) {
    code = this.$map.getView() && this.$map.getView().getProjection().getCode()
  } else {
    code = 'EPSG:3857'
  }
  return code
}

/**
 * 跟据屏幕像素转换成坐标
 * @param pixel
 * @returns {ol.Coordinate}
 */
OpenlayersGL.prototype.pointToData = function (pixel) {
  const mapOffset = this._mapOffset
  return this.$map.getCoordinateFromPixel([pixel[0] + mapOffset[0], pixel[1] + mapOffset[1]])
}

/**
 * 获取视图矩形范围
 * @returns {*}
 */
OpenlayersGL.prototype.getViewRect = function () {
  const size = this.$map.getSize()
  return new echarts.graphic.BoundingRect(0, 0, size[0], size[1])
}

/**
 * 移动转换
 */
OpenlayersGL.prototype.getRoamTransform = function () {
  return echarts.matrix.create()
}

/**
 * get dimensions info
 * @returns {Array|[string,string]}
 */
OpenlayersGL.getDimensionsInfo = function () {
  return ['lng', 'lat']
}
