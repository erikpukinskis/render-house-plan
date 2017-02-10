var library = require("module-library")(require)


module.exports = library.export(
  "teensy-house-3",
  ["house-plan", "house-panels"],
  function(HousePlan, housePanels) {

    function teensyHouse() {

      var plan = new HousePlan()

      var BACK_WALL_INSIDE_HEIGHT = 80
      var FLOOR_TOP = 96
      var FLOOR_HEIGHT = 3.5

      var rafterStart = {
        zPos: HousePlan.parts.stud.DEPTH + HousePlan.parts.plywood.THICKNESS,
        yPos: FLOOR_TOP - BACK_WALL_INSIDE_HEIGHT
      }

      plan.add(themDoors, {
        name: "doors",
        xPos: HousePlan.parts.plywood.THICKNESS + HousePlan.parts.stud.DEPTH,
        xSize: 30,
        yPos: FLOOR_TOP,
        ySize: 96,
        zPos: 96,
      })


      plan.add(housePanels.faceWall, {
        name: "front wall",
        xPos: 64,
        xSize: 32,
        ySize: 96,
        joins: "top-full",
        bottomOverhang: FLOOR_HEIGHT,
        rightOverhang: 3.5,
        orientation: "north",        
      })

      function themDoors(section, trim, options) {

        var doors = section(pick(options, "name", "xPos", "yPos", "zPos"))

        var windowWidth = 24

        var doorTrim = {
          section: doors,
          xSize: 3.5,
          ySize: -options.ySize,
          yPos: FLOOR_HEIGHT,
          zPos: -0.75,
          zSize: 0.75,
        }


        // Left door

        trim(doorTrim, {
          name: "left-door-west-front-jamb",
          xPos: 0,
          zPos: -0.75,
        })

        trim(doorTrim, {
          name: "left-door-west-back-jamb",
          xPos: 0,
          zPos: -1.5,
        })

        trim(doorTrim, {
          name: "left-door-east-front-jamb",
          xPos: 3.5 + windowWidth,
          xSize: 5.5,
        })

        trim(doorTrim, {
          name: "left-door-east-back-jamb",
          xPos: 3.5 + windowWidth,
          zPos: -1.5,
        })


        // Post

        trim(doorTrim, {
          name: "post-front",
          xPos: 3.5 + windowWidth + 5.5,
          zPos: -0.75,
        })

        trim(doorTrim, {
          name: "post-back",
          zPos: -1.5,
          xPos: 3.5 + windowWidth + 3.5,
        })



        // Right door

        var rightDoor = 3.5 + windowWidth + 3.5 + 3.5

        trim(doorTrim, {
          name: "right-door-west-front-jamb",
          xPos: rightDoor + 2,
          zPos: -0.75,
          xSize: 3.5,
        })

        trim(doorTrim, {
          name: "right-door-west-back-jamb",
          zPos: -1.5,
          xPos: rightDoor,
          xSize: 5.5,
        })

        trim(doorTrim, {
          name: "right-door-east-front-jamb",
          xPos: rightDoor + 5.5 + windowWidth,
        })

        trim(doorTrim, {
          name: "right-door-east-back-jamb",
          xPos: rightDoor + 5.5 + windowWidth,
          zPos: -1.5,
        })


      }

      function pick(object) {
        var keys = Array.prototype.slice.call(arguments, 1)

        var light = {}

        keys.forEach(function(key) {
          light[key] = object[key]
        })

        return light
      }


      
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
          name: "left-wall-B",
          xPos: 0,
          yPos: FLOOR_TOP,
          zPos: 48,
          zSize: 48,
          slope: 0,
        }
      )

      housePanels.addTo(plan,
        "side wall",
        {
          name: "right-wall-A",
          xPos: rightWallOffset,
          yPos: FLOOR_TOP,
          zPos: wallHang,
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
          zSize: 48,
          slope: 0,
        }
      )

      return plan
    }


    return teensyHouse

  }
)