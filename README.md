Turbo-Impress
=============

A language and development environment for creating live presentations.

##Status:
  * 3/7/2013 - Clean embedding of Movelang, a repl, and Ace Editor - [YouTube](http://youtu.be/o3W3k301cqw)
  * 3/6/2013 - Functional node-webkit project with impress.js and ui.layout

##Available Abstractions
###Remote
This abstraction is used to control the presenter's slide. Concurrency resolution has not been decided yet.

####Remote.next(duration)
Transitions to the next slide in the deck.

####Remote.prev(duration)
Transitions to the previous slide in the deck.

####Remote.goto(slide, duration)
Transitions to the supplied Slide in the deck.
slide can be the number of the slide (e.g. 7), the id of the slide (e.g. "slide_id_name"), or the DOM element.

####Remote.cancelTimers()
Cancels all currently running asynchronous code started through Move.