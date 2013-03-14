String.prototype.splice = function( idx, rem, s ) {
	if (s === undefined) s = "";
	return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};

function str_to_slide_idx(slide) {
	if (typeof(slide) === "string") {
		// search for index to delete
		var find = slide;
		for (slide = 0; slide < Presentation.slides.length && Presentation.slides[slide].name != find; slide++) {}
		if (slide == Presentation.slides.length) { console.log("No such slide."); return -1; }
	}
	return slide;
}

function str_to_content_idx(piece, slide_idx) {
	if (typeof(piece) === "string") {
		// search for index to delete
		var find = piece;
		for (piece = 0; piece < Presentation.slides[slide_idx].content.length && Presentation.slides[slide_idx].content[piece] != find; piece++) {}
		if (piece == Presentation.slides[slide_idx].content.length) { console.log("No such content."); return -1; }
	}
	return piece;
}

global.oldSetInterval = global.setInterval;
global.timers = [];
global.setInterval = function(f, dur) {
	var id = global.oldSetInterval(f, dur);
	global.timers.push(id);
	return id;
};