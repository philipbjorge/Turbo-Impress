var creator_init = {
	editor: function() {
		editor = ace.edit("editor");
		editor.setTheme("ace/theme/monokai");
		editor.getSession().setMode("ace/mode/ruby");
		editor.commands.addCommand({
		    name: 'repl',
		    bindKey: {win: 'Ctrl-R',  mac: 'Command-R'},
		    exec: function(editor) {
		    	repl_reload = true;
		    	var old_line = repl.GetPromptText();
		    	repl.ClearPromptText();
		    	repl.SetPromptText(editor.getValue());
		    	repl._HandleEnter()
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
				spacing_closed:		16,
				south__onresize: function() { editor.resize(); }
			});
	},

	repl: function () {
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
			if (last_printed_count <= 0) {
				repl.Write(Array.prototype.join.call(arguments, ' ').substring(last_printed_count) + "\n", 'jqconsole-output');
			}
			last_printed_count -= Array.prototype.join.call(arguments, ' ').length + 1;
		};

        var startPrompt = function (repl_input) {
          // Start the prompt with history enabled.
          repl.Prompt(true, function (input) {
          	if (typeof(repl_reload) === "undefined" || repl_reload) {
          		repl_input = "";
          		last_printed_count = 0;
          		repl_reload = false;
          	}

            try {
            	var old_last_printed_count = last_printed_count;
            	repl.Write(Move.eval(repl_input + "\n" + input) + '\n', 'jqconsole-output-repl');
            	last_printed_count = old_last_printed_count + (-1 * last_printed_count);
            	repl_input += "\n" + input;
        	}
        	catch (err) {
        		repl.Write(err + '\n', 'jqconsole-error');
        		last_printed_count = old_last_printed_count;
        	}
            // Restart the prompt.
            startPrompt(repl_input);
          });
        };
        startPrompt("");
	}
};