var library = require("nrtv-library")(require)

module.exports = library.export(
  "build-floor",
  ["./steps", "./house_plan", "nrtv-browser-bridge", "./dimension_text"],
  function(Steps, HousePlan, BrowserBridge, dimensionText) {

    function chalkLines(direction, joists, task) {

      task("chalk-horizontal-lines", "Add chalk lines <strong>3/4\"</strong> in from the front and back edge (the shorter sides)")

      var distances = joists.map(toLeft).join(", ")

      function toLeft(joist) {
        return "<strong>"+dimensionText(joist.destination.xPos + 0.75)+"</strong>"
      }

      task("chalk-vertical-lines", "Add chalk lines at "+distances+" from the "+direction+" (long side)")

    }


    function buildFloor(options, materials) {

      var STUD_WIDTH = HousePlan.parts.stud.WIDTH
      materials.setPrefix(options.name)

      var steps = new Steps()

      var joists = materials.list(
        "joist-A",
        "joist-B",
        "joist-C",
        "joist-D"
      )

      steps.add("cut steel track", function(cut) {

        cut(materials.list(
          "front-track",
          "back-track"
        ))

      })

      steps.add("cut joists", function(cut) {

        cut(materials.list(
          "joist-A", "joist-B", "joist-C", "joist-D"
        ))

      })

      steps.add("cut sheathing", function(cut, task) {

        cut(materials.list("sheathing"))

        chalkLines("right", joists, task)
      })

      steps.add("cut subfloor", function(cut, task) {

        cut(materials.list("subfloor"))

        chalkLines("left", joists, task)

      })

      steps.add("lay out framing", function(task) {

        var trackLength = dimensionText(materials.list("front-track")[0].size
        )

        task("space-tracks", "Lay out the front and back tracks (should be "+trackLength+" long) <strong>"+dimensionText(options.zSize)+"</strong> apart.")

        function toLeft(joist) {
          return "<strong>"+dimensionText(joist.destination.xPos)+"</strong>"
        }

        task("set-joists", "Set the joists in the tracks "+joists.map(toLeft)+" from the right")

        // diagram("bottom", materials.list("front-track", "back-track", "joist-A", "joist-B", "joist-C", "joist-D"))

        task("crimp", "Crimp each stud to both tracks, with one single crimp on the top side of the stud")

        task("shim", "Add shims underneath each of the four corners until the tracks and the outer studs are level")

      })


      steps.add("attach sheathing", function(task) {

        var inverseJoin = {
          left: "right",
          right: "left"
        }[options.join]

        task("lay-sheathing", "Lay the sheathing plywood on top of the framing, so that "+itLinesUp(inverseJoin))

        task("screw-sheathing", "Screw down the sheathing, one screw every 8 inches on the chalk lines")

      })

      function itLinesUp(side) {
        if (side == "left") {
          return "the plywood hangs over 3/4in on the right side"
        } else if (side == "right") {
          return "the plywood hangs over 3/4in on the left side"
        } else {
          return "it lines up exactly with the framing"
        }
      }

      steps.add("flip it", function(task) {
        task("flip", "flip the section over")
      })

      steps.add("add insulation", function(task, cut) {

        task("insulate", "cut and add insulation between the joists")

        cut(materials.list("insulation-A", "insulation-B", "insulation-C"))

      })

      steps.add("attach subfloor", function(task) {

        task("lay-subfloor", "Lay the subfloor plywood on top of the framing, so that "+itLinesUp(options.join))

        task("screw-subfloor", "Screw down the subfloor, one screw ever 8 inches on the chalk lines")

      })

      steps.add("flooring", function(task) {

        task("install-flooring", "Glue down flooring to cover the entire subflooor")

      })

      return steps
    }

    return buildFloor
  }
)