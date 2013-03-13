var presenter_init = {
	network: function(port) {
		// Takes a port and a list of message handlers
		window.server = start_server(port, {
			alert: function(args) {
				alert(args.join(" "));
				return false;
			},
			goto: function(args) {
				var slide = args[0];
				remote.goto(slide);
				return true;
			},
			add_slide: function(args) {
				slides.add({content: args[0]});
				return true;
			},
			rm_slide: function(args) {
				slides.remove(args[0]);
				return true;
			}
		});
	}
};