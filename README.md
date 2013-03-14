![TURBO IMPRESS](https://raw.github.com/philipbjorge/Turbo-Impress/master/img/logo.png)

A development environment / DSL for creating presentations on the fly.

##Status:
  * 3/13/2013 - Large portions of slide synchronization are in place - just need to synchronize a slide's content.
  * 3/13/2013 - Finally got sharejs partially implemented for the presentation data structure. The current slide string is kept synchronized. Major refactoring with a bit more to go. Added a logo.
  * 3/7/2013 - Clean embedding of Movelang, a repl, and Ace Editor - [YouTube](http://youtu.be/o3W3k301cqw)
  * 3/6/2013 - Functional node-webkit project with impress.js and ui.layout

##How to Run
Download one of the node-webkit [prebuilt binaries](https://github.com/rogerwang/node-webkit).

Follow the [instructions](https://github.com/rogerwang/node-webkit/wiki/How-to-run-apps) to start the app.

##Abstractions
###Presentation
This is the main abstraction/data structure that is synchronized between the clients and server.
####Presentation.slides [<Slide>,...]
#####Presentation.slides.mv()
Move a slide from --> to in the presentation order (and positionally?).
#####Presentation.slides.rm()
Removes a slide from the presentation. Deleting the slide you're on takes you to the next slide. Can't delete the last slide.
####Slides.add(options)
Adds a slide to the presentation.

####Presentation.current()
####Presentation.current(<Slide>)
Currently unspecified and only partially implemented.

	Presentation.current(); # returns the #id of the main presenter's slide.
	Presentation.current("#slide"); # moves the main presenter's slide to the specifed.

####Presentation.next()
Moves the presenter to the next slide (by index in the Slides array).
####Presentation.prev()
Moves the presenter to the previous slide (by index in the Slides array).
####Presentation.goto(<Slide>)
Moves the presenter to a specified slide.


###Remote
This abstraction is used to control the current user's slide. An editor might want to be on a different slide than the presenter (e.g. to create the next slide).

####Remote.autopilot(<Bool>)
Sets the autopilot on (true) or off (false). When autopilot is set to true, you move through the slideshow in sync with the presenter. When autopilot is false, you have to move yourself.

####Remote.next()
Transitions to the next slide in the deck.

####Remote.prev()
Transitions to the previous slide in the deck.

####Remote.goto(<Slide>)
Transitions to the supplied Slide in the deck.

####Remote.current()
Returns the current slide.

####Remote.cancelTimers()
Cancels all currently running asynchronous code started through Move.
This will need to be moved.


###Content
Allows you to find content from the internet (currently searches bing).
####Content.search(q, options)
q is the search query
				var defaults = {
					call_back_var: undefined,  // sets the variable reffered to by this string to the results
					call_back_fn: undefined,   // calls the function referred to by this stirng with the results
					count: 5,	// results from each media_type
					media_types: "web+image+video"
				};

####Content.lastReceived
Array of the last recieved data.
