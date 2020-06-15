'use strict'

const typeOf = (v) => {
	let type = typeof v;
	if (type === 'object') {
		let s = Object.prototype.toString.apply(v);
		return s.replace(/^\[object\s+|]$/g, '').toLowerCase();
	}
	return type;
}

const formatFloat = (num, precision = 2) => {
  num = parseFloat(num)
  if (isNaN(num)) return null
  let s = parseInt(num * parseInt('1' + '0'.repeat(precision)) + 0.5).toString()
  return (s == '0') ? s :
    (s.substr(0, s.length - precision) + '.' + s.substr(s.length - precision)).replace(/^\./, '0.').replace('\.$', '')
}

const resolveToday = () => {
	return new Date().format('yyyy-MM-dd')
}
const resolveYesterday = () => {
	let d = new Date(new Date().getTime() - 1000 * 3600 * 24)
	return d.format('yyyy-MM-dd')
}
const resolveLastWeek = () => {
	let d = new Date(new Date().getTime() - 1000 * 3600 * 24 * 7)
	return d.format('yyyy-MM-dd')
}
const resolveLastMonth = () => {
	let d = new Date(new Date().getTime() - 1000 * 3600 * 24 * 30)
	return d.format('yyyy-MM-dd')
}
const resolveDay = (days) => {
  days = parseInt(days)
  if (isNaN(days)) {
    days = 30
  }
	let d = new Date(new Date().getTime() + 1000 * 3600 * 24 * days)
	return d.format('yyyy-MM-dd')
}

Date.prototype.format = function(fmt) { //author: meizz   
  var o = {
    "M+": this.getMonth() + 1, //月份   
    "d+": this.getDate(), //日   
    "h+": this.getHours(), //小时   
    "m+": this.getMinutes(), //分   
    "s+": this.getSeconds(), //秒   
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
    "S": this.getMilliseconds() //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
