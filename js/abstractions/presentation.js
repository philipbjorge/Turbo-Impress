var Presentation = {
        /*
                // Implementation details that are subject to change
        <Slide>:
                {
                        construction_parameters: {},  // so we can reconstruct the slide for everyone
                        content: [<String>,...]
                }
         */
	sjs: undefined,
	slides: $.extend([], {
		/*
			Creates an empty slide.

			If given a position it puts the given slide at the index.
			If given no position, it appends.
			
			Takes a slide name for a blank slide or a Slide initialization object.
		 */
		create: function(slide, position) {
			if (position === undefined)
				position = Presentation.slides.length;
			if (typeof(slide) === "string")
				slide = {name: slide};

			Presentation.sjs.at("slides").insert(position, slide, function(err, doc) {
				// Only add this to our structure on success
				if (!err)
					Presentation.slides._insert(position, slide);
				else
					console.log(err);
			});
		},
		/*
			Remove at a position or a slide id depending
			on whether given an int or string.
		 */
		remove: function(slide) {
			slide = str_to_slide_idx(slide);

			Presentation.sjs.at(["slides", slide]).remove(function(err, doc) {
				if (!err)
					Presentation.slides._delete(slide, {});
				else
					console.log(err);
			});
		},
		/*
			Moves slide from to position slide to.
			These can be either strings or integers.
		 */
		move: function(from, to) {
			from = str_to_slide_idx(from);
			to = str_to_slide_idx(to);
			if (from == -1 || to == -1) return;

			Presentation.sjs.at("slides").move(from, to, function(err, doc) {
				if (!err)
					Presentation.slides._move(from, to);
				else
					console.log(err);
			});
		},
		_insert: function(position, data) {
			Presentation.slides.splice(position, 0, new Slide(data));
			Presentation._redraw();
		},
		_delete: function(position, data) {
			Presentation.slides.splice(position, 1);
			Presentation._redraw();
		},
		_replace: function(position, was, now) {
			Presentation.slides[position] = now;
			Presentation.slides[position]._redraw();
		},
		_move: function(from, to) {
			if (to >= Presentation.slides.length) {
				var k = to - Presentation.slides.length;
				while ((k--) + 1) {
					Presentation.slides.push(undefined);
				}
			}
			Presentation.slides.splice(to, 0, Presentation.slides.splice(from, 1)[0]);
			Presentation._redraw();
		}
	}),
	_current: $.extend({}, {
		// Presetting _current tricks the current function into
		// not sending the operational transformation.
		_insert: function(position, data) {
			var c = Presentation._current.__data;
			Presentation._current.__data = c.splice(position, 0, data);
			Presentation.current(Presentation._current.__data);
		},
		_delete: function(position, data) {
			var c = Presentation._current.__data;
			Presentation._current.__data = c.splice(position, data.length);
			Presentation.current(Presentation._current.__data);
		},
		__data: "",
		toString: function() { return Presentation._current.__data; }
	}),
	current: function(new_current) {
		if (new_current === undefined)
			return Presentation._current.__data;

		if (new_current != Presentation._current.__data) {
			Presentation.sjs.at("_current").del(0, Presentation.current().length, function(err, doc) {
				if (!err) {
					var before = Presentation._current.__data;
					Presentation._current.__data = "";
					Presentation.sjs.at("_current").insert(0, new_current, function(err, doc) {
						if (!err) {
							Presentation._current.__data = new_current;
						} else {
							Presentation._current.__data = before;
							console.log(err);
						}
					});
				} else {
					console.log(err);
				}
			});
		}
		return new_current;
	},
	// All built off current()
	next: function() {},
	prev: function() {},
	goto: function(slide) {},
	_redraw: function() {
		alert("Redraws the whole presentation");
	}
};