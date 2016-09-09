
function roof(section, twinWall, trim, stud, plywood, tilted, verticalSlice, shade) {

  var roof = section({
    name: "roof",
    zPos: rafterStart.zPos,
    yPos: rafterStart.yPos
  })

  var roofLength = Math.sqrt(96*96 - 12*12)

  var backOverhang = 8
  function rafter(xPos, name) {

    tilted({
      part: trim,
      name: name,
      section: roof,
      slope: SLOPE,
      xPos: xPos,
      xSize: RAFTER_WIDTH,
      yPos: -RAFTER_HEIGHT + backOverhang*SLOPE,
      ySize: RAFTER_HEIGHT,
      zPos: -backOverhang,
      zSize: roofLength,
    })

  }

  var centerLine = 48 - plywood.THICKNESS

  rafter(0, "left-rafter")

  var yPos = -RAFTER_HEIGHT + backOverhang*SLOPE

  rafter(centerLine - 0.75, "center-rafter")

  rafter(96 - plywood.THICKNESS*2 - RAFTER_WIDTH, "right-rafter")

  var roofHeight = RAFTER_HEIGHT - stud.DEPTH*SLOPE

  function roofCap(xPos, name) {

    tilted({
      part: trim,
      section: roof,
      name: name,
      slope: SLOPE,
      xPos: xPos,
      xSize: 7.5,
      yPos: -verticalSlice(RAFTER_HEIGHT + trim.THICKNESS, SLOPE) + backOverhang*SLOPE,
      ySize: trim.THICKNESS,
      zPos: -backOverhang,
      zSize: roofLength
    })

  }

  roofCap(-5, "left-roof-cap")

  roofCap(centerLine - 7.5/2, "center-roof-cap")

  roofCap(96 - plywood.THICKNESS * 2 - 2.5, "right-roof-cap")

  function roofPanel(options) {

    tilted(merge(options, {
      part: twinWall,
      section: roof,
      slope: SLOPE,
      yPos: -RAFTER_HEIGHT - plywood.THICKNESS*SLOPE + backOverhang*SLOPE,
      ySize: TWIN_WALL_THICKNESS,
      zPos: -backOverhang,
      zSize: roofLength
    }))

  }

  roofPanel({
    name: "left-twin-wall",
    xPos: RAFTER_WIDTH,
    xSize: 48 - plywood.THICKNESS - RAFTER_WIDTH*1.5
  })

  roofPanel({
    name: "right-twin-wall",
    xPos: centerLine+0.75,
    xSize: 48 - RAFTER_WIDTH*1.5 - plywood.THICKNESS
  })

  var rafterPositions = {
    "left": RAFTER_WIDTH,
    "center-left": centerLine - RAFTER_WIDTH/2 - 1.5,
    "center-right": centerLine + RAFTER_WIDTH/2,
    "right": 96 - plywood.THICKNESS*2 - stud.DEPTH - 0.5
  }

  var shadeRail = {
    part: trim,
    section: roof,
    slope: SLOPE,
    xSize: 1.5,
    yPos: (plywood.THICKNESS + stud.DEPTH - RAFTER_WIDTH)*SLOPE,
    ySize: -1,
    zPos: -plywood.THICKNESS - stud.DEPTH + RAFTER_WIDTH,
    zSize: 72 - RAFTER_WIDTH*2 - 5
  }

  var roofRail = merge(shadeRail, {
    yPos: (plywood.THICKNESS + stud.DEPTH - RAFTER_WIDTH)*SLOPE - verticalSlice(RAFTER_HEIGHT - TWIN_WALL_THICKNESS, SLOPE),
    ySize: 1,
  })

  for(var rafterName in rafterPositions) {

    tilted(shadeRail, {
      name: rafterName+"-shade-rail",
      xPos: rafterPositions[rafterName],
    })

    tilted(roofRail, {
      name: rafterName+"-roof-rail",
      xPos: rafterPositions[rafterName],
    })

  }


  tilted({
    section: roof,
    name: "left-ceiling-shade",
    part: shade,
    slope: SLOPE,
    xPos: 2,
    xSize: 44.5,
    ySize: -0.5,
    yPos: -verticalSlice(1.5, SLOPE),
    zSize: 72 - stud.DEPTH*2 - plywood.THICKNESS*2,
    zPos: 0,
  })


  // tilted({
  //   section: roof,
  //   name: "right-ceiling-shade",
  //   part: shade,
  //   slope: SLOPE,
  //   xPos: 49,
  //   xSize: 44.5,
  //   ySize: -0.5,
  //   yPos: -verticalSlice(1.5, SLOPE),
  //   zSize: 72 - stud.DEPTH*2 - plywood.THICKNESS*2,
  //   zPos: 0,
  // })


}
