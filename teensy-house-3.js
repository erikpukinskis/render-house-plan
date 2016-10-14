var library = require("nrtv-library")(require)


module.exports = library.export(
  "teensy-house-3",
  ["./house_plan", "./face_wall", "./doors", "./floor_section", "./roof", "./side_wall", "./dimension_text"],
  function(HousePlan, faceWall, doors, floorSection, roof, sideWall, dimensionText) {

    var BACK_WALL_INSIDE_HEIGHT = 80
    var FLOOR_TOP = 96
    var SLOPE = 1/8

    var FLOOR_LENGTH = 6*12

    var rafterStart = {
      zPos: HousePlan.parts.stud.DEPTH + HousePlan.parts.plywood.THICKNESS,
      yPos: FLOOR_TOP - BACK_WALL_INSIDE_HEIGHT
    }

    var betweenRafterIntersections = 72 - rafterStart.zPos
    var elevationBetweenIntersections = betweenRafterIntersections*SLOPE

    var headerRafterIntersection = {
      xPos: 0,
      zPos: 72,
      yPos: rafterStart.yPos - elevationBetweenIntersections
    }


    var rafterContact = HousePlan.parts.stud.DEPTH+HousePlan.parts.plywood.THICKNESS*SLOPE

    var backPlateRightHeight = roof.RAFTER_HEIGHT - HousePlan.verticalSlice(HousePlan.parts.twinWall.THICKNESS, SLOPE)

    var backPlateLeftHeight = backPlateRightHeight - rafterContact*SLOPE

    var backWallCapFrontHeight = HousePlan.verticalSlice(roof.RAFTER_HEIGHT - HousePlan.parts.twinWall.THICKNESS, SLOPE) - (HousePlan.parts.plywood.THICKNESS + HousePlan.parts.stud.DEPTH - roof.RAFTER_WIDTH)*SLOPE



    function teensyHouse() {

      var plan = new HousePlan()

      plan.add(floorSection, {
        name: "floor-left",
        xPos: 0,
        xSize: 48,
        yPos: FLOOR_TOP,
        zPos: 0,
        zSize: FLOOR_LENGTH,
        join: "right"
      })

      plan.add(floorSection, {
        name: "floor-right",
        xPos: 48,
        xSize: 48,
        yPos: FLOOR_TOP,
        zPos: 0,
        zSize: FLOOR_LENGTH,
        join: "left"
      })

      plan.add(faceWall, {
        name: "back-wall-left",
        zPos: 0,
        yPos: FLOOR_TOP,
        width: 48,
        height: BACK_WALL_INSIDE_HEIGHT,
        topOverhang: backPlateLeftHeight - HousePlan.parts.plywood.THICKNESS*SLOPE,
        bottomOverhang: floorSection.HEIGHT,
        joins: "right top-full",
        leftBattenOverhang: HousePlan.parts.plywood.THICKNESS,
        rightBattenOverhang: 0.75,
        orientation: "north",
        slope: SLOPE,
      })

      plan.add(faceWall, {
        name: "back-wall-right",
        xPos: 48,
        zPos: 0,
        yPos: FLOOR_TOP,
        width: 48,
        height: BACK_WALL_INSIDE_HEIGHT,
        topOverhang: backPlateLeftHeight,
        bottomOverhang: floorSection.HEIGHT,
        joins: "left top-full",
        rightBattenOverhang: HousePlan.parts.plywood.THICKNESS,
        orientation: "north",
        slope: SLOPE,
      })


      var frontWallWidth = (96 - doors.OPENING_WIDTH)/2

      var frontWallPosition = 48+24 - HousePlan.parts.stud.DEPTH

      plan.add(faceWall, {
        name: "front-wall-left",
        zPos: frontWallPosition,
        xPos: 0,
        yPos: FLOOR_TOP,
        width: frontWallWidth,
        height: doors.OPENING_HEIGHT + 0.75,
        bottomOverhang: floorSection.HEIGHT,
        joins: "top",
        leftBattenOverhang: HousePlan.parts.plywood.THICKNESS,
        orientation: "south",
        slopeBattens: false,
      })

      plan.add(faceWall, {
        name: "front-wall-right",
        zPos: frontWallPosition,
        xPos: frontWallWidth + doors.OPENING_WIDTH,
        yPos: FLOOR_TOP,
        width: frontWallWidth,
        height: doors.OPENING_HEIGHT + 0.75,
        bottomOverhang: floorSection.HEIGHT,
        joins: "top",
        rightBattenOverhang: HousePlan.parts.plywood.THICKNESS,
        orientation: "south",
        slopeBattens: false,
      })

      plan.add(joins)

      var doorFramingTop = FLOOR_TOP - doors.OPENING_HEIGHT

      var headerHeight = doorFramingTop - headerRafterIntersection.yPos - 0.75

      plan.add(faceWall, {
        name: "header",
        zPos: frontWallPosition,
        xPos: 0,
        yPos: FLOOR_TOP - doors.OPENING_HEIGHT - 0.75,
        width: 96,
        height: headerHeight,
        topOverhang: backWallCapFrontHeight,
        leftBattenOverhang: HousePlan.parts.plywood.THICKNESS,
        rightBattenOverhang: HousePlan.parts.plywood.THICKNESS,
        middleBattenBottomGap: doors.TRIM_WIDTH - HousePlan.parts.trim.THICKNESS - doors.GAP - 0.75,
        joins: "bottom",
        orientation: "south",
        slope: SLOPE,
      })

      plan.add(doors, {
        name: "doors",
        yPos: doorFramingTop,
        zPos: 72,
        xPos: frontWallWidth,
      })

      plan.add(roof, {
        name: "roof",
        zPos: rafterStart.zPos,
        yPos: rafterStart.yPos,
        slope: SLOPE,
      })

      var wallHang = HousePlan.parts.stud.DEPTH + HousePlan.parts.plywood.THICKNESS

      var interiorWidth = 48 - wallHang

      var height = BACK_WALL_INSIDE_HEIGHT + HousePlan.verticalSlice(0.75, SLOPE) + interiorWidth*SLOPE

      plan.add(sideWall, {
        name: "left-wall-A",
        xPos: 0,
        yPos: FLOOR_TOP,
        zPos: wallHang,
        width: 48 - wallHang,
        height: height,
        joins: "right top",
        leftOverhang: wallHang,
        bottomOverhang: floorSection.HEIGHT,
        topOverhang: HousePlan.verticalSlice(roof.RAFTER_HEIGHT - 0.75, SLOPE),
        whichSide: "left",
        slope: SLOPE,
      })

      // plan.add(sideWall, {
      //   name: "left-wall-B",
      //   xPos: 0,
      //   yPos: FLOOR_TOP,
      //   zPos: 48 - HousePlan.parts.plywood.THICKNESS,
      //   width: 24+HousePlan.parts.plywood.THICKNESS*2,
      //   backWallHeight: BACK_WALL_INSIDE_HEIGHT,
      //   overhangs: "join/wall",
      //   innerTopOverhang: HousePlan.verticalSlice(0.75, SLOPE),
      //   whichSide: "left",
      //   slope: SLOPE,
      // })

      // var rightWallOffset = 96 - HousePlan.parts.stud.DEPTH

      // plan.add(sideWall, {
      //   name: "right-wall-A",
      //   xPos: rightWallOffset,
      //   yPos: FLOOR_TOP,
      //   zPos: -HousePlan.parts.plywood.THICKNESS,
      //   width: 48,
      //   backWallHeight: BACK_WALL_INSIDE_HEIGHT,
      //   overhangs: "wall/join",
      //   innerTopOverhang: HousePlan.verticalSlice(0.75, SLOPE),
      //   whichSide: "right",
      //   slope: SLOPE,
      // })

      // plan.add(sideWall, {
      //   name: "right-wall-B",
      //   xPos: rightWallOffset,
      //   yPos: FLOOR_TOP,
      //   zPos: 48 - HousePlan.parts.plywood.THICKNESS,
      //   width: 24+HousePlan.parts.plywood.THICKNESS*2,
      //   backWallHeight: BACK_WALL_INSIDE_HEIGHT,
      //   overhangs: "join/wall",
      //   innerTopOverhang: HousePlan.verticalSlice(0.75, SLOPE),
      //   whichSide: "right",
      //   slope: SLOPE,
      // })



      return plan
    }



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
        name: "back-wall-cap",
        xPos: roof.RAFTER_WIDTH,
        xSize: 96 - roof.RAFTER_WIDTH*2,
        yPos: FLOOR_TOP - BACK_WALL_INSIDE_HEIGHT,
        zPos: 0,
        zSize: 1.5,
        ySize: -backWallCapFrontHeight,
        slope: SLOPE,
      })

      // back cap overhang
      // back sheathing height
      // back stud height
      // back interior ply height
      // floor overhang

      var backCapOverhang = backWallCapFrontHeight - (1.5+plywood.THICKNESS)*SLOPE

      // console.log("backCapOverhang:", dimensionText(backCapOverhang))

      console.log("sheathingBottomOverhang:", dimensionText(floorSection.HEIGHT))

      // var sideJoiningStud = {
      //   section: joins,
      //   part: trim,
      //   slope: SLOPE,
      //   xSize: stud.DEPTH,
      //   yPos: FLOOR_TOP,
      //   ySize: -BACK_WALL_INSIDE_HEIGHT - (48 + 0.75 - plywood.THICKNESS - stud.DEPTH)*SLOPE,
      //   zPos: 48 - plywood.THICKNESS - 0.75,
      //   zSize: 1.5,
      // }

      // sloped(sideJoiningStud, {
      //   name: "left-wall-joining-stud",
      //   xPos: 0,
      // })

      // sloped(sideJoiningStud, {
      //   name: "right-wall-joining-stud",
      //   xPos: 96 - stud.DEPTH,
      // })

      trim({
        section: joins,
        name: "front-joining-plate",
        xSize: 96,
        yPos: FLOOR_TOP - doors.OPENING_HEIGHT,
        ySize: -1.5,
        zPos: FLOOR_LENGTH - stud.DEPTH,
        zSize: stud.DEPTH,
      })

    }

    return teensyHouse

  }
)