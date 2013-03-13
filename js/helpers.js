String.prototype.splice = function( idx, rem, s ) {
	if (s === undefined) s = "";
	return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};

global.oldSetInterval = global.setInterval;
global.timers = [];
global.setInterval = function(f, dur) {
	var id = global.oldSetInterval(f, dur);
	global.timers.push(id);
	return id;
};