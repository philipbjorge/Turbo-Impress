(function() {
    var presenter = false;
    var init;

    if (presenter) {
        // TODO: Define interface for passing in the server callbacks
        start_server();
        init = presenter_init;
    } else {
        init = creator_init;
    }

    if (typeof(init.layout) === "function")
        init.layout();
    if (typeof(init.editor) === "function")
        init.editor();
    if (typeof(init.remote) === "function")
        init.remote();
    if (typeof(init.repl) === "function")
        init.repl();

    window.impress = $("#impress");
    window.impress.jmpress();
})();
