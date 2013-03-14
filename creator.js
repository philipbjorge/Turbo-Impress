var creator_init = {
	editor: function() {
		editor = ace.edit("editor");
		editor.setTheme("ace/theme/monokai");
		editor.getSession().setMode("ace/mode/ruby");
		editor.commands.addCommand({
		    name: 'repl',
		    bindKey: {win: 'Ctrl-R',  mac: 'Command-R'},
		    exec: function(editor) {
		    	var old_line = repl.GetPromptText();
		    	repl.ClearPromptText();
		    	if (editor.getSelection().isEmpty())
		    		repl.SetPromptText(editor.getValue());
		    	else
		    		repl.SetPromptText(editor.session.getTextRange(editor.getSelectionRange()));
		    	repl._HandleEnter();
		    	repl.ClearPromptText();
		    	repl.SetPromptText(old_line);
		    },
		    readOnly: true // false if this command should not apply in readOnly mode
		});
	},

	layout: function() {
			layout = $("#body").layout({
				minSize:			25,
				north__size:		0.05,
				south__size:		0.3,
				west__size:			'30%',
				east__size:			'10%',
				east__initClosed:   true,
				west__initClosed:   true,
				spacing_closed:		16,
				south__onresize: function() { editor.resize(); }
			});
	},

	remote: function() {
		Remote = remote = {
			current: function() { return window.impress.jmpress('active')[0].id; },
			home: function() {
				window.impress.jmpress('home');
				if (presenter) Presentation.current(this.current(), true);
			},
			end: function() {
				window.impress.jmpress('end');
				if (presenter) Presentation.current(this.current(), true);
			},
			next: function() {
				window.impress.jmpress('next');
				if (presenter) Presentation.current(this.current(), true);
			},
			prev: function() {
				window.impress.jmpress('prev');
				if (presenter) Presentation.current(this.current(), true);
			},
			goto: function(a, dont_go) {
				if (a === "") return;
				if (typeof(a) === "number") { a = window.slides[a%window.slides.length]; }
				if (typeof(a) === "string" && a[0] != "#") a = "#" + a;
				// TODO: Check for instance of Slide
				window.impress.jmpress('goTo', a, "jump");
				if (presenter && dont_go !== true) Presentation.current(this.current(), true);
			},
			_autopilot: true,
			autopilot: function(b) {
				if (presenter)
					return true;
				if (b === undefined)
					return remote._autopilot;
				remote._autopilot = b;
				return remote._autopilot;
			},
			cancelTimers: function() { for(var i = 0; i < global.timers.length; i++) { global.timers[i].stop(); } global.timers = []; }
		};
	},

	fancybox: function() {
			$('a.fancybox')
		    .fancybox({
		        padding    : 0,
		        margin     : 5,
		        nextEffect : 'fade',
		        prevEffect : 'none',
		        autoCenter : false,
		        helpers : {
					media : {}
				},
		        autoResize: true,
		        fitToView: false,
		        width: $(window).width() * 0.99,
		        aspectRatio: true,
		        scrolling: 'no',
		        live: true
		    });
	},

	network: function(server) {
		// Client Handlers
		window.server = start_client(server, {
			alert: function(args) {
				alert($.makeArray(arguments).join(" "));
			},
			goto: function(args) {
				var slide = arguments[0];
				remote.goto(slide);
			},
			add_slide: function(args) {
				slide.add({content: arguments[0]});
			},
			rm_slide: function(args) {
				slide.remove(arguments[0]);
			}
		});
	},

	content: function() {
		content = {
			search: function(q, o) {
				var defaults = {
					call_back_var: undefined,
					call_back_fn: undefined,
					count: 5,
					media_types: "web+image+video"
				};

				var settings = $.extend({}, defaults, o);

				var url = "https://api.datamarket.azure.com/Bing/Search/v1/Composite?Query=%27" + encodeURIComponent(q) +
				"%27&Sources=%27" + encodeURIComponent(settings.media_types) + "%27";

				var thisContent = this;

				$.getJSON(url, {}, function(o) { 
					var data = o.d.results[0];
					var r = [];

					if (data.Image.length > 0) {
						for (var i = 0; i < settings.count && i < data.Image.length; i++)
							r.push('<a href="'+data.Image[i].MediaUrl+'" class="fancybox fancybox.image"><img src="'+data.Image[i].MediaUrl+'" /></a>');
					}
					if (data.Video.length > 0) {
						for (var i = 0; i < settings.count && i < data.Video.length; i++)
							r.push('<a href="'+data.Video[i].MediaUrl+'" class="fancybox fancybox.iframe"><img src="'+data.Video[i].Thumbnail.MediaUrl+'" /></a>');
					}
					if (data.Web.length > 0) {
						for (var i = 0; i < settings.count && i < data.Web.length; i++)
							r.push('<a href="' + data.Web[i].Url + '" class="fancybox fancybox.iframe">' + data.Web[i].Url +' </a>');
					}

					console.log(r);
					thisContent.lastReceived = r;
					if (settings.call_back_var !== undefined)
						Move.eval(call_back_var + " = Content.lastReceived");
					if (settings.call_back_fn !== undefined)
						Move.eval(settings.call_back_fn + "(Content.lastReceived)");
				});
			}
		};
	},

	slides: function() {
		slides = $(".step");
		var slidify = function(s, content) {
			s.toString = function() {
				return "#" + $(this).attr('id');
			};
			s.__content = content;
			return s;
		};
		slides = slides.map(function(e) { slidify(e, []); });
		slides.toString = function() {
			return this.toArray().toString();
		};

		$.jmpress("template", "auto", {
			children: function(idx) {
				return {
					z: 0,
					y: 0,
					x: idx * 300,
					template: "auto",
					scale: 0.3
				};
			}
		});

		slides.remove = function(i) {
			var removeStep;
			if (typeof(i) === "number")
				removeStep = this[i % this.length];
			else
				removeStep = i;
			$('#impress').jmpress('deinit', removeStep);
			removeStep.remove();
		};

		slides.add = function(o) {
			defaults = {
				showImmediately: true, // show the slide immediately and show in progress; call Slide.show()
				position: {},	// TODO
				template: null,	// Available: "stacking"
				content: []
			};
			var settings = $.extend({}, defaults, o);
			var newStep = $('<div class="step" />');
			newStep.attr('data-template', settings.template);
			newStep.attr('data-y', 600*this.length);
			newStep.html(settings.content.join());

			if (settings.showImmediately)
				// publish the change over the network
				var dummy = 1;
			$('#impress').jmpress('canvas').append(newStep);
			$('#impress').jmpress('init', newStep);
			this.push(newStep);

			remote.goto(newStep);
			newStep = slidify(newStep, settings.content);
			return newStep;
		};
		// TODO: Add Search/filter features
	},

	repl: function () {
		// Set up the environment
		Move.eval("Remote = window.remote\nSlides = window.slides\nContent = window.content\nServer = window.server");

        repl = $('#repl').jqconsole('', '>');
        repl.RegisterMatching('{', '}', 'jqconsole-brackets');
        repl.RegisterMatching('[', ']', 'jqconsole-braces');
        repl.RegisterMatching('(', ')', 'jqconsole-parens');

        $("#repl-exec").click(function() {
        	editor.commands.commands.repl.exec(editor);
        });

		// Output input with the class jqconsole-output.
		var old_console_log = console.log;
		var last_printed_count = 0;
		console.log = function(args) { 
			old_console_log.apply(this, arguments);
			repl.Write(Array.prototype.join.call(arguments, '\n') + "\n", 'jqconsole-output', false);
		};

        var startPrompt = function () {
          // Start the prompt with history enabled.
          repl.Prompt(true, function (input) {
            try {
          		repl.Write(Move.eval(input) + '\n', 'jqconsole-output-repl', false);
			}
			catch (err) {
				repl.Write(err + '\n', 'jqconsole-error');
			}
            // Restart the prompt.
            startPrompt();
          });
        };
        startPrompt();
	}
};