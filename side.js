var BACK_STUD_HEIGHT = 80
var BATTEN_WIDTH = 1.75
var DOOR_FRAMING_TOP = 96 - 80 - 0.75*2
var HEADER_HEIGHT = 10
var SLOPE = 1/6

drawPlan(floor)
drawPlan(header)
drawPlan(backWall)
drawPlan(sideWall)
drawPlan(doors)


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
    height: BATTEN_WIDTH + trim.THICKNESS*2 + 80 + plywood.THICKNESS*2 + stud.DEPTH,
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
    height: HEADER_HEIGHT + trim.THICKNESS*2 + 80 + plywood.THICKNESS*2 + stud.DEPTH
  })

}


function floor(section, stud, frontStud, plywood) {

  var floor = section({
    top: 96,
    left: 0
  })

  plywood({
    section: floor,
    width: 72,
    orientation: "north"
  })

  plywood({
    section: floor,
    width: 72,
    top: plywood.THICKNESS + stud.DEPTH,
    orientation: "south"
  })

  frontStud({
    section: floor,
    top: plywood.THICKNESS,
    width: 72,
    height: stud.DEPTH
  })

  stud({
    section: floor,
    orientation: "east",
    top: plywood.THICKNESS
  })

  stud({
    section: floor,
    orientation: "west",
    top: plywood.THICKNESS,
    left: 72 - stud.WIDTH
  })

}


function sideWall(section, stud, frontStud, plywood, sloped) {


  var side = section({
    left: 0,
    top: 96
  })

  slopedPly(0, 48)
  slopedPly(48, 24)

  function slopedPly(offset, width) {
    var rightSide = offset + width

    sloped({
      section: side,
      piece: plywood,
      width: width,
      height: BACK_STUD_HEIGHT + rightSide/72*12,
      slope: SLOPE,
      orientation: "in",
      left: offset,
      bottom: 0
    })

  }


  slopedStud(0)
  slopedStud(16-stud.WIDTH/2)
  slopedStud(16*2-stud.WIDTH/2)
  slopedStud(16*3-stud.WIDTH/2)
  slopedStud(48+12-stud.WIDTH/2)
  slopedStud(72-stud.WIDTH)

  function slopedStud(offset) {
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
    top: 96
  })

  var backBattenHeight = BACK_STUD_HEIGHT + plywood.THICKNESS*2 + stud.DEPTH

  var dh = BATTEN_WIDTH * SLOPE

  sloped({
    section: back,
    piece: trim,
    slope: SLOPE,
    name: "left-side-batten-1",
    width: BATTEN_WIDTH,
    height: backBattenHeight + dh,
    left: -plywood.THICKNESS,
    bottom: -plywood.THICKNESS*2 - stud.DEPTH
  })

  trim({
    section: back,
    height: backBattenHeight,
    bottom: -plywood.THICKNESS*2 - stud.DEPTH,
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



