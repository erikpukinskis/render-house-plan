var BACK_STUD_HEIGHT = 80
var BATTEN_WIDTH = 1.75
var FLOOR_TOP = 96
var DOOR_GAP = 1/4 // no gap below?
var SLOPE = 1/6
var SUBFLOOR_THICKNESS = 0.75
var TWIN_WALL_THICKNESS = 7/16
var RAFTER_HEIGHT = 3.5
var RAFTER_THICKNESS = 1.5

var floorSectionHeight = SUBFLOOR_THICKNESS + drawPlan.parts.stud.DEPTH + drawPlan.parts.plywood.THICKNESS

var rafterStart = {
  zPos: drawPlan.parts.stud.DEPTH + drawPlan.parts.plywood.THICKNESS,
  yPos: FLOOR_TOP - BACK_STUD_HEIGHT
}

var betweenRafterIntersections = 72 - rafterStart.zPos
var elevationBetweenIntersections = betweenRafterIntersections*SLOPE

var headerRafterIntersection = {
  xPos: 0,
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
  drawPlan(header)
  drawPlan(backWall)
  drawPlan(sideWall, {
    xPos: 0,
    yPos: FLOOR_TOP,
    zPos: 0
  })
  drawPlan(sideWall, {
    xPos: 96 - drawPlan.parts.stud.DEPTH - drawPlan.parts.plywood.THICKNESS*2,
    yPos: FLOOR_TOP,
    zPos: 0
  })
  // drawPlan(doors)
  // drawPlan(roof)

}


draw("top")

function roof(section, twinWall, trim, stud, plywood, tilted, verticalSlice) {

  var roof = section({
    name: "roof",
    zPos: rafterStart.zPos,
    yPos: rafterStart.yPos
  })

  var roofLength = Math.sqrt(96*96+12*12)

  function rafter(xPos, name) {

    tilted({
      part: trim,
      name: name,
      section: roof,
      slope: SLOPE,
      xPos: xPos,
      xSize: RAFTER_THICKNESS,
      yPos: -RAFTER_HEIGHT - plywood.THICKNESS*SLOPE,
      ySize: RAFTER_HEIGHT,
      zPos: -8,
      zSize: roofLength,
    })

  }

  var centerLine = 48 - plywood.THICKNESS

  rafter(0, "left-rafter")

  rafter(centerLine - 0.75, "center-rafter")

  rafter(96 - plywood.THICKNESS*2 - RAFTER_THICKNESS, "right-rafter")

  var roofHeight = RAFTER_HEIGHT - stud.DEPTH*SLOPE

  function roofCap(xPos, name) {

    tilted({
      part: trim,
      section: roof,
      name: name,
      slope: SLOPE,
      xPos: xPos,
      xSize: 7.5,
      yPos: -RAFTER_HEIGHT - plywood.THICKNESS*SLOPE -  verticalSlice(trim.THICKNESS, SLOPE),
      ySize: trim.THICKNESS,
      zPos: -8,
      zSize: roofLength
    })

  }

  roofCap(-5, "left-roof-cap")

  roofCap(centerLine - 7.5/2
, "center-roof-cap")

  roofCap(96 - plywood.THICKNESS * 2 - 2.5, "right-roof-cap")

  function roofPanel(options) {

    tilted(merge(options, {
      part: twinWall,
      section: roof,
      slope: SLOPE,
      yPos: -3.5 - plywood.THICKNESS*SLOPE,
      ySize: TWIN_WALL_THICKNESS,
      zPos: -8,
      zSize: roofLength
    }))

  }

  roofPanel({
    name: "left-twin-wall",
    xPos: RAFTER_THICKNESS,
    xSize: 48 - plywood.THICKNESS - RAFTER_THICKNESS*1.5
  })

  roofPanel({
    name: "right-twin-wall",
    xPos: centerLine+0.75,
    xSize: 48 - RAFTER_THICKNESS*1.5 - plywood.THICKNESS
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


function sideWall(section, stud, plywood, sloped, trim, sloped, position) {

  var side = section(position)

  sloped({
    section: side,
    name: "side-1-wide-sheathing",
    part: plywood,
    xPos: -plywood.THICKNESS,
    zPos: 0,
    zSize: 48,
    ySize: -plywoodHeightAt(48),
    slope: SLOPE,
    orientation: "west",
    yPos: floorSectionHeight
  })

  sloped({
    section: side,
    name: "side-1-narrow-sheathing",
    part: plywood,
    xPos: -plywood.THICKNESS,
    zPos: 48,
    zSize: 24,
    ySize: -plywoodHeightAt(48 + 24),
    slope: SLOPE,
    orientation: "west",
    yPos: floorSectionHeight
  })

  sloped({
    section: side,
    name: "side-1-wide-interior",
    part: plywood,
    xPos: stud.DEPTH,
    zPos: 0,
    orientation: "east",
    zSize: 48,
    ySize: -plywoodHeightAt(48),
    slope: SLOPE,
    yPos: floorSectionHeight
  })

  sloped({
    section: side,
    name: "side-1-narrow-interior",
    part: plywood,
    xPos: stud.DEPTH,
    zPos: 48,
    orientation: "east",
    zSize: 24,
    ySize: -plywoodHeightAt(48 + 24),
    slope: SLOPE,
    yPos: floorSectionHeight
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
      ySize: -rightSideHeight,
      slope: 1/6,
      zPos: offset,
      yPos: floorSectionHeight
    })

  }

  // sloped({
  //   section: side,
  //   part: trim,
  //   name: "left-side-batten-4",
  //   zSize: BATTEN_WIDTH,
  //   yPos: floorSectionHeight,
  //   zPos: 72 - BATTEN_WIDTH + plywood.THICKNESS,
  //   ySize: -(floorSectionHeight + DOOR_GAP*2 + 80 + trim.THICKNESS*2 + headerHeight + RAFTER_HEIGHT + plywood.THICKNESS*SLOPE),
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
  //   ySize: -(backBattenHeight + dh),
  //   zPos: -plywood.THICKNESS,
  //   yPos: floorSectionHeight
  // })

  // sloped({
  //   section: back,
  //   part: trim,
  //   slope: SLOPE,
  //   name: "back-batten",
  //   zSize: trim.THICKNESS,
  //   ySize: (BACK_STUD_HEIGHT + floorSectionHeight + backPlateLeftHeight - plywood.THICKNESS*SLOPE),
  //   yPos: floorSectionHeight,
  //   zPos: -plywood.THICKNESS - trim.THICKNESS
  // })



  // PLYWOOD

  plywood({
    section: back,
    name: "back-left-interior",
    xPos: stud.DEPTH + plywood.THICKNESS,
    xSize: 48 - stud.DEPTH - 2*plywood.THICKNESS,
    yPos: 0,
    ySize: -BACK_STUD_HEIGHT,
    zPos: stud.DEPTH,
    orientation: "south"
  })

  plywood({
    section: back,
    name: "back-left-sheathing",
    xPos: -plywood.THICKNESS,
    xSize: 48,
    ySize: -(BACK_STUD_HEIGHT + floorSectionHeight + backPlateLeftHeight),
    yPos: floorSectionHeight,
    zPos: -plywood.THICKNESS,
    orientation: "north"
  })

  plywood({
    section: back,
    name: "back-right-sheathing",
    xSize: 48,
    xPos: 48-plywood.THICKNESS,
    ySize: -(BACK_STUD_HEIGHT + floorSectionHeight + backPlateLeftHeight),
    yPos: floorSectionHeight,
    zPos: -plywood.THICKNESS,
    orientation: "north"
  })

  plywood({
    section: back,
    name: "back-right-interior",
    xSize: 48 - stud.DEPTH - 2*plywood.THICKNESS,
    xPos: 48-plywood.THICKNESS,
    yPos: 0,
    ySize: -BACK_STUD_HEIGHT,
    zPos: stud.DEPTH,
    orientation: "south"
  })


  // STUDS

  // stud({
  //   section: back,
  //   name: "back-stud-1",
  //   orientation: "east",
  //   xPos: stud.DEPTH + plywood.THICKNESS
  // })

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


  // PLATES

  var plateLength = 96 - plywood.THICKNESS*4 - stud.DEPTH*2

  stud({
    section: back,
    name: "back-bottom-plate",
    orientation: "up",
    xPos: stud.DEPTH + plywood.THICKNESS,
    xSize: plateLength,
    ySize: -stud.WIDTH,
    yPos: 0
  })

  stud({
    section: back,
    name: "back-top-plate",
    orientation: "down",
    xPos: stud.DEPTH + plywood.THICKNESS,
    xSize: plateLength,
    yPos: -BACK_STUD_HEIGHT
  })

  sloped({
    part: trim,
    section: back,
    name: "back-cap",
    xPos: RAFTER_THICKNESS,
    xSize: 96 - plywood.THICKNESS*2 - RAFTER_THICKNESS*2,
    yPos: -BACK_STUD_HEIGHT,
    ySize: -backPlateRightHeight,
    zSize: 1.5,
    slope: SLOPE
  })

}



function header(section, stud, plywood, trim, sloped, verticalSlice) {

  var header = section(headerRafterIntersection)

  var headerLength = 96 - plywood.THICKNESS*4 - stud.DEPTH*2

  stud({
    section: header,
    name: "header-top-plate",
    orientation: "down",
    xPos: stud.DEPTH + plywood.THICKNESS,
    xSize: headerLength,
    zPos: -stud.DEPTH,
    yPos: 0
  })

  stud({
    section: header,
    name: "header-bottom-plate",
    orientation: "up",
    xPos: stud.DEPTH + plywood.THICKNESS,
    xSize: headerLength,
    zPos: -stud.DEPTH,
    yPos: headerHeight - stud.WIDTH
  })

  plywood({
    section: header,
    name: "header-interior",
    xPos: stud.DEPTH + plywood.THICKNESS,
    xSize: headerLength,
    ySize: headerHeight,
    yPos: 0,
    zPos: -stud.DEPTH - plywood.THICKNESS,
    orientation: "north"
  })

  var topPlateHeight = verticalSlice(RAFTER_HEIGHT - TWIN_WALL_THICKNESS, SLOPE)

  plywood({
    section: header,
    name: "header-sheathing",
    xPos: -plywood.THICKNESS,
    xSize: 96,
    ySize: headerHeight + topPlateHeight,
    yPos: -topPlateHeight,
    zPos: 0,
    orientation: "south"
  })

  sloped({
    section: header,
    part: trim,
    name: "header-cap",
    xPos: RAFTER_THICKNESS,
    xSize: 96 - plywood.THICKNESS*2 - RAFTER_THICKNESS*2,
    yPos: 0,
    zSize: 1.5,
    ySize: -topPlateHeight,
    slope: SLOPE,
    zPos: -1.5
  })

  var toTop = verticalSlice(RAFTER_HEIGHT, SLOPE) + (plywood.THICKNESS + trim.THICKNESS)*SLOPE

  sloped({
    section: header,
    part: trim,
    name: "front-left-corner-batten",
    xPos: -plywood.THICKNESS,
    xSize: BATTEN_WIDTH,
    zPos: plywood.THICKNESS,
    yPos: -toTop,
    ySize: toTop + headerHeight + DOOR_GAP - BATTEN_WIDTH,
    zSize: trim.THICKNESS,
    slope: SLOPE
  })

  stud({
    section: header,
    name: "header-stud-1",
    xPos: stud.DEPTH + plywood.THICKNESS,
    zPos: -stud.DEPTH,
    orientation: "east"
  })

  for(var i=1; i<6; i++) {
    stud({
      section: header,
      name: "header-stud-"+(i+1),
      xPos: plywood.THICKNESS + i*16 - stud.WIDTH,
      zPos: -stud.DEPTH,
      orientation: "east"
    })
  }

  stud({
    section: header,
    name: "header-stud-"+(i+1),
    xPos: 96 - plywood.THICKNESS*3 - stud.DEPTH - stud.WIDTH,
    zPos: -stud.DEPTH,
    orientation: "west"
  })

}



function merge(obj1,obj2){
  var obj3 = {};
  for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
  for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
  return obj3;
}
