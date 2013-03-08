## Step every n seconds
	step_every = ^(n){ repeat {every: n} ^{ Remote.next() } }
	s = step_every(2000)
	s.cancel()

## Step through a group of slides
	step_through = ^(a, n){ 
		if (a.length == 0) return null
		repeat {every: n} ^{
			a.push(a[0])
			Remote.goto(a[0], undefined, true)
			a = a[1:]
		}
	}

	s = step_through([1, 5, 9], 2000)
	s.cancel()