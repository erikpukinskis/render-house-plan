var BACK_STUD_HEIGHT = 80
var BATTEN_WIDTH = 1.75
var FLOOR_TOP = 96
var DOOR_GAP = 1/4 // no gap below?
var SLOPE = 1/6
var SUBFLOOR_THICKNESS = 0.75
var TWIN_WALL_THICKNESS = 7/16
var RAFTER_HEIGHT = 3.5

var floorSectionHeight = SUBFLOOR_THICKNESS + drawPlan.parts.stud.DEPTH + drawPlan.parts.plywood.THICKNESS

var rafterStart = {
  zPos: drawPlan.parts.stud.DEPTH + drawPlan.parts.plywood.THICKNESS,
  yPos: FLOOR_TOP - BACK_STUD_HEIGHT
}

var betweenRafterIntersections = 72 - rafterStart.zPos
var elevationBetweenIntersections = betweenRafterIntersections*SLOPE

var headerRafterIntersection = {
  zPos: 72,
  yPos: rafterStart.yPos - elevationBetweenIntersections
}

var doorFramingTop = FLOOR_TOP - 80 - 0.75*2 - DOOR_GAP*2

var headerHeight = doorFramingTop - headerRafterIntersection.yPos


var backPlateLeftHeight = RAFTER_HEIGHT - (drawPlan.parts.stud.DEPTH+drawPlan.parts.plywood.THICKNESS*SLOPE)*SLOPE

var backPlateRightHeight = backPlateLeftHeight + 1.5*SLOPE


function draw(view) {
  drawPlan.clear()
  drawPlan.setView(view)

  // drawPlan(floor)
  // drawPlan(header)
  // drawPlan(backWall)
  drawPlan(sideWall, {
    xPos: 0,
    zPos: 0
  })
  // drawPlan(sideWall, {
  //   xPos: 96 - drawPlan.parts.stud.DEPTH - drawPlan.parts.plywood.THICKNESS*2,
  //   zPos: 0
  // })
  // drawPlan(doors)
  // drawPlan(roof)

}

draw("top")

function roof(section, trim, stud, plywood, tilted, twinWallSide, verticalSlice) {

  var roof = section({
    name: "roof",
    zPos: rafterStart.zPos,
    yPos: rafterStart.yPos
  })

  tilted({
    part: trim,
    name: "left-rafter",
    section: roof,
    yPos: -RAFTER_HEIGHT - plywood.THICKNESS*SLOPE,
    length: 96,
    slope: SLOPE,
    zPos: -8,
    ySize: RAFTER_HEIGHT
  })


  var roofHeight = RAFTER_HEIGHT - stud.DEPTH*SLOPE

  tilted({
    part: trim,
    section: roof,
    name: "left-roof-cap",
    ySize: trim.THICKNESS,
    yPos: -RAFTER_HEIGHT - plywood.THICKNESS*SLOPE -  verticalSlice(trim.THICKNESS, SLOPE),
    zPos: -8,
    length: 96,
    slope: SLOPE
  })

  tilted({
    part: twinWallSide,
    name: "twin-wall",
    section: roof,
    yPos: -3.5 - plywood.THICKNESS*SLOPE,
    ySize: TWIN_WALL_THICKNESS,
    length: 96,
    slope: SLOPE,
    zPos: -8
  })  

}


function doors(section, trim, plywood, stud) {

  var opening = section({
    name: "door",
    yPos: doorFramingTop,
    zPos: 72,
  })

  plywood({
    section: opening,
    name: "left-of-door-sheathing",
    ySize: 77,
    yPos: 3,
    orientation: "south"
  })

  plywood({
    section: opening,
    name: "below-door-sheathing",
    ySize: 2.5,
    yPos: DOOR_GAP*2 + trim.THICKNESS*2 + 80 + 0.5,
    orientation: "south"
  })

  trim({
    section: opening,
    name: "door-trim-bottom",
    ySize: DOOR_GAP + floorSectionHeight,
    yPos: DOOR_GAP + trim.THICKNESS*2 + 80,
    zPos: plywood.THICKNESS,
    orientation: "east"
  })

  var jambWidth = trim.THICKNESS*2 + plywood.THICKNESS*2 + stud.DEPTH

  trim({
    section: opening,
    name: "top-door-jamb",
    zSize: jambWidth,
    right: -plywood.THICKNESS - trim.THICKNESS,
    yPos: DOOR_GAP
  })

  trim({
    section: opening,
    name: "bottom-door-jamb",
    zSize: jambWidth,
    yPos: 80 + DOOR_GAP + trim.THICKNESS,
    right: -plywood.THICKNESS - trim.THICKNESS
  })

  trim({
    section: opening,
    name: "side-door-jamb",
    zSize: jambWidth,
    ySize: 80,
    right: -plywood.THICKNESS - trim.THICKNESS,
    yPos: DOOR_GAP + trim.THICKNESS
  })

  trim({
    section: opening,
    name: "door-trim-top",
    ySize: BATTEN_WIDTH,
    zPos: plywood.THICKNESS,
    yPos: -BATTEN_WIDTH + DOOR_GAP
  })

}


function floor(section, stud, plywood) {

  var floor = section({
    name: "floor",
    yPos: FLOOR_TOP,
    zPos: 0
  })

  plywood({
    section: floor,
    name: "left-subfloor",
    zSize: 72,
    ySize: SUBFLOOR_THICKNESS,
    yPos: 0,
    orientation: "down"
  })

  plywood({
    section: floor,
    name: "left-floor-sheathing",
    zSize: 72,
    yPos: SUBFLOOR_THICKNESS + stud.DEPTH,
    orientation: "up"
  })

  stud({
    section: floor,
    name: "floor-joist-left",
    yPos: SUBFLOOR_THICKNESS,
    zSize: 72,
    ySize: stud.DEPTH,
    orientation: "horizontal-east"
  })

  stud({
    section: floor,
    name: "back-floor-joist",
    orientation: "horizontal-south",
    yPos: SUBFLOOR_THICKNESS
  })

  stud({
    section: floor,
    name: "front-floor-joist",
    orientation: "horizontal-north",
    yPos: SUBFLOOR_THICKNESS,
    zPos: 72 - stud.WIDTH
  })

}


function sideWall(section, stud, plywood, sloped, trim, sloped) {

  var side = section({
    xPos: 0,
    zPos: 0,
    yPos: FLOOR_TOP
  })

  sloped({
    section: side,
    name: "side-1-wide-sheathing",
    part: plywood,
    xPos: -plywood.THICKNESS,
    zPos: 0,
    zSize: 48,
    ySize: plywoodHeightAt(48),
    slope: SLOPE,
    orientation: "west",
    bottom: -floorSectionHeight
  })

  sloped({
    section: side,
    name: "side-1-narrow-sheathing",
    part: plywood,
    xPos: -plywood.THICKNESS,
    zPos: 48,
    zSize: 24,
    ySize: plywoodHeightAt(48 + 24),
    slope: SLOPE,
    orientation: "west",
    bottom: -floorSectionHeight
  })

  sloped({
    section: side,
    name: "side-1-wide-interior",
    part: plywood,
    xPos: stud.DEPTH,
    zPos: 0,
    orientation: "east",
    zSize: 48,
    ySize: plywoodHeightAt(48),
    slope: SLOPE,
    bottom: -floorSectionHeight
  })

  sloped({
    section: side,
    name: "side-1-narrow-interior",
    part: plywood,
    xPos: stud.DEPTH,
    zPos: 48,
    orientation: "east",
    zSize: 24,
    ySize: plywoodHeightAt(48 + 24),
    slope: SLOPE,
    bottom: -floorSectionHeight
  })



  function plywoodHeightAt(offset) {
    var lowestHeight = BACK_STUD_HEIGHT + floorSectionHeight + backPlateLeftHeight

    var rightSideHeight = lowestHeight + offset/72*12

    return rightSideHeight
  }

  studAtOffset(0, 1)
  studAtOffset(16-stud.WIDTH/2, 2)
  studAtOffset(16*2-stud.WIDTH/2, 3)
  studAtOffset(16*3-stud.WIDTH/2, 4)
  studAtOffset(48+12-stud.WIDTH/2, 5)
  studAtOffset(72-stud.WIDTH, 6)

  function studAtOffset(offset, id) {

    var leftSideHeight = BACK_STUD_HEIGHT - (stud.DEPTH + plywood.THICKNESS)*SLOPE + offset*SLOPE + floorSectionHeight

    var rightSideHeight = leftSideHeight + stud.WIDTH*SLOPE

    var orientation = offset == 0 ? "south" : "north"

    sloped({
      section: side,
      name: "side-1-stud-"+id,
      part: stud,
      orientation: orientation,
      zSize: stud.WIDTH,
      ySize: rightSideHeight,
      slope: 1/6,
      zPos: offset,
      bottom: -floorSectionHeight
    })

  }

  // sloped({
  //   section: side,
  //   part: trim,
  //   name: "left-side-batten-4",
  //   zSize: BATTEN_WIDTH,
  //   bottom: -floorSectionHeight,
  //   zPos: 72 - BATTEN_WIDTH + plywood.THICKNESS,
  //   ySize: floorSectionHeight + DOOR_GAP*2 + 80 + trim.THICKNESS*2 + headerHeight + RAFTER_HEIGHT + plywood.THICKNESS*SLOPE,
  //   slope: SLOPE
  // })

}



function backWall(section, plywood, stud, trim, sloped) {

  var back = section({
    name: "back-wall",
    zPos: 0,
    yPos: FLOOR_TOP
  })

  // sloped({
  //   section: back,
  //   name: "left-side-batten-1",
  //   part: trim,
  //   slope: SLOPE,
  //   zSize: BATTEN_WIDTH,
  //   ySize: backBattenHeight + dh,
  //   zPos: -plywood.THICKNESS,
  //   bottom: -floorSectionHeight
  // })

  sloped({
    section: back,
    part: trim,
    slope: SLOPE,
    name: "back-batten",
    zSize: trim.THICKNESS,
    ySize: BACK_STUD_HEIGHT + floorSectionHeight + backPlateLeftHeight - plywood.THICKNESS*SLOPE,
    bottom: -floorSectionHeight,
    zPos: -plywood.THICKNESS - trim.THICKNESS
  })

  stud({
    section: back,
    name: "back-bottom-plate",
    orientation: "up",
    xSize: 1000,
    bottom: 0
  })

  plywood({
    section: back,
    name: "back-left-interior",
    zPos: stud.DEPTH,
    ySize: BACK_STUD_HEIGHT,
    orientation: "south",
    bottom: 0
  })

  stud({
    section: back,
    name: "back-top-plate",
    orientation: "down",
    xSize: 1000,
    bottom: BACK_STUD_HEIGHT - stud.WIDTH
  })

  sloped({
    part: trim,
    section: back,
    name: "back-cap",
    zSize: 1.5,
    ySize: backPlateRightHeight,
    slope: SLOPE,
    bottom: BACK_STUD_HEIGHT
  })

  plywood({
    section: back,
    name: "back-left-sheathing",
    ySize: BACK_STUD_HEIGHT + floorSectionHeight + backPlateLeftHeight,
    bottom: -floorSectionHeight,
    zPos: -plywood.THICKNESS,
    orientation: "north"
  })

}



function header(section, stud, plywood, trim, sloped, verticalSlice) {

  var header = section(headerRafterIntersection)

  stud({
    section: header,
    name: "header-top-plate",
    orientation: "down",
    xPos: 1000,
    zPos: -stud.DEPTH,
    yPos: 0
  })

  stud({
    section: header,
    name: "header-bottom-plate",
    orientation: "up",
    xPos: 1000,
    zPos: -stud.DEPTH,
    yPos: headerHeight - stud.WIDTH
  })

  plywood({
    section: header,
    name: "header-interior",
    ySize: headerHeight,
    yPos: 0,
    zPos: -stud.DEPTH - plywood.THICKNESS,
    orientation: "north"
  })

  var topPlateHeight = verticalSlice(RAFTER_HEIGHT - TWIN_WALL_THICKNESS, SLOPE)

  sloped({
    section: header,
    part: trim,
    name: "header-cap",
    bottom: 0,
    zSize: 1.5,
    ySize: topPlateHeight,
    slope: SLOPE,
    zPos: -1.5
  })

  plywood({
    section: header,
    name: "header-sheathing",
    ySize: headerHeight + topPlateHeight,
    yPos: -topPlateHeight,
    zPos: 0,
    orientation: "south"
  })

  var toTop = verticalSlice(RAFTER_HEIGHT, SLOPE) + (plywood.THICKNESS + trim.THICKNESS)*SLOPE

  sloped({
    section: header,
    part: trim,
    name: "front-left-corner-batten",
    zPos: plywood.THICKNESS,
    yPos: -toTop,
    ySize: toTop + headerHeight + DOOR_GAP - BATTEN_WIDTH,
    zSize: trim.THICKNESS,
    slope: SLOPE
  })

}

