var creator_init = {
	editor: function() {
		editor = ace.edit("editor");
		editor.setTheme("ace/theme/monokai");
		editor.getSession().setMode("ace/mode/ruby");
	},

	layout: function() {
			layout = $("#body").layout({
				minSize:			25,
				north__size:		0.05,
				south__size:		0.3,
				west__size:			'30%',
				east__size:			'10%',
				spacing_closed:		16,
				south__onresize: function() { editor.resize(); }
			});
	},

	repl: function () {
        repl = $('#repl').jqconsole('', '>');
        repl.RegisterMatching('{', '}', 'jqconsole-brackets');
        repl.RegisterMatching('[', ']', 'jqconsole-braces');
        repl.RegisterMatching('(', ')', 'jqconsole-parens');
		// Output input with the class jqconsole-output.
		var old_console_log = console.log;
		console.log = function(args) { old_console_log.apply(this, arguments); repl.Write(Array.prototype.join.call(arguments, ' ') + "\n", 'jqconsole-output'); };

        var startPrompt = function (repl_input) {
          // Start the prompt with history enabled.
          repl.Prompt(true, function (input) {
            try {
            	repl.Write(Move.eval(repl_input + "\n" + input) + '\n', 'jqconsole-output-repl');
            	repl_input += "\n" + input;
        	}
        	catch (err) {
        		repl.Write(err + '\n', 'jqconsole-error');
        	}
            // Restart the prompt.
            startPrompt(repl_input);
          });
        };
        startPrompt("");
	}
};