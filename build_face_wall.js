var library = require("nrtv-library")(require)

module.exports = library.export(
  "build-face-wall",
  ["./steps", "./house_plan", "./dimension_text"],
  function(Steps, HousePlan, dimensionText) {


    function buildFaceWall(options, materials) {

      var STUD_WIDTH = HousePlan.parts.stud.WIDTH
      materials.setPrefix(options.name)

      var steps = new Steps()

      var sheathing = materials("sheathing")[0]

      return steps

      steps.add("cut sheathing", function(task) {
          task("rip-sheathing", "cut 2 sheets of "+sheathing.description+" to <strong>"+dimensionText(sheathing.length)+"</strong>")
        }
      )


// cut 2 sheets to the outside HEIGHT

// cut notches in the plywood
// cut 2 sheet to the inside HEIGHT
// cut the studs to HEIGHT
// cut the track to 48
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

    return buildFaceWall
  }
)

