module.exports = {
	success(msg) {
		console.log("%c"+msg, "color:#46BE8A;")
	},
	warn(msg) {
		console.log("%c" + msg, "color:#F2A654;")
	},
	error(msg) {
		console.log("%c" + msg, "color:#F96868;")
	},
	info(msg) {
		console.log("%c" + msg, "color:#62A8EA;")
	},
	debug(msg) {
		console.log("%c" + msg, "color:#616161;")
	}
}