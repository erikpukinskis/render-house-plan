var BACK_STUD_HEIGHT = 80
var BATTEN_WIDTH = 1.75
var FLOOR_TOP = 96
var DOOR_GAP = 1/4 // no gap below?
var SLOPE = 1/6
var SUBFLOOR_THICKNESS = 0.75
var TWIN_WALL_THICKNESS = 7/16
var RAFTER_THICKNESS = 3.5

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


var backPlateLeftHeight = RAFTER_THICKNESS - (drawPlan.parts.stud.DEPTH+drawPlan.parts.plywood.THICKNESS*SLOPE)*SLOPE

var backPlateRightHeight = backPlateLeftHeight + 1.5*SLOPE

drawPlan.setView("side")

drawPlan(floor)
drawPlan(header)
drawPlan(backWall)
drawPlan(sideWall)
drawPlan(doors)
drawPlan(roof)



function roof(section, trim, stud, plywood, tilted, twinWallSide, verticalSlice) {

  var roof = section({
    name: "roof",
    zPos: rafterStart.zPos,
    yPos: rafterStart.yPos
  })

  tilted({
    part: trim,
    name: "rafter",
    section: roof,
    yPos: -RAFTER_THICKNESS - plywood.THICKNESS*SLOPE,
    length: 96,
    slope: SLOPE,
    zPos: -8,
    height: RAFTER_THICKNESS
  })


  var roofHeight = RAFTER_THICKNESS - stud.DEPTH*SLOPE

  tilted({
    part: trim,
    section: roof,
    name: "roof-cap",
    height: trim.THICKNESS,
    yPos: -RAFTER_THICKNESS - plywood.THICKNESS*SLOPE -  verticalSlice(trim.THICKNESS, SLOPE),
    zPos: -8,
    length: 96,
    slope: SLOPE
  })

  tilted({
    part: twinWallSide,
    name: "twin-wall",
    section: roof,
    yPos: -3.5 - plywood.THICKNESS*SLOPE,
    height: TWIN_WALL_THICKNESS,
    length: 96,
    slope: SLOPE,
    zPos: -8
  })  

}


function doors(section, trim, plywood, stud) {

  var opening = section({
    yPos: doorFramingTop,
    zPos: 72,
  })

  plywood({
    section: opening,
    name: "left-of-door-sheathing",
    height: 77,
    yPos: 3,
    orientation: "south"
  })

  plywood({
    section: opening,
    name: "below-door-sheathing",
    height: 2.5,
    yPos: DOOR_GAP*2 + trim.THICKNESS*2 + 80 + 0.5,
    orientation: "south"
  })

  trim({
    section: opening,
    name: "door-trim-bottom",
    height: DOOR_GAP + floorSectionHeight,
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
    height: 80,
    right: -plywood.THICKNESS - trim.THICKNESS,
    yPos: DOOR_GAP + trim.THICKNESS
  })

  trim({
    section: opening,
    name: "door-trim-top",
    height: BATTEN_WIDTH,
    zPos: plywood.THICKNESS,
    yPos: -BATTEN_WIDTH + DOOR_GAP
  })

}


function floor(section, stud, frontStud, plywood) {

  var floor = section({
    name: "floor",
    yPos: FLOOR_TOP,
    zPos: 0
  })

  plywood({
    section: floor,
    name: "subfloor",
    zSize: 72,
    height: SUBFLOOR_THICKNESS,
    yPos: 0,
    orientation: "down"
  })

  plywood({
    section: floor,
    zSize: 72,
    yPos: SUBFLOOR_THICKNESS + stud.DEPTH,
    orientation: "up"
  })

  stud({
    section: floor,
    name: "floor-joist-left",
    yPos: SUBFLOOR_THICKNESS,
    zSize: 72,
    height: stud.DEPTH,
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


function sideWall(section, stud, frontStud, plywood, sloped, trim, sloped) {

  var side = section({
    zPos: 0,
    yPos: FLOOR_TOP
  })

  plywoodAtOffset(0, 48)
  plywoodAtOffset(48, 24)

  function plywoodAtOffset(offset, width) {
    var rightSide = offset + width

    var leftSideHeight = BACK_STUD_HEIGHT + floorSectionHeight + backPlateLeftHeight

    var rightSideHeight = leftSideHeight + rightSide/72*12

    sloped({
      section: side,
      part: plywood,
      zSize: width,
      height: rightSideHeight,
      slope: SLOPE,
      orientation: "in",
      zPos: offset,
      bottom: -floorSectionHeight
    })

  }


  studAtOffset(0)
  studAtOffset(16-stud.WIDTH/2)
  studAtOffset(16*2-stud.WIDTH/2)
  studAtOffset(16*3-stud.WIDTH/2)
  studAtOffset(48+12-stud.WIDTH/2)
  studAtOffset(72-stud.WIDTH)

  function studAtOffset(offset) {

    var leftSideHeight = BACK_STUD_HEIGHT - (stud.DEPTH + plywood.THICKNESS)*SLOPE + offset*SLOPE

    var rightSideHeight = leftSideHeight + stud.WIDTH*SLOPE

    var orientation = offset == 0 ? "south" : "north"

    sloped({
      section: side,
      part: stud,
      orientation: orientation,
      zSize: stud.WIDTH,
      height: rightSideHeight,
      slope: 1/6,
      zPos: offset,
      bottom: 0
    })

  }

  sloped({
    section: side,
    part: trim,
    name: "left-side-batten-4",
    zSize: BATTEN_WIDTH,
    bottom: -floorSectionHeight,
    zPos: 72 - BATTEN_WIDTH + plywood.THICKNESS,
    height: floorSectionHeight + DOOR_GAP*2 + 80 + trim.THICKNESS*2 + headerHeight + RAFTER_THICKNESS + plywood.THICKNESS*SLOPE,
    slope: SLOPE
  })

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
  //   height: backBattenHeight + dh,
  //   zPos: -plywood.THICKNESS,
  //   bottom: -floorSectionHeight
  // })

  sloped({
    section: back,
    part: trim,
    slope: SLOPE,
    name: "back-batten",
    zSize: trim.THICKNESS,
    height: BACK_STUD_HEIGHT + floorSectionHeight + backPlateLeftHeight - plywood.THICKNESS*SLOPE,
    bottom: -floorSectionHeight,
    zPos: -plywood.THICKNESS - trim.THICKNESS
  })

  stud({
    section: back,
    orientation: "up",
    xSize: 1000,
    bottom: 0
  })

  plywood({
    section: back,
    zPos: stud.DEPTH,
    height: BACK_STUD_HEIGHT,
    orientation: "south",
    bottom: 0
  })

  stud({
    section: back,
    orientation: "down",
    xSize: 1000,
    bottom: BACK_STUD_HEIGHT - stud.WIDTH
  })

  sloped({
    part: trim,
    section: back,
    name: "back-cap",
    zSize: 1.5,
    height: backPlateRightHeight,
    slope: SLOPE,
    bottom: BACK_STUD_HEIGHT
  })

  plywood({
    section: back,
    name: "back-sheathing",
    height: BACK_STUD_HEIGHT + floorSectionHeight + backPlateLeftHeight,
    bottom: -floorSectionHeight,
    zPos: -plywood.THICKNESS,
    orientation: "north"
  })

}



function header(section, stud, plywood, trim, sloped, verticalSlice) {

  var header = section(headerRafterIntersection)

  stud({
    section: header,
    orientation: "down",
    xPos: 1000,
    zPos: -stud.DEPTH,
    yPos: 0
  })

  stud({
    section: header,
    orientation: "up",
    xPos: 1000,
    zPos: -stud.DEPTH,
    yPos: headerHeight - stud.WIDTH
  })

  plywood({
    section: header,
    height: headerHeight,
    yPos: 0,
    zPos: -stud.DEPTH - plywood.THICKNESS,
    orientation: "north"
  })

  var topPlateHeight = verticalSlice(RAFTER_THICKNESS - TWIN_WALL_THICKNESS, SLOPE)

  sloped({
    section: header,
    part: trim,
    name: "header-top-plate",
    bottom: 0,
    zSize: 1.5,
    height: topPlateHeight,
    slope: SLOPE,
    zPos: -1.5
  })

  plywood({
    section: header,
    height: headerHeight + topPlateHeight,
    yPos: -topPlateHeight,
    zPos: 0,
    orientation: "south"
  })

  var toTop = verticalSlice(RAFTER_THICKNESS, SLOPE) + (plywood.THICKNESS + trim.THICKNESS)*SLOPE

  sloped({
    section: header,
    part: trim,
    name: "front-left-corner-batten",
    zPos: plywood.THICKNESS,
    yPos: -toTop,
    height: toTop + headerHeight + DOOR_GAP - BATTEN_WIDTH,
    zSize: trim.THICKNESS,
    slope: SLOPE
  })

}

