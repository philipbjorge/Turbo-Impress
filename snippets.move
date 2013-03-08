## Step every n seconds
	step_every = ^(n){ repeat {every: n} ^{ Remote.next() } }
	s = step_every(2000)
	s.cancel()

## Step through a group of slides
	step_through = ^(a, n){ 
	    if (a.length == 0) return null
		a = a.map ^(value, index, o){ if (typeof(value) === "number") return Slides[value]; value }
		repeat {every: n} ^{ a.push(a[0]); Remote.goto(a[0]); a = a[1:]; }
	}

	s = step_through([1, 5, 9], 2000)
	s.cancel()

## Kittens Slide!!11!!
Content.search("Kittens", "kitties")
kitties = ["<h1>Kittens!1!!</h1>"].concat(kitties[0:3])
Slides.add({content: kitties})