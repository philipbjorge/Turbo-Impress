var Presentation = {
	sjs: undefined,	// the sharejs object after we've connected
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

			// random id in case a unique name isn't provided
			slide["rand_id"] = Math.floor(Math.random()*90000) + 10000;

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
			Presentation._redraw("insert_slide", Presentation.slides[position]);
		},
		_delete: function(position, data) {
			var id = "#" + Presentation.slides[position].name;
			Presentation.slides.splice(position, 1);
			Presentation._redraw("delete_slide", id);
		},
		_move: function(from, to) {
			if (to >= Presentation.slides.length) {
				var k = to - Presentation.slides.length;
				while ((k--) + 1) {
					Presentation.slides.push(undefined);
				}
			}
			Presentation.slides.splice(to, 0, Presentation.slides.splice(from, 1)[0]);
			Presentation._redraw("move_slide", [from, to]);
		},
		_child_op: function(path, op) {
			console.log("Attempting op="+op+" on path="+path);
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
	current: function(new_current, dont_go) {
		if (new_current === undefined)
			return Presentation._current.__data;

		if (typeof(new_current) === "number")
			new_current = Presentation.slides[new_current] + "";

		if (new_current != Presentation._current.__data) {
			Presentation.sjs.at("_current").del(0, Presentation.current().length, function(err, doc) {
				if (!err) {
					var before = Presentation._current.__data;
					Presentation._current.__data = "";
					Presentation.sjs.at("_current").insert(0, new_current, function(err, doc) {
						if (!err) {
							Presentation._current.__data = new_current;
							if (remote.autopilot() && ($(new_current).length > 0 || $("#" + new_current).length > 0)) {
								if (dont_go !== true)
									remote.goto(new_current);
							}
						} else {
							Presentation._current.__data = before;
							console.log(err);
						}
					});
				} else {
					console.log(err);
				}
			});
		} else {
			if (remote.autopilot())
				remote.goto(new_current, true);
		}

		return new_current;
	},
	// All built off current()
	next: function() {
		var new_idx = (str_to_slide_idx(Presentation.current()) + 1) % Presentation.slides.length;
		Presentation.current(new_idx);
	},
	prev: function() {
		var new_idx = (str_to_slide_idx(Presentation.current()) - 1) % Presentation.slides.length;
		Presentation.current(new_idx);
	},
	goto: function(slide) {
		Presentation.current(slide);
	},
	_redraw: function(op, data) {
		if (op === "insert_slide") {
			var slide = $('<div class="step" />');
			slide.attr('data-y', Presentation.slides.length*600);
			slide.attr('id', data.name);
			slide.html(data.content.join(" "));

			$('#impress').jmpress('canvas').append(slide);
			$('#impress').jmpress('init', slide);
		}

		if (op === "delete_slide") {
			var r = $(data);
			$('#impress').jmpress('deinit', r);
			r.remove();
		}

		if (op === "move_slide") {
			var from = $($(".step")[data[0]]);
			var to   = $($(".step")[data[1]]);
			to.before(from);
		}
	}
};