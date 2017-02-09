var library = require("module-library")(require)


module.exports = library.export(
  "teensy-house-3",
  ["house-plan", "house-panels"],
  function(HousePlan, housePanels) {

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
          zSize: 96,
        }
      )

      housePanels.addTo(plan,
        "floor extension",
        {
          name: "floor-right",
          xPos: 48,
          yPos: FLOOR_TOP,
          zPos: 0,
          zSize: 96,
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

      var wallHang = HousePlan.parts.stud.DEPTH + HousePlan.parts.plywood.THICKNESS

      var rightWallOffset = 96 - HousePlan.parts.stud.DEPTH


      housePanels.addTo(plan,
        "side wall",
        {
          name: "left-wall-A",
          xPos: 0,
          yPos: FLOOR_TOP,
          zPos: wallHang,
          slope: 0,
        }
      )

      housePanels.addTo(plan,
        "side wall extension",
        {
          name: "right-wall-A",
          xPos: rightWallOffset,
          yPos: FLOOR_TOP,
          zPos: wallHang,
          slope: 0,
        }
      )

      housePanels.addTo(plan,
        "side wall",
        {
          name: "left-wall-B",
          xPos: 0,
          yPos: FLOOR_TOP,
          zPos: 48,
          slope: 0,
        }
      )

      housePanels.addTo(plan,
        "side wall extension",
        {
          name: "right-wall-B",
          xPos: 0,
          yPos: FLOOR_TOP,
          zPos: 48,
          slope: 0,
        }
      )

      return plan
    }


    return teensyHouse

  }
)