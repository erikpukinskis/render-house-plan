drawPlan(function(stud, plywood, section) {


// BACK LEFT

var backLeft = section({
  left: 0,
  top: 0
})

stud({
  section: backLeft,
  orientation: "east",
  left: stud.DEPTH + plywood.THICKNESS
})

var secondStudOffset = 16 - plywood.THICKNESS - stud.WIDTH/2

stud({
  section: backLeft,
  orientation: "west",
  left: secondStudOffset
})

stud({
  section: backLeft,
  orientation: "west",
  left: secondStudOffset + 16
})

stud({
  section: backLeft,
  orientation: "west",
  left: 48 - plywood.THICKNESS - stud.WIDTH - 0.75
})

plywood({
  section: backLeft,
  length: 48,
  rotate: 90,
  top: -plywood.THICKNESS,
  left: -plywood.THICKNESS,
  orientation: "north"
})

plywood({
  section: backLeft,
  length: 48 - stud.DEPTH - 2*plywood.THICKNESS,
  rotate: 90,
  top: stud.DEPTH,
  left: stud.DEPTH + plywood.THICKNESS,
  orientation: "south"
})


// BACK RIGHT

var backRight = section({left: 48 - plywood.THICKNESS, top: 0})

stud({
  section: backRight,
  orientation: "east",
  left: 0.75
})

var secondStudOffset = 16 - stud.WIDTH/2

stud({
  section: backRight,
  orientation: "west",
  left: secondStudOffset
})

stud({
  section: backRight,
  orientation: "west",
  left: secondStudOffset + 16
})

stud({
  section: backRight,
  orientation: "west",
  left: 48 - plywood.THICKNESS*2 - stud.DEPTH - stud.WIDTH
})

plywood({
  section: backRight,
  length: 48,
  rotate: 90,
  top: -plywood.THICKNESS,
  orientation: "north"
})

plywood({
  section: backRight,
  length: 48 - stud.DEPTH - 2*plywood.THICKNESS,
  rotate: 90,
  top: stud.DEPTH,
  orientation: "south"
})


// SIDES

sideWall({
  left: 0,
  top: 0
})

sideWall({
  left: 96 - stud.DEPTH - plywood.THICKNESS*2,
  top: 0
})

function sideWall(position) {

  var long = section(position)

  stud({
    section: long,
    top: 0,
    orientation: "south"
  })

  stud({
    section: long,
    top: 16 - stud.WIDTH/2
  })

  stud({
    section: long,
    top: 16*2 - stud.WIDTH/2
  })

  stud({
    section: long,
    top: 48 - stud.WIDTH/2
  })

  plywood({
    section: long,
    length: 48,
    left: -plywood.THICKNESS,
    orientation: "west"
  })

  plywood({
    section: long,
    length: 24,
    left: stud.DEPTH,
    orientation: "east"
  })

  stud({
    section: long,
    top: 48+12 - stud.WIDTH/2
  })

  stud({
    section: long,
    top: 48+24 - stud.WIDTH
  })

  plywood({
    section: long,
    length: 24,
    top: 48,
    left: -plywood.THICKNESS,
    orientation: "west"
  })

  plywood({
    section: long,
    length: 48,
    top: 24,
    left: stud.DEPTH,
    orientation: "east"
  })

}

})