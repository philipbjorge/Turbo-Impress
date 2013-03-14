function Slide(constructor_vars) {
    var self = this;
    constructor_vars = $.extend({}, {name: ""}, constructor_vars);

    this.toString = function() {
        return "#" + $(this).attr('id');
    };

    this._redraw = function() {
        alert("Redraws this slides content");
    };

    this.content = $.extend([], {
            add: function(args) {},
            rm: function() {},
            piece: function(idx, new_piece) {}  // if idx and newpiece, set
    });

    this.initial_data = constructor_vars;
    this.name = constructor_vars.name;
}