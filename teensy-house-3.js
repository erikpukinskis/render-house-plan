var BACK_WALL_INSIDE_HEIGHT = plan.parts.door.HEIGHT
var BATTEN_WIDTH = 1.5
var FLOOR_TOP = 96
var DOOR_GAP = 1/4 // no gap below?
var SLOPE = 1/8
var FLOORING_THICKNESS = 0.75 // inc subfloor
var SUBFLOOR_THICKNESS = 0.5
var TWIN_WALL_THICKNESS = 7/16
var RAFTER_HEIGHT = 3.5
var RAFTER_WIDTH = 1.5
var HEADER_TRIM = 3.5

var wholeFloorHeight = FLOORING_THICKNESS + plan.parts.stud.DEPTH + plan.parts.plywood.THICKNESS

var rafterStart = {
  zPos: plan.parts.stud.DEPTH + plan.parts.plywood.THICKNESS,
  yPos: FLOOR_TOP - BACK_WALL_INSIDE_HEIGHT
}

var betweenRafterIntersections = 72 - rafterStart.zPos
var elevationBetweenIntersections = betweenRafterIntersections*SLOPE

var headerRafterIntersection = {
  name: "header",
  xPos: 0,
  zPos: 72,
  yPos: rafterStart.yPos - elevationBetweenIntersections
}

var doorFramingTop = FLOOR_TOP - plan.parts.door.HEIGHT - 0.75*2 - DOOR_GAP

var headerHeight = doorFramingTop - headerRafterIntersection.yPos


var backPlateLeftHeight = RAFTER_HEIGHT - (plan.parts.stud.DEPTH+plan.parts.plywood.THICKNESS*SLOPE)*SLOPE

var backPlateRightHeight = backPlateLeftHeight + 1.5*SLOPE


;(function() {
  plan.add(floorSection, {
    name: "floor-left",
    xSize: 48,
    zSize: 6*12,
    join: "right"
  })

  plan.add(floorSection, {
    name: "floor-right",
    xPos: 48,
    xSize: 48,
    zSize: 6*12,
    join: "left"
  })

  plan.add(header)

  plan.add(faceWall, {
    name: "back-wall-left",
    zPos: 0,
    yPos: FLOOR_TOP,
    width: 48,
    height: BACK_WALL_INSIDE_HEIGHT + backPlateLeftHeight,
    topOverhang: backPlateLeftHeight,
    bottomOverhang: wholeFloorHeight,
    overhangs: "none/join",
    leftBattenOverhang: plan.parts.plywood.THICKNESS,
    rightBattenOverhang: 0.75,
  })

  plan.add(faceWall, {
    name: "back-wall-right",
    xPos: 48,
    zPos: 0,
    yPos: FLOOR_TOP,
    width: 48,
    height: BACK_WALL_INSIDE_HEIGHT + backPlateLeftHeight,
    topOverhang: backPlateLeftHeight,
    bottomOverhang: wholeFloorHeight,
    overhangs: "join/none",
    rightBattenOverhang: plan.parts.plywood.THICKNESS,
  })

  var doorOpeningHeight = plan.parts.trim.THICKNESS*2 + plan.parts.door.HEIGHT + DOOR_GAP

  var doorOpeningWidth = plan.parts.trim.THICKNESS*2 + plan.parts.door.WIDTH*2 + DOOR_GAP*2

  var frontWallWidth = (96 - doorOpeningWidth)/2

  plan.add(faceWall, {
    name: "front-wall-left",
    zPos: 48+24 - plan.parts.stud.DEPTH,
    xPos: 0,
    yPos: FLOOR_TOP,
    width: frontWallWidth,
    height: doorOpeningHeight,
    bottomOverhang: wholeFloorHeight,
    topOverhang: 0.75,
    insideTopOverhang: 0.75,
    overhangs: "none/door",
    orientation: "south",
  })

  plan.add(faceWall, {
    name: "front-wall-right",
    zPos: 48+24 - plan.parts.stud.DEPTH,
    xPos: frontWallWidth + doorOpeningWidth,
    yPos: FLOOR_TOP,
    width: frontWallWidth,
    height: doorOpeningHeight,
    bottomOverhang: wholeFloorHeight,
    topOverhang: 0.75,
    insideTopOverhang: 0.75,
    overhangs: "door/none",
    orientation: "south",
  })

  plan.add(doors, {
    name: "doors",
    yPos: doorFramingTop,
    zPos: 72,
    xPos: frontWallWidth,
  })

  // trim({
  //   section: wall,
  //   name: "back-wall-joining-plate",
  //   xPos: 0,
  //   xSize: 96 - plywood.THICKNESS*2,
  //   zPos: 0,
  //   zSize: stud.DEPTH,
  //   yPos: -studHeight,
  //   ySize: -1.5,
  // })

  // trim({
  //   section: wall,
  //   name: "back-wall-joining-stud",
  //   xPos: 48 - plywood.THICKNESS - 0.75,
  //   xSize: 1.5,
  //   yPos: 0,
  //   ySize: -studHeight,
  //   zSize: stud.DEPTH,
  //   zPos: 0
  // })

  // sloped({
  //   part: trim,
  //   section: backLeft,
  //   name: "back-cap",
  //   xPos: RAFTER_WIDTH,
  //   xSize: 96 - plywood.THICKNESS*2 - RAFTER_WIDTH*2,
  //   yPos: -BACK_WALL_INSIDE_HEIGHT,
  //   ySize: -backPlateRightHeight,
  //   zSize: 1.5,
  //   slope: SLOPE
  // })


  plan.add(roof)

  plan.add(sideWall, {
    name: "left-wall-A",
    xPos: 0,
    yPos: FLOOR_TOP,
    zPos: -plan.parts.plywood.THICKNESS,
    width: 48,
    overhangs: "wall/join",
    whichSide: "left",
  })

  plan.add(sideWall, {
    name: "left-wall-B",
    xPos: 0,
    yPos: FLOOR_TOP,
    zPos: 48 - plan.parts.plywood.THICKNESS,
    width: 24+plan.parts.plywood.THICKNESS*2,
    overhangs: "join/wall",
    whichSide: "left",
  })

  var rightWallOffset = 96 - plan.parts.stud.DEPTH

  plan.add(sideWall, {
    name: "right-wall-A",
    xPos: rightWallOffset,
    yPos: FLOOR_TOP,
    zPos: -plan.parts.plywood.THICKNESS,
    width: 48,
    overhangs: "wall/join",
    whichSide: "right",
  })

  plan.add(sideWall, {
    name: "right-wall-B",
    xPos: rightWallOffset,
    yPos: FLOOR_TOP,
    zPos: 48 - plan.parts.plywood.THICKNESS,
    width: 24+plan.parts.plywood.THICKNESS*2,
    overhangs: "join/wall",
    whichSide: "right",
  })

})()

function roof(section, twinWall, trim, stud, plywood, tilted, verticalSlice, shade) {

  var roof = section({
    name: "roof",
    zPos: rafterStart.zPos,
    yPos: rafterStart.yPos
  })

  var roofLength = Math.sqrt(96*96 - 12*12)

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

  roofCap(centerLine - 7.5/2, "center-roof-cap")

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
    xSize: 1.5,
    ySize: -1.5,
  })

  shadeRail({
    name: "center-left-shade-rail",
    xPos: centerLine - RAFTER_WIDTH/2 - 1.5,
    xSize: 1.5,
    ySize: -1.5,
  })

  shadeRail({
    name: "center-right-shade-rail",
    xPos: centerLine + RAFTER_WIDTH/2,
    xSize: 1.5,
    ySize: -1.5,
  })

  shadeRail({
    name: "right-shade-rail",
    xPos: 96 - plywood.THICKNESS*2 - stud.DEPTH - 0.5,
    xSize: 1.5,
    ySize: -1.5,
  })

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


  tilted({
    section: roof,
    name: "right-ceiling-shade",
    part: shade,
    slope: SLOPE,
    xPos: 49,
    xSize: 44.5,
    ySize: -0.5,
    yPos: -verticalSlice(1.5, SLOPE),
    zSize: 72 - stud.DEPTH*2 - plywood.THICKNESS*2,
    zPos: 0,
  })

  function shadeRail(options) {

    var defaults = {
      part: trim,
      section: roof,
      slope: SLOPE,
      yPos: -plywood.THICKNESS*SLOPE,
      ySize: -trim.THICKNESS,
      zPos: -plywood.THICKNESS - stud.DEPTH + RAFTER_WIDTH,
      zSize: 72 - RAFTER_WIDTH*2
    }

    options = merge(defaults, options)

    tilted(options)

  }


}


function doors(section, door, trim, plywood, stud, sloped, verticalSlice,options) {

  var opening = section(options)

  var jambWidth = plywood.THICKNESS*2 + stud.DEPTH + 0.5

  plywood({
    section: opening,
    name: "left-of-door-sheathing",
    xSize: stud.DEPTH + plywood.THICKNESS*2,
    xPos: -plywood.THICKNESS*2 - stud.DEPTH,
    ySize: door.HEIGHT + DOOR_GAP + trim.THICKNESS*2 + wholeFloorHeight,
    yPos: 0,
    orientation: "south"
  })

  door({
    section: opening,
    name: "left-door",
    xPos: DOOR_GAP + trim.THICKNESS,
    xSize: door.WIDTH,
    yPos: DOOR_GAP + trim.THICKNESS,
    zPos: 0,
    zSize: -door.THICKNESS,
    orientation: "east"
  })

  door({
    section: opening,
    name: "right-door",
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
    ySize: wholeFloorHeight,
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

  var belowDoorTrimHeight = wholeFloorHeight + trim.THICKNESS

  var fatTrimWidth = trim.THICKNESS*2 + plywood.THICKNESS*2 + stud.DEPTH + DOOR_GAP

  var skinnyTrimWidth = BATTEN_WIDTH

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
    ySize: -HEADER_TRIM,
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
    ySize: door.HEIGHT + trim.THICKNESS + wholeFloorHeight,
    zPos: plywood.THICKNESS
  })

  trim({
    section: opening,
    name: "right-door-trim",
    background: bg2,
    xSize: fatTrimWidth,
    xPos: DOOR_GAP + trim.THICKNESS + door.WIDTH * 2,
    yPos: DOOR_GAP + trim.THICKNESS,
    ySize: door.HEIGHT + trim.THICKNESS + wholeFloorHeight,
    zPos: plywood.THICKNESS,
  })

  var xOrigin = -plywood.THICKNESS*2 - stud.DEPTH - trim.THICKNESS
  var headerRemainder = headerHeight + (plywood.THICKNESS + trim.THICKNESS)*SLOPE + DOOR_GAP + trim.THICKNESS - HEADER_TRIM
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
      yPos: DOOR_GAP + trim.THICKNESS -HEADER_TRIM,
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
    ySize: door.HEIGHT + trim.THICKNESS + wholeFloorHeight,
    xSize: -skinnyTrimWidth,
    xPos: 96 - plywood.THICKNESS*2 - stud.DEPTH + trim.THICKNESS,
    zPos: plywood.THICKNESS,
  })

}



function floorSection(section, plywood, stud, insulation, flooring, options) {

  if (!options.zSize) {
    console.log(options)
    throw new Error("floor section must have a zSize")
  }

  var id = options.name

  var floor = section({
    name: id,
    xPos: options.xPos,
    yPos: FLOOR_TOP,
    zPos: 0
  })

  var letters = ["A","B","C", "D"]

  for(var i=0; i<3; i++) {
    insulation({
      section: floor,
      name: options.name+"-insulation-"+letters[i],
      xPos: 1+i*16,
      xSize: 14,
      yPos: 1,
      ySize: 2,
      zPos: 1,
      zSize: options.zSize-2,
    })
  }

  var trackLength = options.xSize
  if (options.join == "right" || options.join == "left") {
    trackLength = trackLength - 0.75
  }

  var framingOffset = 0
  if (options.join == "left") {
    framingOffset = 0.75
  }

  stud({
    section: floor,
    name: id+"-back-track",
    xPos: framingOffset,
    xSize: trackLength,
    yPos: FLOORING_THICKNESS,
    orientation: "horizontal-south"
  })

  stud({
    section: floor,
    name: id+"-front-track",
    xPos: framingOffset,
    xSize: trackLength,
    yPos: FLOORING_THICKNESS,
    zPos: options.zSize - stud.WIDTH,
    orientation: "horizontal-north"
  })

  var joist = {
    section: floor,
    orientation: "horizontal-east",
    xPos: framingOffset,
    yPos: FLOORING_THICKNESS,
    ySize: stud.DEPTH,
    zSize: 72
  }

  stud(joist, {
    name: id+"-joist-A",
    xPos: framingOffset,
  })

  stud(joist, {
    name: id+"-joist-B",
    xPos: framingOffset + 16,
  })

  stud(joist, {
    name: id+"-joist-C",
    xPos: framingOffset + 16*2,
  })

  stud(joist, {
    name: id+"-joist-D",
    orientation: "horizontal-west",
    xPos: framingOffset + trackLength - stud.WIDTH,
  })

  plywood({
    section: floor,
    name: id+"-subfloor",
    xPos: 0,
    xSize: options.xSize,
    yPos: 1/4,
    ySize: SUBFLOOR_THICKNESS,
    zSize: options.zSize,
    orientation: "up"
  })

  flooring({
    section: floor,
    name: id+"-flooring",
    xPos: 0,
    xSize: options.xSize,
    yPos: 0,
    ySize: 1/4,
    zSize: options.zSize,
  })

  plywood({
    section: floor,
    name: id+"-sheathing",
    xSize: options.xSize,
    yPos: FLOORING_THICKNESS + stud.DEPTH,
    zSize: options.zSize,
    orientation: "down"
  })


}



function sideSheathingHeightAt(offset) {
  var height = BACK_WALL_INSIDE_HEIGHT - plan.parts.stud.DEPTH*SLOPE + wholeFloorHeight + plan.parts.verticalSlice(RAFTER_HEIGHT, SLOPE)+ offset*SLOPE

  return height
}

function joiningStud() {
  sloped({
    section: tall,
    part: trim,
    name: whichSide+"-side-joining-stud",
    slope: SLOPE,
    xPos: 0,
    xSize: stud.DEPTH,
    zPos: 48 - 0.75,
    zSize: 1.5,
    yPos: 0,
    ySize: -studHeightAt(offset)
  })
}




function header(section, stud, plywood, trim, sloped, verticalSlice, insulation) {

  var header = section(headerRafterIntersection)

  var headerLength = 96 - plywood.THICKNESS*4 - stud.DEPTH*2

  for(var i=0; i<6; i++) {
    insulation({
      section: header,
      name: "header-insulation-"+(i+1),
      xPos: stud.DEPTH + i*15,
      xSize: 15,
      yPos: 0,
      zPos: 0,
      zSize: -stud.DEPTH,
      ySize: headerHeight,
    })
  }


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
    sanded: true,
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


function merge(obj1,obj2){
  var obj3 = {};
  for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
  for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
  return obj3;
}

function pick(object) {
  var keys = Array.prototype.slice.call(arguments, 1)
  var light = {}
  keys.forEach(function(key) {
    light[key] = object[key]
  })
  return light
}