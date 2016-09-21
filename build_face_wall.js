var library = require("nrtv-library")(require)

module.exports = library.export(
  "build-face-wall",
  ["./steps", "./house_plan", "./dimension_text", "./some_materials"],
  function(Steps, HousePlan, dimensionText, BASE_MATERIALS) {

    function buildFaceWall(options, materials) {

      var STUD_WIDTH = HousePlan.parts.stud.WIDTH
      materials.setPrefix(options.name)

      var steps = new Steps()
      var studs = materials.list("stud-*")

      steps.add("cut sheathing", function(cut, task) {
          var sheathing = materials.get("sheathing")
          cut(sheathing)

          task("sheathing-lines", "Chalk or mark lines "+studMarks(studs.slice(1), options, "left"))

          task("sheathing-screw-spacing", "Cross those lines with a mark approximately every 10 inches")

          // cut notches in the plywood
        }
      )

      steps.add("cut interior", function(cut) {
          var interior = materials.get("interior")
          cut(interior)
          // add screw lines
        }
      )

      steps.add("cut studs",
        function(cut) {
          cut(studs)
        }
      )

      steps.add("cut track",
        function(cut, task) {

          cut(materials.list("*-track"))

          var marks = studMarks(studs, options, "left")

          task("mark-track", "Lay the two pieces of track together so they form a square tube. Mark them with a wax pencil at "+marks+" putting an ✗ to the right of each mark")

          task("label-track", "Label the top one top and the bottom one bottom.")

          task("transfer-track-marks", "Transfer the marks to other sides of each piece of track")
        }
      )

      steps.add("lay out framing",
        function(task) {
          task("lay-out-framing", "Space the two pieces of track <strong>"+dimensionText(studs[0].size)+"</strong> apart. Set the studs inside the tracks on the X side of each mark. Studs should face in.")
          task("crimp", "At each stud-track intersection, have one person press the stud securely up into the track, while another person crimps the two together.")
          task("flip-framing", "Gently flip the frame over")
          task("crimp-other-side", "Crimp the other side")
        }
      )

      if (options.joins == "right") {
        var alignmentStud = "leftmost"
        var firstSide = "left"
        var secondSide = "right"
        var firstInset = 2
        var secondInset = 1
      } else if (options.joins == "left") {
        var alignmentStud = "rightmost"
        var firstSide = "right"
        var secondSide = "left"
        var firstInset = 2
        var secondInset = 2
      } else {
        throw new Error("don't understand join")
      }

      steps.add("square interior",
        function(task) {
          task("position-interior", "Lay the interior (sanded) plywood on the framing, sanded face up, factory edge roughly lined up with the bottom track. If the plywood is bowed, put something heavy in the middle.") 

          task("square-first-corner", "using a tri-square, make sure the plywood is vertically aligned with the "+alignmentStud+" stud and the bottom track, and ")

          task("first-corner-screw", "Put a self-driving screw about <strong>"+dimensionText(1/2)+"</strong> from the bottom and about <strong>"+dimensionText(firstInset)+"</strong> from the "+firstSide)

          // http://www.carpentry-tips-and-tricks.com/Carpenter-square.html

          task("square-bottom-side", "Square the bottom "+secondSide+" corner the same way, and put a self-driving screw in <strong>"+dimensionText(1/2)+"</strong> from the bottom and <strong>"+dimensionText(secondInset)+"</strong> from the "+secondSide)

          task("square-top-left", "Move the top left corner so that it is square with the stud and use your tri-square to check the top track is <strong>"+dimensionText(insideOverhang)+"</strong> from the edge of the plywood at every point.")

          task("screw-top-left", "Put a screw <strong>"+dimensionRound(insideOverhang+5/8)+"</strong> from the top and <strong>"+dimensionRound(firstInset)+"</strong> from the left")

          task("screw-top-left", "Put a screw <strong>"+dimensionRound(insideOverhang+5/8)+"</strong> from the top and <strong>"+dimensionRound(secondInset)+"</strong> from the right")

        }
      )

      steps.add("attach interior",
        function(task) {
          task("screw-track", "Put a self-driving at the middle of each track, and halfway between the middle and the corner screws")

          task("screw-lines", "Put a screw on your stud lines every 10 inches")

          task("screw-edge", "Put a self-driving screw every 10 inches along the "+firstSide+" side")
        }
      )

      steps.add("flipsulate", function(task) {
          task("flip-squared", "Flip the section over")

          task("insulate", "Add insulation between each stud")
        }
      )

      steps.add("align sheathing", function(task) {

        }
      ) 

// align outside ply with inside ply on right and left edges
// set with proper overhangs on top and bottom
// left side:
//   add a 2x3 stud on the right



      return steps
    }

    function dimensionRound(number) {
      var rounded = Math.round(number*2)/2
      return dimensionText(rounded)
    }

    function studMarks(studs, options, direction) {
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

        marks += "<strong>"+dimensionText(fromLeft)+"</strong> from "+direction
        
      }

      return marks
    }

    return buildFaceWall
  }
)

