var BATTEN_WIDTH = 1.75

drawPlan(walls)
drawPlan(battens)
// drawPlan(roof)
drawPlan(doors)
// drawPlan(floor)



function floor(section, frontStud, plywood, stud) {

  var floor = section({
    name: "floor",
    left: 0,
    top: 0
  })

  frontStud({
    section: floor,
    width: 96 - plywood.THICKNESS*2
  })

  frontStud({
    section: floor,
    width: 96 - plywood.THICKNESS*2,
    top: 72 - stud.WIDTH
  })

  frontStud({
    section: floor,
    height: 72,
    left: 0
  })

  for(var i=1; i<6; i++) {
    frontStud({
      section: floor,
      height: 72,
      left: i*16 - stud.WIDTH/2
    })
  }

  frontStud({
    section: floor,
    height: 72,
    left: 96 - plywood.THICKNESS*2 - stud.WIDTH
  })

  plywood({
    section: floor,
    width: 48,
    height: 72,
    orientation: "in"
  })

  plywood({
    section: floor,
    left: 48,
    width: 48-plywood.THICKNESS*2,
    height: 72,
    orientation: "in"
  })

}


// WALLS

function walls(stud, plywood, section, trim, door) {

// BACK

var back = section({
  left: 0,
  top: 0
})

plywood({
  section: back,
  width: 48,
  top: -plywood.THICKNESS,
  left: -plywood.THICKNESS,
  orientation: "north"
})

plywood({
  section: back,
  width: 48 - stud.DEPTH - 2*plywood.THICKNESS,
  top: stud.DEPTH,
  left: stud.DEPTH + plywood.THICKNESS,
  orientation: "south"
})

stud({
  section: back,
  orientation: "east",
  left: stud.DEPTH + plywood.THICKNESS
})

stud({
  section: back,
  orientation: "west",
  left: 16 - plywood.THICKNESS - stud.WIDTH/2
})

stud({
  section: back,
  orientation: "west",
  left: 16*2 - plywood.THICKNESS - stud.WIDTH/2
})

stud({
  section: back,
  orientation: "west",
  left: 48 - plywood.THICKNESS - stud.WIDTH/2
})

// BACK RIGHT

plywood({
  section: back,
  width: 48,
  left: 48-plywood.THICKNESS,
  top: -plywood.THICKNESS,
  orientation: "north"
})

plywood({
  section: back,
  width: 48 - stud.DEPTH - 2*plywood.THICKNESS,
  left: 48-plywood.THICKNESS,
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

// FRONT WALL

var distanceIn = plywood.THICKNESS + stud.DEPTH + trim.THICKNESS*2 + door.WIDTH*2

var front = section({
  top: 48+24,
  left: distanceIn
})

plywood({
  section: front,
  width: 96 - distanceIn - plywood.THICKNESS,
  orientation: "south"
})

plywood({
  section: front,
  width: 96 - distanceIn - plywood.THICKNESS*3 - stud.DEPTH,
  bottom: stud.DEPTH,
  orientation: "north"
})

stud({
  section: front,
  orientation: "east",
  bottom: 0
})

stud({
  section: front,
  orientation: "east",
  bottom: 0,
  left: 12
})

stud({
  section: front,
  orientation: "west",
  bottom: 0,
  left: 96 - distanceIn - plywood.THICKNESS*3 - stud.DEPTH - stud.WIDTH
})


}




// DOOR OPENING

function doors(section, plywood, trim, door, stud) {

var opening = section({
  name: "opening",
  top: 72,
  left: stud.DEPTH+plywood.THICKNESS
})

var jambWidth = trim.THICKNESS*2 + plywood.THICKNESS*2 + stud.DEPTH

trim({
  section: opening,
  name: "bottom-door-jamb",
  height: jambWidth,
  bottom: -trim.THICKNESS - plywood.THICKNESS
})

plywood({
  section: opening,
  width: stud.DEPTH + plywood.THICKNESS*2,
  left: -plywood.THICKNESS*2 - stud.DEPTH,
  orientation: "south"
})

trim({
  section: opening,
  name: "left-door-trim",
  width: trim.THICKNESS+plywood.THICKNESS*2+stud.DEPTH,
  bottom: -plywood.THICKNESS - trim.THICKNESS,
  right: 0
})


door({
  section: opening,
  left: trim.THICKNESS,
  bottom: 0
})

door({
  section: opening,
  left: trim.THICKNESS+door.WIDTH,
  bottom: 0,
  orientation: "east"
})


trim({
  section: opening,
  name: "top-door-jamb",
  height: jambWidth,
  bottom: -trim.THICKNESS - plywood.THICKNESS,
  left: trim.THICKNESS+door.WIDTH*2
})

trim({
  section: opening,
  name: "right-door-trim",
  width: BATTEN_WIDTH,
  bottom: -trim.THICKNESS - plywood.THICKNESS,
  left: trim.THICKNESS+door.WIDTH*2+trim.THICKNESS
})

}






// BATTENS

function battens(section, trim, plywood) {

var battens = section({
  left: 0,
  top: 0
})

function sideBatten(top, left) {
  trim({
    section: battens,
    height: BATTEN_WIDTH,
    left: left,
    top: top
  })
}


// West Side

var left = -plywood.THICKNESS-trim.THICKNESS

sideBatten(-plywood.THICKNESS, left)
sideBatten(24 - BATTEN_WIDTH/2, left)
sideBatten(48 - BATTEN_WIDTH/2, left)
sideBatten(72 + plywood.THICKNESS - BATTEN_WIDTH, left)


// Right Front Corner

trim({
  section: battens,
  height: BATTEN_WIDTH,
  left: 96 - plywood.THICKNESS,
  top: 72 - BATTEN_WIDTH + plywood.THICKNESS + trim.THICKNESS
})

trim({
  section: battens,
  width: BATTEN_WIDTH,
  left: 96 - plywood.THICKNESS - BATTEN_WIDTH,
  top: 72 + plywood.THICKNESS
})

// East Side

var left = 96 - plywood.THICKNESS

sideBatten(-plywood.THICKNESS, left)
sideBatten(24 - BATTEN_WIDTH/2, left)
sideBatten(48 - BATTEN_WIDTH/2, left)


// Back

function backBatten(left) {
  trim({
    section: battens,
    width: BATTEN_WIDTH,
    left: left,
    top: -plywood.THICKNESS - trim.THICKNESS
  })
}

backBatten(-plywood.THICKNESS - trim.THICKNESS)

backBatten(24 - plywood.THICKNESS - BATTEN_WIDTH/2)

backBatten(48 - plywood.THICKNESS - BATTEN_WIDTH/2)

backBatten(48 + 24 - plywood.THICKNESS - BATTEN_WIDTH/2)

backBatten(96 - plywood.THICKNESS - BATTEN_WIDTH + trim.THICKNESS)

}





// ROOF

function roof(section, trim, twinWall, plywood) {

var roof = section({
  left: 0,
  top: 0
})

var roofProjection = Math.sqrt(96*96+12*12)

twinWall({
  section: roof,
  width: 48 - plywood.THICKNESS - 0.75 - 0.75,
  top: -6,
  left: 0.75,
  height: roofProjection
})

trim({
  section: roof,
  width: 7.5,
  height: roofProjection,
  top: -6,
  left: -5
})

trim({
  section: roof,
  width: 0.75,
  height: roofProjection,
  top: -6,
  left: 0
})

var centerLine = 48 - plywood.THICKNESS

trim({
  section: roof,
  width: 1.5,
  height: roofProjection,
  left: centerLine - 0.75,
  top: -6
})

trim({
  section: roof,
  width: 0.75,
  height: roofProjection,
  top: -6,
  left: centerLine - 0.75*2
})

trim({
  section: roof,
  width: 0.75,
  height: roofProjection,
  top: -6,
  left: centerLine + 0.75
})

trim({
  section: roof,
  width: 7.5,
  height: roofProjection,
  left: centerLine - 7.5/2,
  top: -6
})

twinWall({
  section: roof,
  width: 48 - 0.75 - plywood.THICKNESS - 0.75,
  top: -6,
  left: centerLine+0.75,
  height: roofProjection
})

trim({
  section: roof,
  width: 7.5,
  height: roofProjection,
  top: -6,
  left: 96 - plywood.THICKNESS * 2 - 2.5
})

trim({
  section: roof,
  width: 0.75,
  height: roofProjection,
  top: -6,
  left: 96 - plywood.THICKNESS*2 - 0.75
})

}