var creator_init = {
	editor: function() {
		editor = ace.edit("editor");
		editor.setTheme("ace/theme/monokai");
		editor.getSession().setMode("ace/mode/clojure");
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
        var startPrompt = function () {
          // Start the prompt with history enabled.
          repl.Prompt(true, function (input) {
            // Output input with the class jqconsole-output.
            repl.Write(input + '\n', 'jqconsole-output');
            // Restart the prompt.
            startPrompt();
          });
        };
        startPrompt();
	}
};