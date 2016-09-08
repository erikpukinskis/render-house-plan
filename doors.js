
function doors(section, door, trim, plywood, stud, sloped, verticalSlice,options) {

  var opening = section(options)

  var jambWidth = plywood.THICKNESS*2 + stud.DEPTH + 0.5

  door({
    section: opening,
    name: "left-door",
    xPos: DOOR_GAP + trim.THICKNESS,
    xSize: door.WIDTH,
    yPos: DOOR_GAP + trim.THICKNESS,
    zPos: 0,
    zSize: -door.THICKNESS,
    orientation: "east"
  })

  door({
    section: opening,
    name: "right-door",
    xPos: DOOR_GAP + trim.THICKNESS + door.WIDTH,
    xSize: door.WIDTH,
    yPos: DOOR_GAP + trim.THICKNESS,
    zPos: 0,
    zSize: -door.THICKNESS,
    orientation: "west"
  })

  plywood({
    section: opening,
    name: "below-door-sheathing",
    xPos: 0,
    xSize: door.WIDTH*2 + DOOR_GAP*2 + trim.THICKNESS*2,
    yPos: DOOR_GAP + trim.THICKNESS*2 + door.HEIGHT,
    ySize: wholeFloorHeight,
    orientation: "south"
  })

  var jambDepth = plywood.THICKNESS

  trim({
    section: opening,
    name: "left-door-jamb",
    xPos: DOOR_GAP,
    zSize: -jambWidth,
    ySize: door.HEIGHT,
    zPos: jambDepth,
    yPos: DOOR_GAP + trim.THICKNESS
  })

  trim({
    section: opening,
    name: "right-door-jamb",
    xPos: DOOR_GAP + trim.THICKNESS + door.WIDTH*2,
    zSize: -jambWidth,
    ySize: door.HEIGHT,
    zPos: jambDepth,
    yPos: DOOR_GAP + trim.THICKNESS
  })

  trim({
    section: opening,
    name: "top-door-jamb",
    xPos: DOOR_GAP,
    xSize: trim.THICKNESS*2 + door.WIDTH*2,
    zSize: -jambWidth,
    zPos: jambDepth,
    yPos: DOOR_GAP
  })

  trim({
    section: opening,
    name: "bottom-door-jamb",
    xPos: DOOR_GAP,
    xSize: trim.THICKNESS*2 + door.WIDTH*2,
    zSize: -jambWidth,
    yPos: door.HEIGHT + DOOR_GAP + trim.THICKNESS,
    zPos: jambDepth
  })


  var bg2 = "rgba(255,150,0,0.9)"
  var bg3 = "rgba(170,255,0,0.9)"
  var bg = bg2 = bg3 = null //"rgba(255,255,0,0.9)"

  var belowDoorTrimHeight = wholeFloorHeight + trim.THICKNESS

  var fatTrimWidth = trim.THICKNESS*2 + plywood.THICKNESS*2 + stud.DEPTH + DOOR_GAP

  var skinnyTrimWidth = BATTEN_WIDTH

  trim({
    section: opening,
    name: "below-door-trim",
    background: bg2,
    xPos: DOOR_GAP + trim.THICKNESS,
    xSize: door.WIDTH*2,
    ySize: belowDoorTrimHeight,
    yPos: DOOR_GAP + trim.THICKNESS + 80,
    zPos: plywood.THICKNESS
  })

  trim({
    section: opening,
    name: "above-door-trim",
    background: bg,
    xPos: DOOR_GAP + trim.THICKNESS - fatTrimWidth,
    xSize: 96 + trim.THICKNESS*2,
    ySize: -HEADER_TRIM,
    yPos: DOOR_GAP + trim.THICKNESS,
    zPos: plywood.THICKNESS
  })

  trim({
    section: opening,
    name: "left-door-trim",
    background: bg2,
    xSize: fatTrimWidth,
    xPos: - trim.THICKNESS - plywood.THICKNESS*2 - stud.DEPTH,
    yPos: DOOR_GAP + trim.THICKNESS,
    ySize: door.HEIGHT + trim.THICKNESS + wholeFloorHeight,
    zPos: plywood.THICKNESS
  })

  trim({
    section: opening,
    name: "right-door-trim",
    background: bg2,
    xSize: fatTrimWidth,
    xPos: DOOR_GAP + trim.THICKNESS + door.WIDTH * 2,
    yPos: DOOR_GAP + trim.THICKNESS,
    ySize: door.HEIGHT + trim.THICKNESS + wholeFloorHeight,
    zPos: plywood.THICKNESS,
  })

  var xOrigin = -plywood.THICKNESS*2 - stud.DEPTH - trim.THICKNESS

  trim({
    section: opening,
    name: "front-right-corner-trim",
    background: bg3,
    yPos: DOOR_GAP + trim.THICKNESS,
    ySize: door.HEIGHT + trim.THICKNESS + wholeFloorHeight,
    xSize: -skinnyTrimWidth,
    xPos: 96 - plywood.THICKNESS*2 - stud.DEPTH + trim.THICKNESS,
    zPos: plywood.THICKNESS,
  })

}
