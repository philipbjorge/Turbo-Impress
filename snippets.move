## Step every n seconds
	step_every = ^(n){ repeat {every: n} ^{ Remote.next() } }
	s = step_every(2000)
	s.cancel()