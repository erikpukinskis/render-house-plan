var BACK_STUD_HEIGHT = 80
var BATTEN_WIDTH = 1.75
var FLOOR_TOP = 96
var DOOR_GAP = 0.25
var SLOPE = 1/6
var FLOOR_THICKNESS = 0.75
var TWIN_WALL_THICKNESS = 7/16
var RAFTER_THICKNESS = 3.5

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


var backCapLeftHeight = RAFTER_THICKNESS - (drawPlan.parts.stud.DEPTH+drawPlan.parts.plywood.THICKNESS*SLOPE)*SLOPE

var backCapRightHeight = backCapLeftHeight + 1.5*SLOPE

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
    top: -3.5 - plywood.THICKNESS*SLOPE,
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
    top: -RAFTER_THICKNESS - trim.THICKNESS,
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

  // plywood({
  //   section: opening,
  //   height: 80,
  //   top: 3,
  //   orientation: "east"
  // })

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
    top: 80 + DOOR_GAP*2 + trim.THICKNESS,
    right: -plywood.THICKNESS - trim.THICKNESS
  })

  // trim({
  //   section: opening,
  //   name: "left-side-batten-4",
  //   width: BATTEN_WIDTH,
  //   top: -headerHeight,
  //   right: -plywood.THICKNESS - trim.THICKNESS,
  //   height: headerHeight + trim.THICKNESS*2 + 80 + FLOOR_THICKNESS + plywood.THICKNESS + stud.DEPTH
  // })

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
    height: FLOOR_THICKNESS,
    top: 0,
    orientation: "north"
  })

  plywood({
    section: floor,
    width: 72,
    top: FLOOR_THICKNESS + stud.DEPTH,
    orientation: "south"
  })

  frontStud({
    section: floor,
    top: FLOOR_THICKNESS,
    width: 72,
    height: stud.DEPTH
  })

  stud({
    section: floor,
    orientation: "east",
    top: FLOOR_THICKNESS
  })

  stud({
    section: floor,
    orientation: "west",
    top: FLOOR_THICKNESS,
    left: 72 - stud.WIDTH
  })

}


function sideWall(section, stud, frontStud, plywood, sloped) {

  var side = section({
    left: 0,
    top: FLOOR_TOP
  })

  plywoodAtOffset(0, 48)
  plywoodAtOffset(48, 24)

  function plywoodAtOffset(offset, width) {
    var rightSide = offset + width

    var leftSideHeight = BACK_STUD_HEIGHT + FLOOR_THICKNESS + stud.DEPTH + plywood.THICKNESS

    var rightSideHeight = leftSideHeight + rightSide/72*12

    sloped({
      section: side,
      part: plywood,
      width: width,
      height: rightSideHeight,
      slope: SLOPE,
      orientation: "in",
      left: offset,
      bottom: -FLOOR_THICKNESS - stud.DEPTH - plywood.THICKNESS
    })

  }


  studAtOffset(0)
  studAtOffset(16-stud.WIDTH/2)
  studAtOffset(16*2-stud.WIDTH/2)
  studAtOffset(16*3-stud.WIDTH/2)
  studAtOffset(48+12-stud.WIDTH/2)
  studAtOffset(72-stud.WIDTH)

  function studAtOffset(offset) {
    var rightSide = offset + stud.WIDTH

    sloped({
      section: side,
      part: frontStud,
      width: stud.WIDTH,
      height: BACK_STUD_HEIGHT + rightSide/72*12,
      slope: 1/6,
      left: offset,
      bottom: 0
    })

  }

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
  //   bottom: -FLOOR_THICKNESS - plywood.THICKNESS - stud.DEPTH
  // })

  sloped({
    section: back,
    part: trim,
    slope: SLOPE,
    name: "back-batten",
    width: trim.THICKNESS,
    height: BACK_STUD_HEIGHT + FLOOR_THICKNESS + plywood.THICKNESS + stud.DEPTH + backCapLeftHeight - plywood.THICKNESS*SLOPE,
    bottom: -FLOOR_THICKNESS - plywood.THICKNESS - stud.DEPTH,
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
    height: backCapRightHeight,
    slope: SLOPE,
    bottom: BACK_STUD_HEIGHT
  })

  plywood({
    section: back,
    name: "back-sheathing",
    height: BACK_STUD_HEIGHT + plywood.THICKNESS*2 + stud.DEPTH + backCapLeftHeight,
    bottom: -plywood.THICKNESS*2 - stud.DEPTH,
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

  // trim({
  //   section: header,
  //   name: "front-left-corner-batten",
  //   left: stud.DEPTH + plywood.THICKNESS,
  //   bottom: 0,
  //   height: headerHeight + 3
  // })


}
// 

