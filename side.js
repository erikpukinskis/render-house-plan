var BACK_STUD_HEIGHT = 80
var BATTEN_WIDTH = 1.75
var FLOOR_TOP = 96
var DOOR_GAP = 1/8
var SLOPE = 1/6
var SUBFLOOR_THICKNESS = 0.75
var TWIN_WALL_THICKNESS = 7/16
var RAFTER_THICKNESS = 3.5

var floorSectionHeight = SUBFLOOR_THICKNESS + drawPlan.parts.stud.DEPTH + drawPlan.parts.plywood.THICKNESS

var rafterStart = {
  left: drawPlan.parts.stud.DEPTH + drawPlan.parts.plywood.THICKNESS,
  top: FLOOR_TOP - BACK_STUD_HEIGHT
}

var betweenRafterIntersections = 72 - rafterStart.left
var elevationBetweenIntersections = betweenRafterIntersections*SLOPE

var headerRafterIntersection = {
  left: 72,
  top: rafterStart.top - elevationBetweenIntersections
}

var doorFramingTop = FLOOR_TOP - 80 - 0.75*2 - DOOR_GAP*2

var headerHeight = doorFramingTop - headerRafterIntersection.top


var backPlateLeftHeight = RAFTER_THICKNESS - (drawPlan.parts.stud.DEPTH+drawPlan.parts.plywood.THICKNESS*SLOPE)*SLOPE

var backPlateRightHeight = backPlateLeftHeight + 1.5*SLOPE

drawPlan(floor)
drawPlan(header)
drawPlan(backWall)
drawPlan(sideWall)
drawPlan(doors)
drawPlan(roof)



function roof(section, trim, stud, plywood, tilted, twinWallSide) {

  var roof = section({
    name: "roof",
    left: rafterStart.left,
    top: rafterStart.top
  })

  tilted({
    part: trim,
    name: "rafter",
    section: roof,
    top: -RAFTER_THICKNESS - plywood.THICKNESS*SLOPE,
    length: 96,
    slope: SLOPE,
    left: -8,
    height: RAFTER_THICKNESS
  })


  var roofHeight = RAFTER_THICKNESS - stud.DEPTH*SLOPE

  tilted({
    part: trim,
    section: roof,
    name: "roof-cap",
    height: trim.THICKNESS,
    top: -RAFTER_THICKNESS - plywood.THICKNESS*SLOPE -  drawPlan.verticalSlice(trim.THICKNESS, SLOPE),
    left: -8,
    length: 96,
    slope: SLOPE
  })

  tilted({
    part: twinWallSide,
    name: "twin-wall",
    section: roof,
    top: -3.5 - plywood.THICKNESS*SLOPE,
    height: TWIN_WALL_THICKNESS,
    length: 96,
    slope: SLOPE,
    left: -8
  })  

}


function doors(section, trim, plywood, stud) {

  var opening = section({
    top: doorFramingTop,
    left: 72,
  })

  plywood({
    section: opening,
    name: "left-of-door-sheathing",
    height: 77,
    top: 3,
    orientation: "east"
  })

  plywood({
    section: opening,
    name: "below-door-sheathing",
    height: 2.5,
    top: DOOR_GAP*2 + trim.THICKNESS*2 + 80 + 0.5,
    orientation: "east"
  })

  trim({
    section: opening,
    name: "door-trim-bottom",
    height: DOOR_GAP + floorSectionHeight,
    top: DOOR_GAP + trim.THICKNESS*2 + 80,
    left: plywood.THICKNESS,
    orientation: "east"
  })

  var jambWidth = trim.THICKNESS*2 + plywood.THICKNESS*2 + stud.DEPTH

  trim({
    section: opening,
    name: "top-door-jamb",
    width: jambWidth,
    right: -plywood.THICKNESS - trim.THICKNESS,
    top: DOOR_GAP
  })

  trim({
    section: opening,
    name: "bottom-door-jamb",
    width: jambWidth,
    top: 80 + DOOR_GAP + trim.THICKNESS,
    right: -plywood.THICKNESS - trim.THICKNESS
  })

  trim({
    section: opening,
    name: "side-door-jamb",
    width: jambWidth,
    height: 80,
    right: -plywood.THICKNESS - trim.THICKNESS,
    top: DOOR_GAP + trim.THICKNESS
  })

  trim({
    section: opening,
    name: "door-trim-top",
    height: BATTEN_WIDTH,
    left: plywood.THICKNESS,
    top: -BATTEN_WIDTH + DOOR_GAP
  })

}


function floor(section, stud, frontStud, plywood) {

  var floor = section({
    name: "floor",
    top: FLOOR_TOP,
    left: 0
  })

  plywood({
    section: floor,
    name: "subfloor",
    width: 72,
    height: SUBFLOOR_THICKNESS,
    top: 0,
    orientation: "north"
  })

  plywood({
    section: floor,
    width: 72,
    top: SUBFLOOR_THICKNESS + stud.DEPTH,
    orientation: "south"
  })

  frontStud({
    section: floor,
    top: SUBFLOOR_THICKNESS,
    width: 72,
    height: stud.DEPTH
  })

  stud({
    section: floor,
    orientation: "east",
    top: SUBFLOOR_THICKNESS
  })

  stud({
    section: floor,
    orientation: "west",
    top: SUBFLOOR_THICKNESS,
    left: 72 - stud.WIDTH
  })

}


function sideWall(section, stud, frontStud, plywood, sloped, trim, sloped) {

  var side = section({
    left: 0,
    top: FLOOR_TOP
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
      width: width,
      height: rightSideHeight,
      slope: SLOPE,
      orientation: "in",
      left: offset,
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

    sloped({
      section: side,
      part: frontStud,
      width: stud.WIDTH,
      height: rightSideHeight,
      slope: 1/6,
      left: offset,
      bottom: 0
    })

  }

  sloped({
    section: side,
    part: trim,
    name: "left-side-batten-4",
    width: BATTEN_WIDTH,
    bottom: -floorSectionHeight,
    left: 72 - BATTEN_WIDTH + plywood.THICKNESS,
    height: floorSectionHeight + DOOR_GAP*2 + 80 + trim.THICKNESS*2 + headerHeight + RAFTER_THICKNESS + plywood.THICKNESS*SLOPE,
    slope: SLOPE
  })

}



function backWall(section, plywood, stud, trim, sloped) {

  var back = section({
    name: "back-wall",
    left: 0,
    top: FLOOR_TOP
  })

  // sloped({
  //   section: back,
  //   name: "left-side-batten-1",
  //   part: trim,
  //   slope: SLOPE,
  //   width: BATTEN_WIDTH,
  //   height: backBattenHeight + dh,
  //   left: -plywood.THICKNESS,
  //   bottom: -floorSectionHeight
  // })

  sloped({
    section: back,
    part: trim,
    slope: SLOPE,
    name: "back-batten",
    width: trim.THICKNESS,
    height: BACK_STUD_HEIGHT + floorSectionHeight + backPlateLeftHeight - plywood.THICKNESS*SLOPE,
    bottom: -floorSectionHeight,
    left: -plywood.THICKNESS - trim.THICKNESS
  })

  stud({
    section: back,
    orientation: "north",
    bottom: 0
  })

  plywood({
    section: back,
    left: stud.DEPTH,
    height: BACK_STUD_HEIGHT,
    orientation: "east",
    bottom: 0
  })

  stud({
    section: back,
    orientation: "south",
    bottom: BACK_STUD_HEIGHT - stud.WIDTH
  })

  sloped({
    part: trim,
    section: back,
    name: "back-cap",
    width: 1.5,
    height: backPlateRightHeight,
    slope: SLOPE,
    bottom: BACK_STUD_HEIGHT
  })

  plywood({
    section: back,
    name: "back-sheathing",
    height: BACK_STUD_HEIGHT + floorSectionHeight + backPlateLeftHeight,
    bottom: -floorSectionHeight,
    left: -plywood.THICKNESS,
    orientation: "west"
  })

}



function header(section, stud, plywood, trim, sloped) {

  var header = section(headerRafterIntersection)

  stud({
    section: header,
    orientation: "south",
    left: -stud.DEPTH,
    top: 0
  })

  stud({
    section: header,
    orientation: "north",
    left: -stud.DEPTH,
    top: headerHeight - stud.WIDTH
  })

  plywood({
    section: header,
    height: headerHeight,
    top: 0,
    left: -stud.DEPTH - plywood.THICKNESS,
    orientation: "west"
  })

  var topPlateHeight = drawPlan.verticalSlice(RAFTER_THICKNESS - TWIN_WALL_THICKNESS, SLOPE)

  sloped({
    section: header,
    part: trim,
    name: "header-top-plate",
    bottom: 0,
    width: 1.5,
    height: topPlateHeight,
    slope: SLOPE,
    left: -1.5
  })

  plywood({
    section: header,
    height: headerHeight + topPlateHeight,
    top: -topPlateHeight,
    left: 0,
    orientation: "east"
  })

  var toTop = drawPlan.verticalSlice(RAFTER_THICKNESS, SLOPE) + (plywood.THICKNESS + trim.THICKNESS)*SLOPE

  sloped({
    section: header,
    part: trim,
    name: "front-left-corner-batten",
    left: plywood.THICKNESS,
    top: -toTop,
    height: toTop + headerHeight + DOOR_GAP - BATTEN_WIDTH,
    width: trim.THICKNESS,
    slope: SLOPE
  })

}

