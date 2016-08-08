var BATTEN_WIDTH = 1.75

drawPlan.setView("top")

drawPlan(walls)
drawPlan(battens)
drawPlan(roof)
drawPlan(doors)
drawPlan(floor)



function floor(section, frontStud, plywood, stud) {

  var floor = section({
    name: "floor",
    xPos: 0,
    zPos: 0
  })

  frontStud({
    section: floor,
    xSize: 96 - plywood.THICKNESS*2
  })

  frontStud({
    section: floor,
    xSize: 96 - plywood.THICKNESS*2,
    zPos: 72 - stud.WIDTH
  })

  frontStud({
    section: floor,
    height: 72,
    xPos: 0
  })

  for(var i=1; i<6; i++) {
    frontStud({
      section: floor,
      height: 72,
      xPos: i*16 - stud.WIDTH/2
    })
  }

  frontStud({
    section: floor,
    height: 72,
    xPos: 96 - plywood.THICKNESS*2 - stud.WIDTH
  })

  plywood({
    section: floor,
    xSize: 48,
    height: 72,
    orientation: "in"
  })

  plywood({
    section: floor,
    xPos: 48,
    xSize: 48-plywood.THICKNESS*2,
    height: 72,
    orientation: "in"
  })

}


// WALLS

function walls(stud, plywood, section, trim, door) {

// BACK

var back = section({
  xPos: 0,
  zPos: 0
})

plywood({
  section: back,
  xSize: 48,
  zPos: -plywood.THICKNESS,
  xPos: -plywood.THICKNESS,
  orientation: "north"
})

plywood({
  section: back,
  xSize: 48 - stud.DEPTH - 2*plywood.THICKNESS,
  zPos: stud.DEPTH,
  xPos: stud.DEPTH + plywood.THICKNESS,
  orientation: "south"
})

stud({
  section: back,
  orientation: "east",
  xPos: stud.DEPTH + plywood.THICKNESS
})

stud({
  section: back,
  orientation: "west",
  xPos: 16 - plywood.THICKNESS - stud.WIDTH/2
})

stud({
  section: back,
  orientation: "west",
  xPos: 16*2 - plywood.THICKNESS - stud.WIDTH/2
})

stud({
  section: back,
  orientation: "west",
  xPos: 48 - plywood.THICKNESS - stud.WIDTH/2
})

// BACK RIGHT

plywood({
  section: back,
  xSize: 48,
  xPos: 48-plywood.THICKNESS,
  zPos: -plywood.THICKNESS,
  orientation: "north"
})

plywood({
  section: back,
  xSize: 48 - stud.DEPTH - 2*plywood.THICKNESS,
  xPos: 48-plywood.THICKNESS,
  zPos: stud.DEPTH,
  orientation: "south"
})

stud({
  section: back,
  orientation: "west",
  xPos: 48 - plywood.THICKNESS + 16 - stud.WIDTH/2
})

stud({
  section: back,
  orientation: "west",
  xPos: 48 - plywood.THICKNESS + 2*16 - stud.WIDTH/2
})

stud({
  section: back,
  orientation: "west",
  xPos: 48*2 - plywood.THICKNESS*3 - stud.WIDTH-stud.DEPTH
})

// SIDES

sideWall({
  xPos: 0,
  zPos: 0
})

sideWall({
  xPos: 96 - stud.DEPTH - plywood.THICKNESS*2,
  zPos: 0
})

function sideWall(position) {

  var long = section(position)

  stud({
    section: long,
    zPos: 0,
    orientation: "south"
  })

  stud({
    section: long,
    zPos: 16 - stud.WIDTH/2
  })

  stud({
    section: long,
    zPos: 16*2 - stud.WIDTH/2
  })

  stud({
    section: long,
    zPos: 48 - stud.WIDTH/2
  })

  plywood({
    section: long,
    height: 48,
    xPos: -plywood.THICKNESS,
    orientation: "west"
  })

  plywood({
    section: long,
    height: 24,
    xPos: stud.DEPTH,
    orientation: "east"
  })

  stud({
    section: long,
    zPos: 48+12 - stud.WIDTH/2
  })

  stud({
    section: long,
    zPos: 48+24 - stud.WIDTH
  })

  plywood({
    section: long,
    height: 24,
    zPos: 48,
    xPos: -plywood.THICKNESS,
    orientation: "west"
  })

  plywood({
    section: long,
    height: 48,
    zPos: 24,
    xPos: stud.DEPTH,
    orientation: "east"
  })
}

// FRONT WALL

var distanceIn = plywood.THICKNESS + stud.DEPTH + trim.THICKNESS*2 + door.WIDTH*2

var front = section({
  zPos: 48+24,
  xPos: distanceIn
})

plywood({
  section: front,
  xSize: 96 - distanceIn - plywood.THICKNESS,
  orientation: "south"
})

plywood({
  section: front,
  xSize: 96 - distanceIn - plywood.THICKNESS*3 - stud.DEPTH,
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
  xPos: 12
})

stud({
  section: front,
  orientation: "west",
  bottom: 0,
  xPos: 96 - distanceIn - plywood.THICKNESS*3 - stud.DEPTH - stud.WIDTH
})


}




// DOOR OPENING

function doors(section, plywood, trim, door, stud) {

var opening = section({
  name: "opening",
  zPos: 72,
  xPos: stud.DEPTH+plywood.THICKNESS
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
  xSize: stud.DEPTH + plywood.THICKNESS*2,
  xPos: -plywood.THICKNESS*2 - stud.DEPTH,
  orientation: "south"
})

trim({
  section: opening,
  name: "left-door-trim",
  xSize: trim.THICKNESS+plywood.THICKNESS*2+stud.DEPTH,
  bottom: -plywood.THICKNESS - trim.THICKNESS,
  right: 0
})


door({
  section: opening,
  xPos: trim.THICKNESS,
  bottom: 0
})

door({
  section: opening,
  xPos: trim.THICKNESS+door.WIDTH,
  bottom: 0,
  orientation: "east"
})


trim({
  section: opening,
  name: "top-door-jamb",
  height: jambWidth,
  bottom: -trim.THICKNESS - plywood.THICKNESS,
  xPos: trim.THICKNESS + door.WIDTH*2
})

trim({
  section: opening,
  name: "right-door-trim",
  xSize: BATTEN_WIDTH,
  bottom: -trim.THICKNESS - plywood.THICKNESS,
  xPos: trim.THICKNESS + door.WIDTH*2 + trim.THICKNESS
})

}






// BATTENS

function battens(section, trim, plywood) {

var battens = section({
  xPos: 0,
  zPos: 0
})

function sideBatten(zPos, xPos) {
  trim({
    section: battens,
    height: BATTEN_WIDTH,
    xPos: xPos,
    zPos: zPos
  })
}


// West Side

var xPos = -plywood.THICKNESS-trim.THICKNESS

sideBatten(-plywood.THICKNESS, xPos)
sideBatten(24 - BATTEN_WIDTH/2, xPos)
sideBatten(48 - BATTEN_WIDTH/2, xPos)
sideBatten(72 + plywood.THICKNESS - BATTEN_WIDTH, xPos)


// Right Front Corner

trim({
  section: battens,
  height: BATTEN_WIDTH,
  xPos: 96 - plywood.THICKNESS,
  zPos: 72 - BATTEN_WIDTH + plywood.THICKNESS + trim.THICKNESS
})

trim({
  section: battens,
  xSize: BATTEN_WIDTH,
  xPos: 96 - plywood.THICKNESS - BATTEN_WIDTH,
  zPos: 72 + plywood.THICKNESS
})

// East Side

var xPos = 96 - plywood.THICKNESS

sideBatten(-plywood.THICKNESS, xPos)
sideBatten(24 - BATTEN_WIDTH/2, xPos)
sideBatten(48 - BATTEN_WIDTH/2, xPos)


// Back

function backBatten(xPos) {
  trim({
    section: battens,
    xSize: BATTEN_WIDTH,
    xPos: xPos,
    zPos: -plywood.THICKNESS - trim.THICKNESS
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
  xPos: 0,
  zPos: 0
})

var roofProjection = Math.sqrt(96*96+12*12)

twinWall({
  section: roof,
  xSize: 48 - plywood.THICKNESS - 0.75 - 0.75,
  zPos: -6,
  xPos: 0.75,
  height: roofProjection
})

trim({
  section: roof,
  xSize: 7.5,
  height: roofProjection,
  zPos: -6,
  xPos: -5
})

trim({
  section: roof,
  xSize: 0.75,
  height: roofProjection,
  zPos: -6,
  xPos: 0
})

var centerLine = 48 - plywood.THICKNESS

trim({
  section: roof,
  xSize: 1.5,
  height: roofProjection,
  xPos: centerLine - 0.75,
  zPos: -6
})

trim({
  section: roof,
  xSize: 0.75,
  height: roofProjection,
  zPos: -6,
  xPos: centerLine - 0.75*2
})

trim({
  section: roof,
  xSize: 0.75,
  height: roofProjection,
  zPos: -6,
  xPos: centerLine + 0.75
})

trim({
  section: roof,
  xSize: 7.5,
  height: roofProjection,
  xPos: centerLine - 7.5/2,
  zPos: -6
})

twinWall({
  section: roof,
  xSize: 48 - 0.75 - plywood.THICKNESS - 0.75,
  zPos: -6,
  xPos: centerLine+0.75,
  height: roofProjection
})

trim({
  section: roof,
  xSize: 7.5,
  height: roofProjection,
  zPos: -6,
  xPos: 96 - plywood.THICKNESS * 2 - 2.5
})

trim({
  section: roof,
  xSize: 0.75,
  height: roofProjection,
  zPos: -6,
  xPos: 96 - plywood.THICKNESS*2 - 0.75
})

}