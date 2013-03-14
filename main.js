(function() {
    // networking start is user initiated
    $("#networking-launch").click(function() {
        var sjs = require('share').server;
        presenter = $("#isPresenter").attr('checked') === "checked";
        var server_param = "http://127.0.0.1:" + global.app.address().port;

        if (presenter) {
            sjs.attach(global.server, {db: {type: 'none'}});
        } else {
            server_param = $("#networking-settings").val();
        }

        sharejs.open('main', 'json', server_param + "/channel", function(error, doc) {
            if (error) console.log(error);
            if (doc.created) doc.set({slides: [], _current: ""});

            // Load up the data structure initially.
            Presentation.sjs = doc;
            var data = doc.get();
            for (var i = 0; i < data.slides.length; i++)
                Presentation.slides._insert(Presentation.slides.length + 1, data.slides[i]);
            Presentation._current._insert(1, data._current);

            var slides_sd = doc.at('slides');
            var _current_sd = doc.at('_current');

            slides_sd.on('insert', Presentation.slides._insert);
            slides_sd.on('delete', Presentation.slides._delete);
            slides_sd.on('move', Presentation.slides._move);
            // slides_sd.on('child op', Presentation.slides._child_op); (Turning this on breaks the _current subdoc events)

            _current_sd.on('insert', Presentation._current._insert);
            _current_sd.on('delete', Presentation._current._delete);
        });

        Move.eval("Server = window.server\n");

        event.preventDefault();
    });

    var init = creator_init;
    if (typeof(init.layout) === "function")
        init.layout();
    if (typeof(init.editor) === "function")
        init.editor();
    if (typeof(init.remote) === "function")
        init.remote();
    if (typeof(init.slides) === "function")
        init.slides();
    if (typeof(init.content) === "function")
        init.content();
    if (typeof(init.fancybox) === "function")
        init.fancybox();
    if (typeof(init.repl) === "function")
        init.repl();

    window.impress = $("#impress");
    window.impress.jmpress();
})();
