var BATTEN_WIDTH = 1.75
var RAFTER_THICKNESS = 1.5

drawPlan.setView("top")

drawPlan(battens)
drawPlan(roof)
drawPlan(doors)
drawPlan(floor)
drawPlan(backWall)
drawPlan(frontWall)
drawPlan(sideWall, {
  xPos: 0,
  zPos: 0
})
drawPlan(sideWall, {
  xPos: 96 - drawPlan.parts.stud.DEPTH - drawPlan.parts.plywood.THICKNESS*2,
  zPos: 0
})



function floor(section, plywood, stud) {

  var floor = section({
    name: "floor",
    xPos: 0,
    zPos: 0
  })

  stud({
    section: floor,
    name: "back-floor-joist",
    xSize: 96 - plywood.THICKNESS*2,
    orientation: "horizontal-south"
  })

  stud({
    section: floor,
    name: "front-floor-joist",
    xSize: 96 - plywood.THICKNESS*2,
    zPos: 72 - stud.WIDTH,
    orientation: "horizontal-north"
  })

  stud({
    section: floor,
    name: "floor-joist-left",
    orientation: "horizontal-east",
    zSize: 72,
    xPos: 0,
  })

  for(var i=1; i<6; i++) {
    stud({
      section: floor,
      name: "floor-joist-"+(i+1),
      orientation: "horizontal-west",
      zSize: 72,
      xPos: i*16 - stud.WIDTH/2
    })
  }

  stud({
    section: floor,
    name: "floor-joist-right",
    orientation: "horizontal-west",
    zSize: 72,
    xPos: 96 - plywood.THICKNESS*2 - stud.WIDTH
  })

  plywood({
    section: floor,
    name: "left-subfloor",
    xSize: 48,
    zSize: 72,
    orientation: "up"
  })

  plywood({
    section: floor,
    name: "right-subfloor",
    xPos: 48,
    xSize: 48-plywood.THICKNESS*2,
    zSize: 72,
    orientation: "up"
  })

}


function backWall(stud, plywood, section, trim, door) {

  var back = section({
    xPos: 0,
    zPos: 0
  })

  plywood({
    section: back,
    name: "back-left-sheathing",
    xPos: -plywood.THICKNESS,
    xSize: 48,
    zPos: -plywood.THICKNESS,
    orientation: "north"
  })

  plywood({
    section: back,
    name: "back-left-interior",
    xSize: 48 - stud.DEPTH - 2*plywood.THICKNESS,
    zPos: stud.DEPTH,
    xPos: stud.DEPTH + plywood.THICKNESS,
    orientation: "south"
  })


  // BACK RIGHT

  plywood({
    section: back,
    name: "back-right-sheathing",
    xSize: 48,
    xPos: 48-plywood.THICKNESS,
    zPos: -plywood.THICKNESS,
    orientation: "north"
  })

  plywood({
    section: back,
    name: "back-right-interior",
    xSize: 48 - stud.DEPTH - 2*plywood.THICKNESS,
    xPos: 48-plywood.THICKNESS,
    zPos: stud.DEPTH,
    orientation: "south"
  })

  stud({
    section: back,
    name: "back-stud-1",
    orientation: "east",
    xPos: stud.DEPTH + plywood.THICKNESS
  })

  stud({
    section: back,
    name: "back-stud-2",
    orientation: "west",
    xPos: 16 - plywood.THICKNESS - stud.WIDTH/2
  })

  stud({
    section: back,
    name: "back-stud-3",
    orientation: "west",
    xPos: 16*2 - plywood.THICKNESS - stud.WIDTH/2
  })

  stud({
    section: back,
    name: "back-stud-4",
    orientation: "west",
    xPos: 48 - plywood.THICKNESS - stud.WIDTH/2
  })

  stud({
    section: back,
    name: "back-stud-5",
    orientation: "west",
    xPos: 48 - plywood.THICKNESS + 16 - stud.WIDTH/2
  })

  stud({
    section: back,
    name: "back-stud-6",
    orientation: "west",
    xPos: 48 - plywood.THICKNESS + 2*16 - stud.WIDTH/2
  })

  stud({
    section: back,
    name: "back-stud-7",
    orientation: "west",
    xPos: 48*2 - plywood.THICKNESS*3 - stud.WIDTH-stud.DEPTH
  })

}

function sideWall(section, stud, plywood, position, side) {

  var long = section(position)

  stud({
    section: long,
    name: "side-"+side+"-stud-1",
    zPos: 0,
    orientation: "south"
  })

  stud({
    section: long,
    name: "side-"+side+"-stud-2",
    zPos: 16 - stud.WIDTH/2,
    orientation: "north"
  })

  stud({
    section: long,
    name: "side-"+side+"-stud-3",
    zPos: 16*2 - stud.WIDTH/2,
    orientation: "north"
  })

  stud({
    section: long,
    name: "side-"+side+"-stud-4",
    zPos: 48 - stud.WIDTH/2,
    orientation: "north"
  })

  plywood({
    section: long,
    name: "side-"+side+"-wide-sheathing",
    zSize: 48,
    xPos: -plywood.THICKNESS,
    orientation: "west"
  })

  plywood({
    section: long,
    name: "side-"+side+"-wide-interior",
    zSize: 48,
    xPos: stud.DEPTH,
    orientation: "east"
  })

  stud({
    section: long,
    name: "side-"+side+"-stud-5",
    zPos: 48+12 - stud.WIDTH/2,
    orientation: "north"
  })

  stud({
    section: long,
    name: "side-"+side+"-stud-6",
    zPos: 48+24 - stud.WIDTH,
    orientation: "north"
  })

  plywood({
    section: long,
    name: "side-"+side+"-narrow-sheathing",
    zSize: 24,
    zPos: 48,
    xPos: -plywood.THICKNESS,
    orientation: "west"
  })

  plywood({
    section: long,
    name: "side-"+side+"-narrow-interior",
    zSize: 24,
    zPos: 48,
    xPos: stud.DEPTH,
    orientation: "east"
  })
}


function frontWall(section, plywood, trim, stud, door) {

  var distanceIn = plywood.THICKNESS + stud.DEPTH + trim.THICKNESS*2 + door.WIDTH*2

  var front = section({
    zPos: 48+24,
    xPos: distanceIn
  })

  plywood({
    section: front,
    name: "front-sheathing",
    xSize: 96 - distanceIn - plywood.THICKNESS,
    orientation: "south"
  })

  plywood({
    section: front,
    name: "front-interior",
    xSize: 96 - distanceIn - plywood.THICKNESS*3 - stud.DEPTH,
    bottom: stud.DEPTH,
    orientation: "north"
  })

  stud({
    section: front,
    name: "front-stud-1",
    orientation: "east",
    bottom: 0
  })

  stud({
    section: front,
    name: "front-stud-2",
    orientation: "east",
    bottom: 0,
    xPos: 12
  })

  stud({
    section: front,
    name: "front-stud-3",
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
  zSize: jambWidth,
  bottom: -trim.THICKNESS - plywood.THICKNESS
})

plywood({
  section: opening,
  name: "left-of-door-sheathing",
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
  zSize: jambWidth,
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
      zSize: BATTEN_WIDTH,
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
    zSize: BATTEN_WIDTH,
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

  // FIXME: top view is correct for new design so we can finish names

  twinWall({
    section: roof,
    name: "left-twin-wall",
    xSize: 48 - plywood.THICKNESS - RAFTER_THICKNESS*1.5,
    zPos: -6,
    xPos: RAFTER_THICKNESS,
    zSize: roofProjection
  })

  trim({
    section: roof,
    name: "left-roof-cap",
    xSize: 7.5,
    zSize: roofProjection,
    zPos: -6,
    xPos: -5
  })

  trim({
    section: roof,
    name: "left-rafter",
    xSize: RAFTER_THICKNESS,
    zSize: roofProjection,
    zPos: -6,
    xPos: 0
  })

  var centerLine = 48 - plywood.THICKNESS

  trim({
    section: roof,
    name: "center-rafter",
    xSize: RAFTER_THICKNESS,
    zSize: roofProjection,
    xPos: centerLine - 0.75,
    zPos: -6
  })

  // trim({
  //   section: roof,
  //   name: "left-twin-wall-right-rail",
  //   xSize: 0.75,
  //   zSize: roofProjection,
  //   zPos: -6,
  //   xPos: centerLine - 0.75*2
  // })

  // trim({
  //   section: roof,
  //   name: "right-twin-wall-left-rail",
  //   xSize: 0.75,
  //   zSize: roofProjection,
  //   zPos: -6,
  //   xPos: centerLine + 0.75
  // })

  trim({
    section: roof,
    name: "center-roof-cap",
    xSize: 7.5,
    zSize: roofProjection,
    xPos: centerLine - 7.5/2,
    zPos: -6
  })

  twinWall({
    section: roof,
    name: "right-twin-wall",
    xSize: 48 - RAFTER_THICKNESS*1.5 - plywood.THICKNESS,
    zPos: -6,
    xPos: centerLine+0.75,
    zSize: roofProjection
  })

  trim({
    section: roof,
    name: "right-roof-cap",
    xSize: 7.5,
    zSize: roofProjection,
    zPos: -6,
    xPos: 96 - plywood.THICKNESS * 2 - 2.5
  })

  trim({
    section: roof,
    name: "right-rafter",
    xSize: RAFTER_THICKNESS,
    zSize: roofProjection,
    zPos: -6,
    xPos: 96 - plywood.THICKNESS*2 - RAFTER_THICKNESS
  })

}