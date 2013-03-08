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
		remote = {
			active: function() { return window.impress.jmpress('active'); },
			home: function() { return window.impress.jmpress('home'); },
			end: function() { return window.impress.jmpress('end'); },
			next: function() { return window.impress.jmpress('next'); },
			prev: function() { return window.impress.jmpress('prev'); },
			goto: function(a) { return window.impress.jmpress('goTo', a, "jump"); },
			cancelTimers: function() { for(var i = 0; i < global.timers.length; i++) { global.timers[i].stop(); } global.timers = []; }
		};
	},

	repl: function () {
		// Set up the environment
		Move.eval("Remote = window.remote");

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
			repl.Write(Array.prototype.join.call(arguments, ' ') + "\n", 'jqconsole-output');
			// TODO: Check for replacable elements (e.g. images)
		};

        var startPrompt = function () {
          // Start the prompt with history enabled.
          repl.Prompt(true, function (input) {
            try {
          		repl.Write(Move.eval(input) + '\n', 'jqconsole-output-repl');
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