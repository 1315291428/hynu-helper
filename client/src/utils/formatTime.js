export function timeFormat(time) {
	var date = getDate(time)
	var date_seconds = date.getTime() / 1000
	var now = getDate()
	var now_seconds = now.getTime() / 1000
	var timestamp = now_seconds - date_seconds
	var timeStr = ''
	if (timestamp < 60) {
		timeStr = '刚刚'
	} else if (timestamp >= 60 && timestamp < 60 * 60) {
		var minutes = parseInt(timestamp / 60)
		timeStr = minutes + '分钟前'
	} else if (timestamp >= 60 * 60 && timestamp < 60 * 60 * 24) {
		var hours = parseInt(timestamp / 60 / 60)
		timeStr = hours + '小时前'
	} else if (timestamp >= 60 * 60 * 24 && timestamp < 60 * 60 * 24 * 30) {
		var days = parseInt(timestamp / 60 / 60 / 24)
		timeStr = days + '天前'
	} else {
		var year = date.getFullYear()
		var month = date.getMonth() + 1
		var day = date.getDate()
		var hour = date.getHours()
		var minute = date.getMinutes()
		timeStr = year + '/' + month + '/' + day + ' ' + hour + ':' + minute
	}
	return timeStr
}

