
const padStr = (str, count, char) => {
	if (str.length > count) {
		return str
	}

	return n[1] ? n : '0' + n
}
Date.prototype.format = function (fmt) {
	var o = {
		"Y": this.getFullYear() + '',
		"y": (this.getFullYear() + '').substr(2, 2),
		"M": this.getMonth() + 1, //月份
		"d": this.getDate(), //日
		"W": ['日', '一', '二', '三', '四', '五', '六'][this.getDay()],
		"h": ['凌晨 ', '上午 ', '下午 ', '晚上 '][parseInt(this.getHours() / 6)] + (this.getHours() % 12 == 0 ? this.getHours() : this.getHours() % 12).toString().padLeft(2, '0'), //小时
		"H": this.getHours(),//.padLeft(2, '0'), //小时
		"m": this.getMinutes(),//.padLeft(2, '0'), //分
		"s": this.getSeconds(),//.padLeft(2, '0'), //秒
		"S": this.getMilliseconds(),//.padLeft(3, '0') //毫秒
	};
	for (var k in o) {
		if (new RegExp("(" + k + ")", 'g').test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (("00" + o[k]).substr(("" + o[k]).length)) : (o[k]));
		}
	}
	return fmt;
}
Date.time = function () {
	return parseInt((new Date).getTime() / 1000)
}
Date.prototype.time = function () {
	return parseInt(this.getTime() / 1000)
}
String.prototype.trim = function () {
	return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.trimStart = function () {
	return this.replace(/^\s*/g, "");
}
String.prototype.trimEnd = function () {
	return this.replace(/\s*$/g, "");
}
String.prototype.endWith = function (str) {
	if (str == null || str == "" || this.length == 0 || str.length > this.length)
		return false;
	if (this.substring(this.length - str.length) == str)
		return true;
	else
		return false;
	return true;
}

String.prototype.startWith = function (str) {
	if (str == null || str == "" || this.length == 0 || str.length > this.length)
		return false;
	if (this.substr(0, str.length) == str)
		return true;
	else
		return false;
	return true;
}

//方法一扩展（C#中PadLeft、PadRight）
String.prototype.padLeft = function (len, char) {
	var s = this + ''
	char = char || ' '
	return new Array(len - s.length + 1).join(char, '') + s;
}
String.prototype.padRight = function (len, char) {
	var s = this + ''
	char = char || ' '
	return s + new Array(len - s.length + 1).join(char, '');
}

Object.extend = function (target) {
	target = target||{}
	for (var i = 1; i < arguments.length; i++) {
		for (var x in arguments[i]) {
			
			if (arguments[i].hasOwnProperty(x)) {
				var obj = arguments[i][x]
				if (obj && Object.isPlainObject(obj)) {
					target[x] = Object.extend(target[x], obj)
				}
				else {
					target[x] = obj
				}
			}

		}
	}
	return target
}
Object.isPlainObject = function (obj) {

	if (obj.toString() !== "[object Object]") {
		return false;
	}
	var proto = Object.getPrototypeOf(obj);

	if (!proto) {
		return true
	}
	var Ctor = obj.hasOwnProperty.call(proto, "constructor") && proto.constructor;
	return typeof Ctor === "function" && obj.hasOwnProperty.toString.call(Ctor) === obj.hasOwnProperty.toString.call(Object);
}
Object.isNumber = function (obj) {
	return (typeof obj).toLowerCase() == 'number'
}
Object.isString = function (obj) {
	return (typeof obj).toLowerCase() == 'string'
}
Object.isBoolean = function (obj) {
	return (typeof obj).toLowerCase() == 'boolean'
}
Object.isUndefined = function (obj) {
	return (typeof obj).toLowerCase() == 'object' && Object.prototype.toString.call(obj).replace(/(\[object\s*)|(\])/g, '').toLowerCase().trim() == 'undefined'
}
Object.isNull = function (obj) {
	return (typeof obj).toLowerCase() == 'object' && Object.prototype.toString.call(obj).replace(/(\[object\s*)|(\])/g, '').toLowerCase().trim() == 'null'
}
Object.isArray = function (obj) {
	return (typeof obj).toLowerCase() == 'object' && Object.prototype.toString.call(obj).replace(/(\[object\s*)|(\])/g, '').toLowerCase().trim() == 'array'
}
Object.isObject = function (obj) {
	return (typeof obj).toLowerCase() == 'object' && Object.prototype.toString.call(obj).replace(/(\[object\s*)|(\])/g, '').toLowerCase().trim() == 'object'
}
Object.isDate = function (obj) {
	return (typeof obj).toLowerCase() == 'object' && Object.prototype.toString.call(obj).replace(/(\[object\s*)|(\])/g, '').toLowerCase().trim() == 'date'
}

Object.isFunction = function (obj) {
	return (typeof obj).toLowerCase() == 'function'
}


module.exports = {
	calcDateTime(stamp){
		var h,m,s

		h = parseInt(stamp/3600)
		stamp = stamp%3600
		m = parseInt(stamp/60)
		s = stamp % 60
		if (h) {
			h += '小时'
		}
		if (m) {
			m += '分'
		}
		if (s) {
			s += '秒'
		}
		return h+m+s
	}
}
