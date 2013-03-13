function Slide() {
    var self = this;
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

    this.initial_data = function(data) {};  // if data, set
}