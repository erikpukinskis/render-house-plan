var BACK_WALL_INSIDE_HEIGHT = plan.parts.door.HEIGHT
var BATTEN_WIDTH = 1.5
var FLOOR_TOP = 96
var DOOR_GAP = 1/4 // no gap below?
var SLOPE = 1/8
var FLOORING_THICKNESS = 0.25
var SUBFLOOR_THICKNESS = 0.5
var TWIN_WALL_THICKNESS = 7/16
var RAFTER_HEIGHT = 3.5
var RAFTER_WIDTH = 1.5
var DOOR_TRIM_WIDTH = 3.5

var FLOOR_LENGTH = 6*12

var wholeFloorHeight = FLOORING_THICKNESS + SUBFLOOR_THICKNESS + plan.parts.stud.DEPTH + plan.parts.plywood.THICKNESS

var rafterStart = {
  zPos: plan.parts.stud.DEPTH + plan.parts.plywood.THICKNESS,
  yPos: FLOOR_TOP - BACK_WALL_INSIDE_HEIGHT
}

var betweenRafterIntersections = 72 - rafterStart.zPos
var elevationBetweenIntersections = betweenRafterIntersections*SLOPE

var headerRafterIntersection = {
  xPos: 0,
  zPos: 72,
  yPos: rafterStart.yPos - elevationBetweenIntersections
}

var doorFramingTop = FLOOR_TOP - plan.parts.door.HEIGHT - 0.75*2 - DOOR_GAP


var rafterContact = plan.parts.stud.DEPTH+plan.parts.plywood.THICKNESS*SLOPE

var backPlateRightHeight = RAFTER_HEIGHT - plan.parts.verticalSlice(TWIN_WALL_THICKNESS, SLOPE)

var backPlateLeftHeight = backPlateRightHeight - rafterContact*SLOPE

var headerCapFrontHeight = plan.parts.verticalSlice(RAFTER_HEIGHT - TWIN_WALL_THICKNESS, SLOPE) - (plan.parts.plywood.THICKNESS + plan.parts.stud.DEPTH - RAFTER_WIDTH)*SLOPE

var doorOpeningHeight = plan.parts.trim.THICKNESS*2 + plan.parts.door.HEIGHT + DOOR_GAP

;(function() {
  plan.add(floorSection, {
    name: "floor-left",
    xSize: 48,
    zSize: FLOOR_LENGTH,
    join: "right"
  })

  plan.add(floorSection, {
    name: "floor-right",
    xPos: 48,
    xSize: 48,
    zSize: FLOOR_LENGTH,
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
    leftBattenOverhang: plan.parts.plywood.THICKNESS,
    orientation: "south",
    slopeBattens: false,
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
    rightBattenOverhang: plan.parts.plywood.THICKNESS,
    orientation: "south",
    slopeBattens: false,
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
    leftBattenOverhang: plan.parts.plywood.THICKNESS,
    rightBattenOverhang: plan.parts.plywood.THICKNESS,
    middleBattenBottomGap: DOOR_TRIM_WIDTH - plan.parts.trim.THICKNESS - DOOR_GAP - 0.75,
    joins: "bottom",
    orientation: "south",
  })

  plan.add(doors, {
    name: "doors",
    yPos: doorFramingTop,
    zPos: 72,
    xPos: frontWallWidth,
  })

  plan.add(roof)

  plan.add(sideWall, {
    name: "left-wall-A",
    xPos: 0,
    yPos: FLOOR_TOP,
    zPos: -plan.parts.plywood.THICKNESS,
    width: 48,
    overhangs: "wall/join",
    innerTopOverhang: plan.parts.verticalSlice(0.75, SLOPE),
    whichSide: "left",
  })

  plan.add(sideWall, {
    name: "left-wall-B",
    xPos: 0,
    yPos: FLOOR_TOP,
    zPos: 48 - plan.parts.plywood.THICKNESS,
    width: 24+plan.parts.plywood.THICKNESS*2,
    overhangs: "join/wall",
    innerTopOverhang: plan.parts.verticalSlice(0.75, SLOPE),
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
    innerTopOverhang: plan.parts.verticalSlice(0.75, SLOPE),
    whichSide: "right",
  })

  plan.add(sideWall, {
    name: "right-wall-B",
    xPos: rightWallOffset,
    yPos: FLOOR_TOP,
    zPos: 48 - plan.parts.plywood.THICKNESS,
    width: 24+plan.parts.plywood.THICKNESS*2,
    overhangs: "join/wall",
    innerTopOverhang: plan.parts.verticalSlice(0.75, SLOPE),
    whichSide: "right",
  })

})()






function joins(section, sloped, trim, stud, plywood) {
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

  trim({
    section: joins,
    name: "floor-joining-joist",
    xPos: 48 - 0.75,
    xSize: 1.5,
    yPos: FLOOR_TOP + FLOORING_THICKNESS + SUBFLOOR_THICKNESS,
    ySize: stud.DEPTH,
    zSize: FLOOR_LENGTH,
  })

  trim({
    section: joins,
    name: "back-wall-joining-stud",
    xPos: 48 - 0.75,
    xSize: 1.5,
    zSize: stud.DEPTH,
    yPos: FLOOR_TOP,
    ySize: -BACK_WALL_INSIDE_HEIGHT,
  })

  var sideJoiningStud = {
    section: joins,
    part: trim,
    slope: SLOPE,
    xSize: stud.DEPTH,
    yPos: FLOOR_TOP,
    ySize: -BACK_WALL_INSIDE_HEIGHT - (48 + 0.75 - plywood.THICKNESS - stud.DEPTH)*SLOPE,
    zPos: 48 - plywood.THICKNESS - 0.75,
    zSize: 1.5,
  }

  sloped(sideJoiningStud, {
    name: "left-wall-joining-stud",
    xPos: 0,
  })

  sloped(sideJoiningStud, {
    name: "left-wall-joining-stud",
    xPos: 96 - stud.DEPTH,
  })

  trim({
    section: joins,
    name: "front-joining-plate",
    xSize: 96,
    yPos: FLOOR_TOP - doorOpeningHeight,
    ySize: -1.5,
    zPos: FLOOR_LENGTH - stud.DEPTH,
    zSize: stud.DEPTH,
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