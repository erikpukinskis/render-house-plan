var library = require("nrtv-library")(require)

module.exports = library.export(
  "build-face-wall",
  ["./steps", "./house_plan", "./dimension_text", "./some_materials"],
  function(Steps, HousePlan, dimensionText, BASE_MATERIALS) {

    function buildFaceWall(options, materials) {

      var STUD_WIDTH = HousePlan.parts.stud.WIDTH
      materials.setPrefix(options.name)

      var steps = new Steps()

      steps.add("cut sheathing", function(cut) {
          var sheathing = materials.get("sheathing")
          cut(sheathing)
          // add screw lines
          // cut notches in the plywood
        }
      )

      steps.add("cut interior", function(cut) {
          var interior = materials.get("interior")
          cut(interior)
          // add screw lines
        }
      )

      var studs = materials.list("stud-*")
      steps.add("cut studs",
        function(cut) {
          cut(studs)
        }
      )

      steps.add("cut track",
        function(cut, task) {

          cut(materials.list("*-track"))

          var marks = studMarks(studs, options)

          task("mark-track", "Lay the two pieces of track together, rails together. Mark the tops at "+marks+" putting an ✗ to the right of each mark")

          task("transfer-track-marks", "Transfer the marks to other sides of each piece of track")
        }
      )

      steps.add("lay out framing",
        function(task) {
          task("lay-out-framing", "Space the two pieces of track <strong>"+dimensionText(studs[0].size)+"</strong> apart. Set the studs inside the tracks on the X side of each mark.")
          task("crimp", "While pressing each stud securely up into the track, crimp the two together at each intersection.")
          task("flip-framing", "Gently flip the frame over")
          task("crimp-other-side", "Crimp the other side")
        }
      )


// right side:
//   assemble frame wall. left stud an extra 3/4" in, but 16" centers otherwise. 
// left side:
//   no right stud
// lay down sanded ply
// square bottom left corner
// square bottom right corner
// square top left & top right, using a tri square to get a 1 1/2" overhang. Make sure left stud lines up but don't worry about right.
// screw everything
// flip it
// lay in insulation
// align outside ply with inside ply on right and left edges
// set with proper overhangs on top and bottom
// left side:
//   add a 2x3 stud on the right



      return steps
    }

    function studMarks(studs, options) {
      var originX = options.xPos||0
      var marks = ""

      for(var i=0; i<studs.length; i++) {
        var stud = studs[i]

        var isFirst = i == 0
        var isLast = !isFirst && i == studs.length-1

        if (isLast) {
          marks += ", and "
        } else if (!isFirst) {
          marks += ", "
        }

        var fromLeft = stud.destination.xPos - originX

        marks += "<strong>"+dimensionText(fromLeft)+"</strong> from left"
        
      }

      return marks
    }

    return buildFaceWall
  }
)

