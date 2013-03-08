Turbo-Impress
=============

A language and development environment for creating live presentations.

##Status:
  * 3/7/2013 - Clean embedding of Movelang, a repl, and Ace Editor - [YouTube](http://youtu.be/o3W3k301cqw)
  * 3/6/2013 - Functional node-webkit project with impress.js and ui.layout

##Available Abstractions
###Remote
This abstraction is used to control the presenter's slide. Concurrency resolution has not been decided yet.

####Remote.next()
Transitions to the next slide in the deck.

####Remote.prev()
Transitions to the previous slide in the deck.

####Remote.goto(slide)
Transitions to the supplied Slide in the deck.
slide can be the number of the slide (e.g. 7), the id of the slide (e.g. "slide_id_name"), or the DOM element.

####Remote.active()
Returns the active slide.

####Remote.home()
Transitions to the starting slide.

####Remote.end()
Transitions to the ending slide.

####Remote.cancelTimers()
Cancels all currently running asynchronous code started through Move.

###Slides

####Slides.remove(i)
Removes a slide where i is the index (integer) or the Slide object.

####Slides.add(options)
Adds a slide with the following options map:
	{
		showImmediately: true,

	}

###Content
####Content.search(q, call_back_var, count, media_types)
# TODO: Make this an options dict and have call_back_func too
Searches Bing for content matching the query string. Types is a "+" seperated list of the following content types:
"web+image+video"
Count is the amount of elements from each content type in the final array.
Because this is an asynchronous call, the variable name supplied in callback_var is assigned the content
when it's arrived. If this is undefined, you can still find the content at Content.lastRecieved

####Content.lastReceived
Array of the last recieved bing data.