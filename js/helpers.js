String.prototype.splice = function( idx, rem, s ) {
	if (s === undefined) s = "";
	return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};

function str_to_slide_idx(slide) {
	if (typeof(slide) === "string") {
		// search for index to delete
		var find = slide;
		for (slide = 0; slide < Presentation.slides.length && Presentation.slides[slide].name != find; i++) {}
		if (slide == Presentation.slide.length) { console.log("No such slide."); return -1; }
		return slide;
	}
	return slide;
}

global.oldSetInterval = global.setInterval;
global.timers = [];
global.setInterval = function(f, dur) {
	var id = global.oldSetInterval(f, dur);
	global.timers.push(id);
	return id;
};