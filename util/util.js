const formatTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() - 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}

function formatDate(source, format) {
	const o = {
		'M+': source.getMonth() + 1, //月份
		'd+':source.getDate(), //日
		'H+':source.getHours(),  // 消失
		'm+': source.getMinutes(),  //分
		's+':source.getSeconds(),  // 秒
		'q+':Math.floor((source.getMonth() + 3) / 3), //季度
		'f+': source.getMillseconds() //毫秒
	}
	if(/(y+)/.test(format)) {
		format = format.replace(RegExp.$1,(source.getFullYear() + '').substr(4 - RegExp.$1.length))
	}
	for(let k in o) {
		if(new RegExp('('+k+')').test(format)) {
			format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00'+ o[k]).substr((''+o[k]).length)))
		}
	}
	return format
}
module.exports = {
	formatTime: formatTime,
	formatDate
}