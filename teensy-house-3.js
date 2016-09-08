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


var rafterContact = plan.parts.stud.DEPTH+plan.parts.plywood.THICKNESS*SLOPE

var backPlateRightHeight = RAFTER_HEIGHT - plan.parts.verticalSlice(TWIN_WALL_THICKNESS, SLOPE)

var backPlateLeftHeight = backPlateRightHeight - rafterContact*SLOPE

var headerCapFrontHeight = plan.parts.verticalSlice(RAFTER_HEIGHT - TWIN_WALL_THICKNESS, SLOPE) - (plan.parts.plywood.THICKNESS + plan.parts.stud.DEPTH - RAFTER_WIDTH)*SLOPE


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

  plan.add(faceWall, {
    name: "back-wall-left",
    zPos: 0,
    yPos: FLOOR_TOP,
    width: 48,
    height: BACK_WALL_INSIDE_HEIGHT,
    topOverhang: backPlateLeftHeight - plan.parts.plywood.THICKNESS*SLOPE,
    bottomOverhang: wholeFloorHeight,
    joins: "right",
    leftBattenOverhang: plan.parts.plywood.THICKNESS,
    rightBattenOverhang: 0.75,
    orientation: "north",
  })

  plan.add(faceWall, {
    name: "back-wall-right",
    xPos: 48,
    zPos: 0,
    yPos: FLOOR_TOP,
    width: 48,
    height: BACK_WALL_INSIDE_HEIGHT,
    topOverhang: backPlateLeftHeight,
    bottomOverhang: wholeFloorHeight,
    joins: "left",
    rightBattenOverhang: plan.parts.plywood.THICKNESS,
    orientation: "north",
  })

  var doorOpeningHeight = plan.parts.trim.THICKNESS*2 + plan.parts.door.HEIGHT + DOOR_GAP

  var doorOpeningWidth = plan.parts.trim.THICKNESS*2 + plan.parts.door.WIDTH*2 + DOOR_GAP*2

  var frontWallWidth = (96 - doorOpeningWidth)/2

  var frontWallPosition = 48+24 - plan.parts.stud.DEPTH

  plan.add(faceWall, {
    name: "front-wall-left",
    zPos: frontWallPosition,
    xPos: 0,
    yPos: FLOOR_TOP,
    width: frontWallWidth,
    height: doorOpeningHeight + 0.75,
    bottomOverhang: wholeFloorHeight,
    joins: "top",
    orientation: "south",
  })

  plan.add(faceWall, {
    name: "front-wall-right",
    zPos: frontWallPosition,
    xPos: frontWallWidth + doorOpeningWidth,
    yPos: FLOOR_TOP,
    width: frontWallWidth,
    height: doorOpeningHeight + 0.75,
    bottomOverhang: wholeFloorHeight,
    joins: "top",
    orientation: "south",
  })

  plan.add(joins)

  var headerHeight = doorFramingTop - headerRafterIntersection.yPos - 0.75

  plan.add(faceWall, {
    name: "header",
    zPos: frontWallPosition,
    xPos: 0,
    yPos: FLOOR_TOP - doorOpeningHeight - 0.75,
    width: 96,
    height: headerHeight,
    topOverhang: headerCapFrontHeight,
    insideTopOverhang: 0,
    joins: "bottom",
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






function sideSheathingHeightAt(offset) {
  var height = BACK_WALL_INSIDE_HEIGHT - plan.parts.stud.DEPTH*SLOPE + wholeFloorHeight + plan.parts.verticalSlice(RAFTER_HEIGHT, SLOPE)+ offset*SLOPE

  return height
}


function joins(section, sloped, trim) {
  var joins = section({
    name: "joins",
    xPos: 0,
    yPos: 0,
    zPos: 0,
  })

  sloped({
    section: joins,
    part: trim,
    name: "header-cap",
    xPos: RAFTER_WIDTH,
    xSize: 96 - RAFTER_WIDTH*2,
    yPos: FLOOR_TOP - BACK_WALL_INSIDE_HEIGHT,
    zPos: 0,
    zSize: 1.5,
    ySize: -headerCapFrontHeight,
    slope: SLOPE,
  })
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