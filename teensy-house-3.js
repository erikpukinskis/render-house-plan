var library = require("nrtv-library")(require)


module.exports = library.export(
  "teensy-house-3",
  ["./house_plan", "./face_wall", "./doors", "./floor_section", "./roof", "./side_wall", "./dimension_text", "./door_section"],
  function(HousePlan, faceWall, doors, floorSection, roof, sideWall, dimensionText, doorSection) {

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

      var stud = HousePlan.parts.stud
      var plywood = HousePlan.parts.plywood

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
        xSize: 48,
        ySize: BACK_WALL_INSIDE_HEIGHT,
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
        xSize: 48,
        ySize: BACK_WALL_INSIDE_HEIGHT,
        topOverhang: backPlateLeftHeight,
        bottomOverhang: floorSection.HEIGHT,
        joins: "left top-full",
        rightBattenOverhang: HousePlan.parts.plywood.THICKNESS,
        orientation: "north",
        slope: SLOPE,
      })

      plan.add(joins)


      var frontWallWidth = (96 - doors.OPENING_WIDTH)/2

      var frontWallPosition = 48+24 - HousePlan.parts.stud.DEPTH

      // var headerHeight = doorFramingTop - headerRafterIntersection.yPos - 0.75

      var frontWallHeight = FLOOR_TOP - headerRafterIntersection.yPos 

      console.log("front wall height:", frontWallHeight)


      plan.add(doorSection, {
        name: "door-section",
        yPos: FLOOR_TOP,
        zPos: 72,
        xPos: 0,
        xSize: 48,
        joins: "right top-full",
        bottomOverhang: floorSection.HEIGHT,
        topOverhang: roof.RAFTER_HEIGHT,
        ySize: frontWallHeight
      })

      plan.add(faceWall, {
        name: "front-wall-right",
        zPos: frontWallPosition,
        xPos: 48,
        yPos: FLOOR_TOP,
        ySize: frontWallHeight,
        xSize: 48,
        openingWidth: 24,
        openingHeight: 48,
        openingBottom: 39-12,
        openingLeft: 6,
        bottomOverhang: floorSection.HEIGHT,
        topOverhang: roof.RAFTER_HEIGHT,
        joins: "top-full left",
        rightBattenOverhang: HousePlan.parts.plywood.THICKNESS,
        orientation: "south",
        slopeBattens: false,
      })

      plan.add(roof, {
        name: "roof",
        zPos: rafterStart.zPos,
        yPos: rafterStart.yPos,
        slope: SLOPE,
      })

      var wallHang = HousePlan.parts.stud.DEPTH + HousePlan.parts.plywood.THICKNESS

      var interiorWidth = 48 - wallHang

      var sideHeightA = BACK_WALL_INSIDE_HEIGHT + HousePlan.verticalSlice(0.75, SLOPE) + interiorWidth*SLOPE

      var sideWidthA = 48 - wallHang

      var topOverhang = HousePlan.verticalSlice(roof.RAFTER_HEIGHT - 0.75, SLOPE)

      var rightWallOffset = 96 - HousePlan.parts.stud.DEPTH

      plan.add(sideWall, {
        name: "left-wall-A",
        xPos: 0,
        yPos: FLOOR_TOP,
        zPos: wallHang,
        zSize: sideWidthA,
        ySize: sideHeightA,
        joins: "right top",
        leftOverhang: wallHang,
        bottomOverhang: floorSection.HEIGHT,
        topOverhang: topOverhang,
        whichSide: "left",
        slope: SLOPE,
      })

      plan.add(sideWall, {
        name: "right-wall-A",
        xPos: rightWallOffset,
        yPos: FLOOR_TOP,
        zPos: wallHang,
        zSize: sideWidthA,
        ySize: sideHeightA,
        joins: "right top",
        leftOverhang: wallHang,
        bottomOverhang: floorSection.HEIGHT,
        topOverhang: topOverhang,
        whichSide: "right",
        slope: SLOPE,
      })
      
      var sideWidthB = 24 - wallHang

      var sideHeightB = sideHeightA + sideWidthB*SLOPE

      plan.add(sideWall, {
        name: "left-wall-B",
        xPos: 0,
        yPos: FLOOR_TOP,
        zPos: 48,
        zSize: sideWidthB,
        ySize: sideHeightB,
        joins: "left top",
        bottomOverhang: floorSection.HEIGHT,
        topOverhang: topOverhang,
        rightOverhang: wallHang,
        whichSide: "left",
        slope: SLOPE,
      })

      plan.add(sideWall, {
        name: "right-wall-B",
        xPos: rightWallOffset,
        yPos: FLOOR_TOP,
        zPos: 48,
        zSize: sideWidthB,
        ySize: sideHeightB,
        joins: "left top",
        bottomOverhang: floorSection.HEIGHT,
        topOverhang: topOverhang,
        rightOverhang: wallHang,
          whichSide: "right",
        slope: SLOPE,
      })



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

      var backCapOverhang = backWallCapFrontHeight - (1.5+plywood.THICKNESS)*SLOPE

      console.log("backCapOverhang:", dimensionText(backCapOverhang))

      console.log("sheathingBottomOverhang:", dimensionText(floorSection.HEIGHT))

    }

    return teensyHouse

  }
)