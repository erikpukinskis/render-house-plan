var BACK_STUD_HEIGHT = 80
var BATTEN_WIDTH = 1.75
var FLOOR_TOP = 96
var DOOR_FRAMING_TOP = FLOOR_TOP - 80 - 0.75*2
var HEADER_HEIGHT = 10
var SLOPE = 1/6
var FLOOR_THICKNESS = 0.75
var TWIN_WALL_THICKNESS = 7/16
var CENTER_BEAM_DEPTH = 3.5



drawPlan(floor)
drawPlan(header)
drawPlan(backWall)
drawPlan(sideWall)
drawPlan(doors)
drawPlan(roof)


function roof(section, trim, stud, plywood, tilted, twinWallSide) {

  var roof = section({
    name: "roof",
    left: 0,
    top: FLOOR_TOP - BACK_STUD_HEIGHT
  })

  tilted({
    piece: trim,
    section: roof,
    normal: CENTER_BEAM_DEPTH - trim.THICKNESS*2 - TWIN_WALL_THICKNESS,
    length: 96,
    slope: SLOPE,
    left: -6,
    height: CENTER_BEAM_DEPTH
  })

  tilted({
    piece: trim,
    section: roof,
    name: "poly-support-rail",
    height: trim.THICKNESS,
    normal: -trim.THICKNESS,
    left: -6,
    length: 96,
    slope: SLOPE
  })

  tilted({
    piece: trim,
    section: roof,
    name: "shade-support-rail",
    height: trim.THICKNESS,
    left: 0,
    normal: 0,
    width: 72 - stud.DEPTH - plywood.THICKNESS,
    slope: SLOPE
  })

  tilted({
    piece: trim,
    section: roof,
    name: "spacer",
    height: TWIN_WALL_THICKNESS,
    left: -6,
    normal: -trim.THICKNESS*2,
    length: 96,
    slope: SLOPE
  })

  tilted({
    piece: twinWallSide,
    name: "twin-wall",
    section: roof,
    normal: -trim.THICKNESS*2,
    height: TWIN_WALL_THICKNESS,
    length: 96,
    slope: SLOPE,
    left: -6
  })

  tilted({
    piece: trim,
    section: roof,
    name: "roof-cap",
    height: trim.THICKNESS,
    normal: -trim.THICKNESS*2 - TWIN_WALL_THICKNESS,
    left: -6,
    length: 96,
    slope: SLOPE
  })
  
}


function doors(section, trim, plywood, stud) {

  var opening = section({
    top: DOOR_FRAMING_TOP,
    left: 72,
  })

  plywood({
    section: opening,
    height: 80,
    top: 3,
    orientation: "east"
  })

  var jambWidth = trim.THICKNESS*2 + plywood.THICKNESS*2 + stud.DEPTH

  trim({
    section: opening,
    name: "top-door-jamb",
    width: jambWidth,
    right: -plywood.THICKNESS - trim.THICKNESS,
    top: 0
  })

  trim({
    section: opening,
    name: "top-door-trim",
    height: BATTEN_WIDTH,
    left: plywood.THICKNESS,
    top: -BATTEN_WIDTH
  })

  trim({
    section: opening,
    name: "left-door-trim",
    height: BATTEN_WIDTH + trim.THICKNESS*2 + 80 + FLOOR_THICKNESS + plywood.THICKNESS + stud.DEPTH,
    top: -BATTEN_WIDTH,
    left: plywood.THICKNESS
  })

  trim({
    section: opening,
    name: "bottom-door-jamb",
    width: jambWidth,
    top: 80 + trim.THICKNESS,
    right: -plywood.THICKNESS - trim.THICKNESS
  })

  trim({
    section: opening,
    name: "front-left-corner-batten",
    left: plywood.THICKNESS,
    bottom: BATTEN_WIDTH,
    height: HEADER_HEIGHT - BATTEN_WIDTH
  })

  trim({
    section: opening,
    name: "left-side-batten-4",
    width: BATTEN_WIDTH,
    top: -HEADER_HEIGHT,
    right: -plywood.THICKNESS - trim.THICKNESS,
    height: HEADER_HEIGHT + trim.THICKNESS*2 + 80 + FLOOR_THICKNESS + plywood.THICKNESS + stud.DEPTH
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
      piece: plywood,
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
      piece: frontStud,
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

  var backBattenHeight = BACK_STUD_HEIGHT + FLOOR_THICKNESS + plywood.THICKNESS + stud.DEPTH

  var dh = BATTEN_WIDTH * SLOPE

  sloped({
    section: back,
    name: "left-side-batten-1",
    piece: trim,
    slope: SLOPE,
    width: BATTEN_WIDTH,
    height: backBattenHeight + dh,
    left: -plywood.THICKNESS,
    bottom: -FLOOR_THICKNESS - plywood.THICKNESS - stud.DEPTH
  })

  trim({
    section: back,
    name: "back-batten",
    height: backBattenHeight,
    bottom: -FLOOR_THICKNESS - plywood.THICKNESS - stud.DEPTH,
    left: -plywood.THICKNESS - trim.THICKNESS
  })

  plywood({
    section: back,
    height: BACK_STUD_HEIGHT + plywood.THICKNESS*2 + stud.DEPTH,
    bottom: -plywood.THICKNESS*2 - stud.DEPTH,
    left: -plywood.THICKNESS,
    orientation: "west"
  })

}


function header(section, stud, plywood) {

  var header = section({
    left: 72-stud.DEPTH,
    top: DOOR_FRAMING_TOP
  })

  plywood({
    section: header,
    height: HEADER_HEIGHT,
    top: -HEADER_HEIGHT,
    left: -plywood.THICKNESS,
    orientation: "west"
  })

  plywood({
    section: header,
    height: HEADER_HEIGHT,
    top: -HEADER_HEIGHT,
    left: stud.DEPTH,
    orientation: "east"
  })

  stud({
    section: header,
    orientation: "north",
    top: -stud.WIDTH
  })

  stud({
    section: header,
    orientation: "south",
    top: -HEADER_HEIGHT
  })


}



