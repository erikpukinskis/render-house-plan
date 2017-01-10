var library = require("module-library")(require)


module.exports = library.export(
  "teensy-house-3",
  ["house-plan", "house-panels"],
  function(HousePlan, housePanels) {

    // We need to export: faceWall, doors, floorSection, roof, sideWall, doorSection


    function teensyHouse() {

      var plan = new HousePlan()

      var BACK_WALL_INSIDE_HEIGHT = 80
      var FLOOR_TOP = 96

      var rafterStart = {
        zPos: HousePlan.parts.stud.DEPTH + HousePlan.parts.plywood.THICKNESS,
        yPos: FLOOR_TOP - BACK_WALL_INSIDE_HEIGHT
      }

      housePanels.addTo(plan,
        "base floor section",
        {
          name: "floor-left",
          xPos: 0,
          yPos: FLOOR_TOP,
          zPos: 0,
        }
      )

      housePanels.addTo(plan,
        "floor extension",
        {
          name: "floor-right",
          xPos: 48,
          yPos: FLOOR_TOP,
          zPos: 0,
        }
      )

      housePanels.addTo(plan,
        "back wall section",
        {
          name: "back-wall-left",
          zPos: 0,
          yPos: FLOOR_TOP,
        }
      )

      housePanels.addTo(plan,
        "back wall extension",
        {
          name: "back-wall-right",
          xPos: 48,
          yPos: FLOOR_TOP,
          zPos: 0,
        }
      )

      var frontWallPosition = 48+24 - HousePlan.parts.stud.DEPTH

      housePanels.addTo(plan,
        "door section",
        {
          name: "door-section",
          xPos: 0,
          yPos: FLOOR_TOP,
          zPos: 72,
        }
      )

      housePanels.addTo(plan,
        "window section",
        {
        name: "front-wall-right",
        xPos: 48,
        yPos: FLOOR_TOP,
        zPos: frontWallPosition,
        }
      )

      housePanels.addTo(plan,
        "roof",
        {
          name: "roof",
          yPos: rafterStart.yPos,
          zPos: rafterStart.zPos,
        }
      )

      var wallHang = HousePlan.parts.stud.DEPTH + HousePlan.parts.plywood.THICKNESS

      var rightWallOffset = 96 - HousePlan.parts.stud.DEPTH


      housePanels.addTo(plan,
        "side wall",
        {
          name: "left-wall-A",
          xPos: 0,
          yPos: FLOOR_TOP,
          zPos: wallHang,
        }
      )

      housePanels.addTo(plan,
        "side wall extension",
        {
          name: "right-wall-A",
          xPos: rightWallOffset,
          yPos: FLOOR_TOP,
          zPos: wallHang,
        }
      )

      housePanels.addTo(plan,
        "side wall",
        {
          name: "left-wall-B",
          xPos: 0,
          yPos: FLOOR_TOP,
          zPos: 48,
        }
      )

      housePanels.addTo(plan,
        "side wall extension",
        {
          name: "left-wall-B",
          xPos: 0,
          yPos: FLOOR_TOP,
          zPos: 48,
        }
      )

      return plan
    }


    return teensyHouse

  }
)