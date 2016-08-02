var BACK_STUD_HEIGHT = 80
var BATTEN_WIDTH = 1.75
var FLOOR_TOP = 96
var DOOR_FRAMING_TOP = FLOOR_TOP - 80 - 0.75*2
var HEADER_HEIGHT = 10
var SLOPE = 1/6
var FLOOR_THICKNESS = 0.75
var POLY_THICKNESS = 7/16
var CENTER_BEAM_DEPTH = 3.5

var centerBeam = element.template(
  ".center-beam",
  element.style({
    "position": "absolute",
    "transform-origin": "0% 0%",
    "transform": "skewY(-"+drawPlan.slopeToDegrees(SLOPE)+"deg)",
    "border": "0.2em solid #ec4",
    "width": "96em",
    "left": "-6em",
    "box-sizing": "border-box"
  }),
  function(options) {
    if (options.section) {
      options.section.children.push(this)
    }

    var height = stockThicknessToEdgeHeight(CENTER_BEAM_DEPTH, SLOPE)

    var drop = SLOPE*6

    var top = -height + drop + stockThicknessToEdgeHeight(options.offset, SLOPE)

    this.appendStyles({
      "height": height+"em",
      "top": top + "em"
    })
  }
)



var slopedTrim = element.template(
  ".sloped-trim",
  element.style({
    "position": "absolute",
    "transform-origin": "0% 0%",
    "transform": "skewY(-"+drawPlan.slopeToDegrees(SLOPE)+"deg)",
    "border": "0.2em solid #ec4",
    "width": "96em",
    "left": "-6em",
    "box-sizing": "border-box"
  }),
  function(options) {
    if (options.section) {
      options.section.children.push(this)
    }

    var height = stockThicknessToEdgeHeight(options.height, SLOPE)

    var drop = SLOPE*6

    var top = -height + drop + stockThicknessToEdgeHeight(options.offset, SLOPE)

    this.appendStyles({
      "height": height+"em",
      "top": top + "em"
    })
  }
)



var twinWallSide = element.template(
  ".twin-wall-side",
  element.style({
    "position": "absolute",
    "transform-origin": "0% 0%",
    "transform": "skewY(-"+drawPlan.slopeToDegrees(SLOPE)+"deg)",
    "border": "0.2em solid rgba(0,0,255,0.4)",
    "width": "96em",
    "left": "-6em",
    "box-sizing": "border-box"
  }),
  function(options) {
    if (options.section) {
      options.section.children.push(this)
    }

    var height = stockThicknessToEdgeHeight(POLY_THICKNESS, SLOPE)     

    var drop = SLOPE*6

    var top = -height + drop + stockThicknessToEdgeHeight(options.offset, SLOPE)

    this.appendStyles({
      "height": height+"em",
      "top": top + "em"
    })
  }
)


function stockThicknessToEdgeHeight(stockThickness, slope) {
    // x^2 + (x*SLOPE)^2 = stockHeight^2

    // ((1+SLOPE)*x)^2 = stockHeight^2

    // x = Math.sqrt(stockHeight^2)/(1+SLOPE)

    var height = Math.sqrt(
      Math.pow(stockThickness, 2)/
      (1+slope)
    ) 

    if (stockThickness < 0) {
      height = -height
    }

    return height
}


addHtml(element.stylesheet(centerBeam, twinWallSide, slopedTrim).html())



drawPlan(floor)
drawPlan(header)
drawPlan(backWall)
drawPlan(sideWall)
drawPlan(doors)
drawPlan(roof)


function roof(section, trim) {
  var roof = section({
    name: "roof",
    left: 0,
    top: FLOOR_TOP - BACK_STUD_HEIGHT
  })

  centerBeam({
    section: roof,
    offset: CENTER_BEAM_DEPTH - trim.THICKNESS*2 - POLY_THICKNESS
  })

  slopedTrim({
    section: roof,
    name: "poly-support-rail",
    height: trim.THICKNESS,
    offset: -trim.THICKNESS
  })

  slopedTrim({
    section: roof,
    name: "shade-support-rail",
    height: trim.THICKNESS,
    offset: 0
  })

  twinWallSide({
    section: roof,
    offset: -trim.THICKNESS*2
  })

  slopedTrim({
    section: roof,
    name: "roof-cap",
    height: trim.THICKNESS,
    offset: -trim.THICKNESS*2 - POLY_THICKNESS
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

  slopedPly(0, 48)
  slopedPly(48, 24)

  function slopedPly(offset, width) {
    var rightSide = offset + width

    sloped({
      section: side,
      piece: plywood,
      width: width,
      height: BACK_STUD_HEIGHT + FLOOR_THICKNESS + stud.DEPTH + plywood.THICKNESS + rightSide/72*12,
      slope: SLOPE,
      orientation: "in",
      left: offset,
      bottom: -FLOOR_THICKNESS - stud.DEPTH - plywood.THICKNESS
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



