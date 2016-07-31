drawPlan(function(stud, plywood, section) {


// BACK

var back = section({
  left: 0,
  top: 0
})

plywood({
  section: back,
  length: 48,
  rotate: 90,
  top: -plywood.THICKNESS,
  left: -plywood.THICKNESS,
  orientation: "north"
})

plywood({
  section: back,
  length: 48 - stud.DEPTH - 2*plywood.THICKNESS,
  rotate: 90,
  top: stud.DEPTH,
  left: stud.DEPTH + plywood.THICKNESS,
  orientation: "south"
})

stud({
  section: back,
  orientation: "east",
  left: stud.DEPTH + plywood.THICKNESS
})

var secondStudOffset = 16 - plywood.THICKNESS - stud.WIDTH/2

stud({
  section: back,
  orientation: "west",
  left: secondStudOffset
})

stud({
  section: back,
  orientation: "west",
  left: secondStudOffset + 16
})

stud({
  section: back,
  orientation: "west",
  left: 48 - plywood.THICKNESS - stud.WIDTH/2
})

// BACK RIGHT

plywood({
  section: back,
  length: 48,
  left: 48-plywood.THICKNESS,
  rotate: 90,
  top: -plywood.THICKNESS,
  orientation: "north"
})

plywood({
  section: back,
  length: 48 - stud.DEPTH - 2*plywood.THICKNESS,
  left: 48-plywood.THICKNESS,
  rotate: 90,
  top: stud.DEPTH,
  orientation: "south"
})

stud({
  section: back,
  orientation: "west",
  left: 48 - plywood.THICKNESS + 16 - stud.WIDTH/2
})

stud({
  section: back,
  orientation: "west",
  left: 48 - plywood.THICKNESS + 2*16 - stud.WIDTH/2
})

stud({
  section: back,
  orientation: "west",
  left: 48*2 - plywood.THICKNESS*3 - stud.WIDTH-stud.DEPTH
})



// stud({
//   section: backRight,
//   orientation: "east",
//   left: 0.75
// })

// var secondStudOffset = 16 - stud.WIDTH/2

// stud({
//   section: backRight,
//   orientation: "west",
//   left: secondStudOffset
// })

// stud({
//   section: backRight,
//   orientation: "west",
//   left: secondStudOffset + 16
// })

// stud({
//   section: backRight,
//   orientation: "west",
//   left: 48 - plywood.THICKNESS*2 - stud.DEPTH - stud.WIDTH
// })




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