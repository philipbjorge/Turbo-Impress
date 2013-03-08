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

## Slide Creation
Content.search("Kittens", "kittens", 3, "image")
Content.search("Puppies", "puppies", 3, "video")
Content.search("Philip Bjorge", "me", 3, "web")

pieces = [["<h1>Kittens</h1>", kittens], ["<h1>Puppies</h1>", puppies], ["<h1>ME</h1>", me]]
just_added = pieces.map ^(v){Slides.add({content: v})}