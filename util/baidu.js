const URI = 'https://api.map.baidu.com'
const fetch = require('./fetch')

function fetchApi(type, params) {
	return fetch(URI, type, params)
}

/**
 * 根据经纬度获取城市名
 * @param  {Number} latitude  经度
 * @param  {Number} longitude 纬度
 * @return {Promise}          包含抓取任务的Promise
 */
function getCityName(latitude = 39.90403, longitude = 116.407526) {
	const params = {location : `${latitude},${longitude}`, output: 'json',ak:'OeLYIojAc8I65mcVAQYPt6vy48TGdXY6' }
	console.log('latitude'+latitude+'  '+'longitude'+longitude)
	return fetchApi('geocoder/v2/', params)
	     .then(res => res.data.result.addressComponent.city)
}
function getCity(latitude = 39.90403, longitude = 116.407526) {
  const params = {location : `${latitude},${longitude}`, output: 'json',ak:'OeLYIojAc8I65mcVAQYPt6vy48TGdXY6' }
  console.log('latitude'+latitude+'  '+'longitude'+longitude)
  return fetchApi('geocoder/v2/', params)
       .then(res => res.data.result)
}
module.exports = {getCityName, getCity}