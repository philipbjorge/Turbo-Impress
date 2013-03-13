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
		add: function(position, slide) {
			if (position === undefined)
				position = this.length;
			this._insert(position, slide);
		},
		rm: function() {},
		move: function() {},
		_insert: function(position, data) {
			this.splice(position, 0, new Slide(data));
			Presentation._redraw();
		},
		_delete: function(position, data) {
			this.splice(position, 1);
			Presentation._redraw();
		},
		_replace: function(position, was, now) {
			this[position] = now;
			this[position]._redraw();
		},
		_move: function(from, to) {
                        if (to >= this.length) {
                                var k = to - this.length;
                                while ((k--) + 1) {
                                        this.push(undefined);
                                }
                        }
                        this.splice(to, 0, this.splice(from, 1)[0]);
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
			Presentation.sjs.at("_current").del(0, Presentation.current().length);
			Presentation.sjs.at("_current").insert(0, new_current);
			Presentation._current.__data = new_current;
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