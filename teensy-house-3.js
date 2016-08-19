var BACK_STUD_HEIGHT = drawPlan.parts.door.HEIGHT
var BATTEN_WIDTH = 1.75
var FLOOR_TOP = 96
var DOOR_GAP = 1/4 // no gap below?
var SLOPE = 1/8
var SUBFLOOR_THICKNESS = 0.75
var TWIN_WALL_THICKNESS = 7/16
var RAFTER_HEIGHT = 3.5
var RAFTER_WIDTH = 1.5

var floorSectionHeight = SUBFLOOR_THICKNESS + drawPlan.parts.stud.DEPTH + drawPlan.parts.plywood.THICKNESS

var rafterStart = {
  zPos: drawPlan.parts.stud.DEPTH + drawPlan.parts.plywood.THICKNESS,
  yPos: FLOOR_TOP - BACK_STUD_HEIGHT
}

var betweenRafterIntersections = 72 - rafterStart.zPos
var elevationBetweenIntersections = betweenRafterIntersections*SLOPE

var headerRafterIntersection = {
  name: "header",
  xPos: 0,
  zPos: 72,
  yPos: rafterStart.yPos - elevationBetweenIntersections
}

var doorFramingTop = FLOOR_TOP - drawPlan.parts.door.HEIGHT - 0.75*2 - DOOR_GAP

var headerHeight = doorFramingTop - headerRafterIntersection.yPos


var backPlateLeftHeight = RAFTER_HEIGHT - (drawPlan.parts.stud.DEPTH+drawPlan.parts.plywood.THICKNESS*SLOPE)*SLOPE

var backPlateRightHeight = backPlateLeftHeight + 1.5*SLOPE


drawPlan(floor)
drawPlan(header)
drawPlan(backWall)
drawPlan(frontWall)
drawPlan(roof)
drawPlan(sideWall, {
  xPos: 0,
  yPos: FLOOR_TOP,
  zPos: 0
}, "left")
drawPlan(sideWall, {
  xPos: 96 - drawPlan.parts.stud.DEPTH - drawPlan.parts.plywood.THICKNESS*2,
  yPos: FLOOR_TOP,
  zPos: 0
}, "right")
drawPlan(doors)



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
      xSize: RAFTER_WIDTH,
      yPos: -RAFTER_HEIGHT - plywood.THICKNESS*SLOPE,
      ySize: RAFTER_HEIGHT,
      zPos: -8,
      zSize: roofLength,
    })

  }

  var centerLine = 48 - plywood.THICKNESS

  rafter(0, "left-rafter")

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
    xPos: RAFTER_WIDTH,
    xSize: 48 - plywood.THICKNESS - RAFTER_WIDTH*1.5
  })

  roofPanel({
    name: "right-twin-wall",
    xPos: centerLine+0.75,
    xSize: 48 - RAFTER_WIDTH*1.5 - plywood.THICKNESS
  })

  shadeRail({
    name: "left-shade-rail",
    xPos: RAFTER_WIDTH,
    xSize: stud.DEPTH + plywood.THICKNESS - RAFTER_WIDTH + 0.5,
  })

  shadeRail({
    name: "center-left-shade-rail",
    xPos: centerLine - RAFTER_WIDTH/2 - 0.75,
    xSize: 0.75,
  })

  shadeRail({
    name: "center-right-shade-rail",
    xPos: centerLine + RAFTER_WIDTH/2,
    xSize: 0.75,
  })

  shadeRail({
    name: "right-shade-rail",
    xPos: 96 - plywood.THICKNESS*2 - stud.DEPTH - 0.5,
    xSize: stud.DEPTH + plywood.THICKNESS - RAFTER_WIDTH + 0.5,
  })


  function shadeRail(options) {

    var defaults = {
      part: trim,
      section: roof,
      slope: SLOPE,
      yPos: - plywood.THICKNESS*SLOPE -  verticalSlice(trim.THICKNESS, SLOPE),
      ySize: trim.THICKNESS,
      zPos: -plywood.THICKNESS - stud.DEPTH + RAFTER_WIDTH,
      zSize: 72 - RAFTER_WIDTH*2 - 6
    }

    options = merge(defaults, options)

    tilted(options)

  }


}


function doors(section, door, trim, plywood, stud, sloped, verticalSlice) {

  var opening = section({
    name: "doors",
    yPos: doorFramingTop,
    zPos: 72,
    xPos: stud.DEPTH+plywood.THICKNESS
  })

  var jambWidth = plywood.THICKNESS*2 + stud.DEPTH + 0.5

  plywood({
    section: opening,
    name: "left-of-door-sheathing",
    xSize: stud.DEPTH + plywood.THICKNESS*2,
    xPos: -plywood.THICKNESS*2 - stud.DEPTH,
    ySize: door.HEIGHT + DOOR_GAP + trim.THICKNESS*2 + floorSectionHeight,
    yPos: 0,
    orientation: "south"
  })

  door({
    section: opening,
    xPos: DOOR_GAP + trim.THICKNESS,
    xSize: door.WIDTH,
    yPos: DOOR_GAP + trim.THICKNESS,
    zPos: 0,
    zSize: -door.THICKNESS,
    orientation: "east"
  })

  door({
    section: opening,
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
    ySize: floorSectionHeight,
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

  var belowDoorTrimHeight = floorSectionHeight + trim.THICKNESS

  var fatTrimWidth = trim.THICKNESS*2 + plywood.THICKNESS*2 + stud.DEPTH + DOOR_GAP

  var skinnyTrimWidth = BATTEN_WIDTH
  var headerTrim = 3.5

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
    ySize: -headerTrim,
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
    ySize: door.HEIGHT + trim.THICKNESS + floorSectionHeight,
    zPos: plywood.THICKNESS
  })

  trim({
    section: opening,
    name: "right-door-trim",
    background: bg2,
    xSize: fatTrimWidth,
    xPos: DOOR_GAP + trim.THICKNESS + door.WIDTH * 2,
    yPos: DOOR_GAP + trim.THICKNESS,
    ySize: door.HEIGHT + trim.THICKNESS + floorSectionHeight,
    zPos: plywood.THICKNESS,
  })

  var xOrigin = -plywood.THICKNESS*2 - stud.DEPTH - trim.THICKNESS
  var headerRemainder = headerHeight + (plywood.THICKNESS + trim.THICKNESS)*SLOPE + DOOR_GAP + trim.THICKNESS - headerTrim
  var tallBatten = headerRemainder + RAFTER_HEIGHT
  var shortBatten = tallBatten - verticalSlice(TWIN_WALL_THICKNESS, SLOPE)

  headerBatten(1, xOrigin, BATTEN_WIDTH, tallBatten)

  headerBatten(2, xOrigin+24, BATTEN_WIDTH, shortBatten)

  headerBatten(3, xOrigin+48 - (BATTEN_WIDTH - RAFTER_WIDTH)/2, BATTEN_WIDTH, shortBatten)

  headerBatten(4, xOrigin+24+48, BATTEN_WIDTH, shortBatten)

  headerBatten(5, 96 - plywood.THICKNESS*2 - stud.DEPTH + trim.THICKNESS - BATTEN_WIDTH, BATTEN_WIDTH, tallBatten)

  function headerBatten(index, xPos, xSize, ySize) {

    sloped({
      section: opening,
      name: "header-batten-"+index,
      slope: SLOPE,
      part: trim,
      background: bg,
      xSize: xSize,
      xPos: xPos,
      yPos: DOOR_GAP + trim.THICKNESS -headerTrim,
      ySize: -ySize,
      zPos: plywood.THICKNESS,
      zSize: trim.THICKNESS,
    })

  }

  trim({
    section: opening,
    name: "front-right-corner-trim",
    background: bg3,
    yPos: DOOR_GAP + trim.THICKNESS,
    ySize: door.HEIGHT + trim.THICKNESS + floorSectionHeight,
    xSize: -skinnyTrimWidth,
    xPos: 96 - plywood.THICKNESS*2 - stud.DEPTH + trim.THICKNESS,
    zPos: plywood.THICKNESS,
  })

}




function floor(section, plywood, stud) {

  var floor = section({
    name: "floor",
    xPos: 0,
    yPos: FLOOR_TOP,
    zPos: 0
  })

  stud({
    section: floor,
    name: "back-floor-joist",
    xSize: 96 - plywood.THICKNESS*2,
    yPos: SUBFLOOR_THICKNESS,
    orientation: "horizontal-south"
  })

  stud({
    section: floor,
    name: "front-floor-joist",
    xSize: 96 - plywood.THICKNESS*2,
    yPos: SUBFLOOR_THICKNESS,
    zPos: 72 - stud.WIDTH,
    orientation: "horizontal-north"
  })


  stud({
    section: floor,
    name: "back-floor-joist",
    orientation: "horizontal-south",
    yPos: SUBFLOOR_THICKNESS
  })


  stud({
    section: floor,
    name: "floor-joist-left",
    orientation: "horizontal-east",
    xPos: 0,
    yPos: SUBFLOOR_THICKNESS,
    ySize: stud.DEPTH,
    zSize: 72
  })


  for(var i=1; i<6; i++) {
    stud({
      section: floor,
      name: "floor-joist-"+(i+1),
      orientation: "horizontal-west",
      xPos: i*16 - stud.WIDTH/2,
      yPos: SUBFLOOR_THICKNESS,
      zSize: 72
    })
  }

  stud({
    section: floor,
    name: "floor-joist-right",
    orientation: "horizontal-west",
    xPos: 96 - plywood.THICKNESS*2 - stud.WIDTH,
    yPos: SUBFLOOR_THICKNESS,
    zSize: 72,
  })

  plywood({
    section: floor,
    name: "left-subfloor",
    xPos: 0,
    xSize: 48,
    yPos: 0,
    ySize: SUBFLOOR_THICKNESS,
    zSize: 72,
    orientation: "up"
  })

  plywood({
    section: floor,
    name: "left-floor-sheathing",
    xSize: 48,
    yPos: SUBFLOOR_THICKNESS + stud.DEPTH,
    zSize: 72,
    orientation: "down"
  })

  plywood({
    section: floor,
    name: "right-subfloor",
    xPos: 48,
    xSize: 48 - plywood.THICKNESS*2,
    yPos: 0,
    ySize: SUBFLOOR_THICKNESS,
    zSize: 72,
    orientation: "up"
  })

  plywood({
    section: floor,
    name: "right-floor-sheathing",
    xPos: 48,
    xSize: 48 - plywood.THICKNESS*2,
    yPos: SUBFLOOR_THICKNESS + stud.DEPTH,
    zSize: 72,
    orientation: "down"
  })

}





function sideWall(section, stud, plywood, sloped, trim, sloped, tilted, verticalSlice, position, whichOne) {

  var short = section(merge({
    name: whichOne+"-wall-short"}, position))

  var tall = section(merge({
    name: whichOne+"-wall-tall"}, position))

  var flip = whichOne == "right"

  sloped({
    section: short,
    name: whichOne+"-side-short-sheathing",
    part: plywood,
    xPos: flip ? stud.DEPTH : -plywood.THICKNESS,
    zPos: 0,
    zSize: 48,
    ySize: -sideSheathingHeightAt(48),
    slope: SLOPE,
    orientation: flip ? "east" : "west",
    yPos: floorSectionHeight
  })

  sloped({
    section: short,
    name: whichOne+"side-short-interior",
    part: plywood,
    xPos: flip ? -plywood.THICKNESS : stud.DEPTH,
    zPos: 0,
    orientation: flip ? "west" : "east",
    zSize: 48,
    ySize: -interiorSideHeightAt(48),
    slope: SLOPE,
    yPos: 0
  })

  function interiorSideHeightAt(offset) {
    var lowestHeight = BACK_STUD_HEIGHT - stud.DEPTH*SLOPE

    var rightSideHeight = lowestHeight + offset*SLOPE

    return rightSideHeight
  }

  function sideSheathingHeightAt(offset) {
    var height = interiorSideHeightAt(offset) + floorSectionHeight + verticalSlice(RAFTER_HEIGHT, SLOPE)

    return height
  }

  studAtOffset(1, short, 0, "south")
  studAtOffset(2, short, 16-stud.WIDTH/2)
  studAtOffset(3, short, 16*2-stud.WIDTH/2)
  studAtOffset(4, short, 16*3-stud.WIDTH/2)

  stud({
    section: short,
    name: whichOne+"-side-short-bottom-plate",
    zPos: 0,
    zSize: 48,
    orientation: "up",
    yPos: -stud.WIDTH
  })

  tilted({
    section: short,
    part: stud,
    slope: SLOPE,
    name: whichOne+"-side-short-top-plate",
    orientation: "down",
    ySize: stud.WIDTH,
    yPos: -leftStudHeightAt(0),
    zPos: 0,
    zSize: 48
  })

  tilted({
    section: short,
    part: stud,
    slope: SLOPE,
    name: whichOne+"-side-short-top-plate",
    orientation: "up",
    ySize: stud.WIDTH,
    yPos: -leftStudHeightAt(0) - verticalSlice(stud.WIDTH, SLOPE),
    zPos: 0,
    zSize: 48+24
  })


  // TALL 

  sloped({
    section: tall,
    name: whichOne+"-side-tall-sheathing",
    part: plywood,
    xPos: flip ? stud.DEPTH : -plywood.THICKNESS,
    zPos: 48,
    zSize: 24,
    ySize: -sideSheathingHeightAt(48 + 24),
    slope: SLOPE,
    orientation: flip ? "east" : "west",
    yPos: floorSectionHeight
  })

  sloped({
    section: tall,
    name: whichOne+"side-tall-interior",
    part: plywood,
    xPos: flip ? -plywood.THICKNESS : stud.DEPTH,
    zPos: 48,
    orientation: flip ? "west" : "east",
    zSize: 24,
    ySize: -interiorSideHeightAt(48 + 24),
    slope: SLOPE,
    yPos: 0
  })
  studAtOffset(5, tall, 16*3-stud.WIDTH/2 + stud.WIDTH, "south")
  studAtOffset(6, tall, 48+12-stud.WIDTH/2)
  studAtOffset(7, tall, 72-stud.WIDTH)

  stud({
    section: tall,
    name: whichOne+"-side-tall-bottom-plate",
    zPos: 48,
    zSize: 24,
    orientation: "up",
    yPos: -stud.WIDTH
  })

  tilted({
    section: tall,
    part: stud,
    slope: SLOPE,
    name: whichOne+"-side-tall-top-plate",
    orientation: "down",
    ySize: stud.WIDTH,
    yPos: -leftStudHeightAt(0),
    zPos: 48,
    zSize: 24
  })

  function studAtOffset(id, section, offset, orientation) {

    var rightSideHeight = leftStudHeightAt(offset) + stud.WIDTH*SLOPE

    sloped({
      section: section,
      name: whichOne+"side-stud-"+id,
      part: stud,
      orientation: orientation || "north",
      zSize: stud.WIDTH,
      ySize: -rightSideHeight,
      slope: 1/6,
      zPos: offset,
      yPos: 0
    })

  }

  function leftStudHeightAt(offset) {

    var leftSideHeight = BACK_STUD_HEIGHT - (stud.DEPTH + plywood.THICKNESS)*SLOPE + offset*SLOPE - verticalSlice(stud.WIDTH, SLOPE)

    return leftSideHeight
  }


  var battenHeightAtFloorBack = BACK_STUD_HEIGHT - (stud.DEPTH + plywood.THICKNESS)*SLOPE + floorSectionHeight + verticalSlice(RAFTER_HEIGHT, SLOPE)


  sideBatten(1, -plywood.THICKNESS, short)

  sideBatten(2, 24 - BATTEN_WIDTH/2, short)

  sideBatten(3, 48 - BATTEN_WIDTH/2, tall)

  sideBatten(4, 48 + 24 - BATTEN_WIDTH + plywood.THICKNESS, tall)

  function sideBatten(index, zPos, section) {

    var ySize = battenHeightAtFloorBack + (BATTEN_WIDTH+zPos)*SLOPE

    var xPos = flip ? stud.DEPTH + plywood.THICKNESS : -plywood.THICKNESS - trim.THICKNESS

    sloped({
      section: section,
      name: "left-side-batten-"+index,
      part: trim,
      slope: SLOPE,
      xPos: xPos,
      yPos: floorSectionHeight,
      ySize: -ySize,
      zPos: zPos,
      zSize: BATTEN_WIDTH,
    })
  }

}



function backWall(section, plywood, stud, trim, sloped, verticalSlice) {

  var back = section({
    name: "back-wall",
    zPos: 0,
    yPos: FLOOR_TOP
  })


  var backBattenHeight = BACK_STUD_HEIGHT + floorSectionHeight + backPlateLeftHeight - plywood.THICKNESS*SLOPE

  var shortBattenHeight = backBattenHeight - verticalSlice(TWIN_WALL_THICKNESS, SLOPE)

  backBatten(1, {
    name: "back-batten-1",
    xPos: -plywood.THICKNESS - trim.THICKNESS,
    ySize: -backBattenHeight
  })

  backBatten({
    name: "back-batten-2",
    xPos: 24,
    ySize: -shortBattenHeight
  })

  backBatten({
    name: "back-batten-3",
    xPos: 48 - plywood.THICKNESS - BATTEN_WIDTH/2,
    ySize: -shortBattenHeight
  })

  backBatten({
    name: "back-batten-4",
    xPos: 24+48,
    ySize: -shortBattenHeight
  })

  backBatten({
    name: "back-batten-5",
    xPos: 96 - plywood.THICKNESS - BATTEN_WIDTH + trim.THICKNESS,
    ySize: -backBattenHeight
  })

  function backBatten(options) {

    sloped(merge({
      section: back,
      part: trim,
      "z-index": 100,
      slope: SLOPE,
      xPos: -plywood.THICKNESS - trim.THICKNESS,
      xSize: BATTEN_WIDTH,
      zSize: trim.THICKNESS,
      yPos: floorSectionHeight,
      zPos: -plywood.THICKNESS - trim.THICKNESS
    }, options))

  }


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

  stud({
    section: back,
    name: "back-stud-1",
    orientation: "east",
    xPos: stud.DEPTH + plywood.THICKNESS,
    ySize: -BACK_STUD_HEIGHT,
    yPos: 0
  })

  backStud(1)
  backStud(2)
  backStud(3)
  backStud(4)
  backStud(5)

  function backStud(i) {

    stud({
      section: back,
      name: "back-stud-"+(i+1),
      orientation: "west",
      xPos: 16*i - plywood.THICKNESS - stud.WIDTH/2,
      ySize: -BACK_STUD_HEIGHT,
      yPos: 0
    })

  }

  stud({
    section: back,
    name: "back-stud-7",
    orientation: "west",
    xPos: 96 - plywood.THICKNESS*3 - stud.DEPTH - stud.WIDTH,
    ySize: -BACK_STUD_HEIGHT,
    yPos: 0
  })

  // PLATES

  var plateLength = 96 - plywood.THICKNESS*4 - stud.DEPTH*2

  stud({
    section: back,
    name: "back-bottom-plate",
    orientation: "up-across",
    xPos: stud.DEPTH + plywood.THICKNESS,
    xSize: plateLength,
    yPos: -stud.WIDTH
  })

  stud({
    section: back,
    name: "back-top-plate",
    orientation: "down-across",
    xPos: stud.DEPTH + plywood.THICKNESS,
    xSize: plateLength,
    yPos: -BACK_STUD_HEIGHT
  })

  sloped({
    part: trim,
    section: back,
    name: "back-cap",
    xPos: RAFTER_WIDTH,
    xSize: 96 - plywood.THICKNESS*2 - RAFTER_WIDTH*2,
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
    orientation: "down-across",
    xPos: stud.DEPTH + plywood.THICKNESS,
    xSize: headerLength,
    zPos: -stud.DEPTH,
    yPos: 0
  })

  stud({
    section: header,
    name: "header-bottom-plate",
    orientation: "up-across",
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
    xPos: RAFTER_WIDTH,
    xSize: 96 - plywood.THICKNESS*2 - RAFTER_WIDTH*2,
    yPos: 0,
    zSize: 1.5,
    ySize: -topPlateHeight,
    slope: SLOPE,
    zPos: -1.5
  })

  var toTop = verticalSlice(RAFTER_HEIGHT, SLOPE) + (plywood.THICKNESS + trim.THICKNESS)*SLOPE

  stud({
    section: header,
    name: "header-stud-1",
    xPos: stud.DEPTH + plywood.THICKNESS,
    ySize: headerHeight,
    zPos: -stud.DEPTH,
    orientation: "east"
  })

  for(var i=1; i<6; i++) {
    stud({
      section: header,
      name: "header-stud-"+(i+1),
      xPos: plywood.THICKNESS + i*16 - stud.WIDTH,
      ySize: headerHeight,
      zPos: -stud.DEPTH,
      orientation: "east"
    })
  }

  stud({
    section: header,
    name: "header-stud-"+(i+1),
    xPos: 96 - plywood.THICKNESS*3 - stud.DEPTH - stud.WIDTH,
    ySize: headerHeight,
    zPos: -stud.DEPTH,
    orientation: "west"
  })

}


function frontWall(section, plywood, trim, stud, door) {

  var distanceIn = plywood.THICKNESS + stud.DEPTH + trim.THICKNESS*2 + door.WIDTH*2 + DOOR_GAP*2

  var doorOpeningHeight = trim.THICKNESS*2 + door.HEIGHT + DOOR_GAP

  var frontWallWidth = 96 - distanceIn - plywood.THICKNESS*3 - stud.DEPTH

  var front = section({
    name: "front-wall",
    zPos: 48+24,
    xPos: distanceIn,
    yPos: FLOOR_TOP - doorOpeningHeight
  })

  plywood({
    section: front,
    name: "front-sheathing",
    xSize: frontWallWidth + plywood.THICKNESS*2 + stud.DEPTH,
    ySize: doorOpeningHeight + floorSectionHeight,
    orientation: "south"
  })

  plywood({
    section: front,
    name: "front-interior",
    xSize: frontWallWidth,
    ySize: doorOpeningHeight,
    zPos: -stud.DEPTH,
    zSize: -plywood.THICKNESS,
    orientation: "north"
  })

  stud({
    section: front,
    name: "front-stud-1",
    orientation: "east",
    zPos: -stud.DEPTH,
    ySize: doorOpeningHeight
  })

  stud({
    section: front,
    name: "front-stud-2",
    orientation: "east",
    xPos: 12,
    ySize: doorOpeningHeight,
    zPos: -stud.DEPTH
  })

  stud({
    section: front,
    name: "front-stud-3",
    orientation: "west",
    xPos: 96 - distanceIn - plywood.THICKNESS*3 - stud.DEPTH - stud.WIDTH,
    zPos: -stud.DEPTH,
    ySize: doorOpeningHeight
  })

  stud({
    section: front,
    name: "front-top-plate",
    orientation: "down-across",
    xSize: frontWallWidth,
    zPos: -stud.DEPTH,
  })

  stud({
    section: front,
    name: "front-top-plate",
    orientation: "up-across",
    xSize: frontWallWidth,
    yPos: doorOpeningHeight - stud.WIDTH,
    zPos: -stud.DEPTH
  })

}



function merge(obj1,obj2){
  var obj3 = {};
  for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
  for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
  return obj3;
}
