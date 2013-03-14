function Slide(constructor_vars) {
    var self = this;
    constructor_vars = $.extend({}, {name: "", content: []}, constructor_vars);

    if (constructor_vars.name === "" || $("#" + constructor_vars.name).length > 0)
        constructor_vars.name += "_step-" + constructor_vars.rand_id;
    this.name = constructor_vars.name;

    this.toString = function() {
        return this.name;
    };

    this._redraw = function() {
        $(self+"").html(self.content.join(" "));
    };

    this.content = constructor_vars.content; // aka an array with strings

    /*
    Creates a piece of content (string) at position.
    If no position supplied, appends it to the back.
     */
    this.content.create = function(piece, position) {
        if (position === undefined) position = self.content.length;
        var slide_idx = str_to_slide_idx(self.name);

        Presentation.sjs.at(["slides", slide_idx, "content"]).insert(position, piece, function(err, doc) {
            if (!err) Presentation.slides[slide_idx].content._insert(position, piece);
            else console.log(err);
        });
    };

    /*
    Deletes a piece of content.
    Takes either a piece's content or it's index.
     */
    this.content.remove = function(piece) {
        var slide_idx = str_to_slide_idx(self.name);
        var content_idx = str_to_content_idx(piece, slide_idx);
        Presentation.sjs.at(["slides", slide_idx, "content", content_idx]).remove(function(err, doc) {
            if (!err) Presentation.slides[slide_idx].content._delete(content_idx);
            else console.log(err);
        });
    };

    /*
    Moves a piece of content from --> to
    Takes either a piece's content or it's index.
     */
    this.content.move  = function(from, to) {
        var slide_idx = str_to_slide_idx(self.name);
        from = str_to_content_idx(from, slide_idx);
        to = str_to_content_idx(to, slide_idx);

        Presentation.sjs.at(["slides", slide_idx, "content"]).move(from, to, function(err, doc) {
            if (!err) Presentation.slides[slide_idx].content._move(from, to);
            else console.log(err);
        });
    };  // if idx and newpiece, set

    this.content._insert = function(position, data) {
        var slide_idx = str_to_slide_idx(self.name);
        Presentation.slides[slide_idx].content.splice(position, 0, data);
        self._redraw();
    };

    this.content._delete = function(position, data) {
        var slide_idx = str_to_slide_idx(self.name);
        Presentation.slides[slide_idx].content.splice(position, 1);
        self._redraw();
    };

    this._move = function(from, to) {
        var slide_idx = str_to_slide_idx(self.name);
        if (to >= Presentation.slides[slide_idx].content.length) {
            var k = to - Presentation.slides[slide_idx].content.length;
            while ((k--) + 1) {
                Presentation.slides[slide_idx].content.push(undefined);
            }
        }
        Presentation.slides[slide_idx].content.splice(to, 0, Presentation.slides[slide_idx].content.splice(from, 1)[0]);
        self._redraw();
    };

    this.initial_data = constructor_vars;

    // TODO: Implement _replace?
    // Or edit in place capability?
}