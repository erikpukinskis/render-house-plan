var library = require("nrtv-library")(require)

module.exports = library.export(
  "build-face-wall",
  ["./steps", "./house_plan", "./dimension_text", "./some_materials", "./face_wall"],
  function(Steps, HousePlan, dimensionText, BASE_MATERIALS, faceWall) {

    function buildFaceWall(options, materials) {

      var STUD_WIDTH = HousePlan.parts.stud.WIDTH
      materials.setPrefix(options.name)

      var steps = new Steps()
      var studs = materials.list("stud-*")

      steps.add("cut sheathing", function(cut, task, studMarks) {
          var sheathing = materials.get("sheathing")

          cut(sheathing)

          task("sheathing-lines", "mark lines "+studMarks(studs, options, "sheathing")+" from the left")

          var overhangs = faceWall.getOverhangs(options)

          var trackFromTop = overhangs.top + STUD_WIDTH/2

          var trackFromBottom = overhangs.bottom + STUD_WIDTH/2

          task("sheathing-track-lines", "mark horizontal lines "+dimensionText(trackFromTop)+" from the top and "+dimensionText(trackFromBottom)+" from the bottom")

          task("sheathing-screw-spacing", "cross all lines with a mark approximately every 10 inches")

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
        function(cut, task, studMarks) {

          cut(materials.list("*-track"))

          var marks = studMarks(studs, options)

          task("mark-track", "Lay the two pieces of track together so they form a square tube. Mark them with a wax pencil at "+marks+" from the left putting an ✗ to the right of each mark")

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

      var joinGaps = faceWall.getJoinGaps(options)

      if (joinGaps.right != 0) {
        var alignmentStud = "leftmost"
        var firstSide = "left"
        var secondSide = "right"
        var firstInset = 2
        var secondInset = 1
      } else if (joinGaps.left != 0) {
        var alignmentStud = "rightmost"
        var firstSide = "right"
        var secondSide = "left"
        var firstInset = 2
        var secondInset = 2
      }

      steps.add("square interior",
        function(task) {
          task("position-interior", "Lay the interior (sanded) plywood on the framing, sanded face up, factory edge roughly lined up with the bottom track. If the plywood is bowed, put something heavy in the middle.") 

          task("square-first-corner", "using a tri-square, make sure the plywood is vertically aligned with the "+alignmentStud+" stud and the bottom track")

          task("first-corner-screw", "Put a self-driving screw about <strong>"+dimensionText(1/2)+"</strong> from the bottom and about <strong>"+dimensionText(firstInset)+"</strong> from the "+firstSide)

          // http://www.carpentry-tips-and-tricks.com/Carpenter-square.html

          task("square-bottom-side", "Square the bottom "+secondSide+" corner the same way, and put a self-driving screw in <strong>"+dimensionText(1/2)+"</strong> from the bottom and <strong>"+dimensionText(secondInset)+"</strong> from the "+secondSide)

          task("square-top-left", "Move the top left corner so that it is square with the stud and use your tri-square to check the top track is <strong>"+dimensionText(joinGaps.top)+"</strong> from the edge of the plywood at every point.")

          task("screw-top-left", "Put a screw <strong>"+dimensionRound(joinGaps.top+5/8)+"</strong> from the top and <strong>"+dimensionRound(firstInset)+"</strong> from the left")

          task("screw-top-left", "Put a screw <strong>"+dimensionRound(joinGaps.top+5/8)+"</strong> from the top and <strong>"+dimensionRound(secondInset)+"</strong> from the right")

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

          task("lay-sheathing", "Lay the sheathing on the frame, with the factory edge toward the bottom.")

          var bottomOverhang = options.bottomOverhang||0

          var topOverhang = options.topOverhang||0 + joinGaps.top

          task("square-first-sheathing-corner", "Align the sheathing so that the bottom edge is uniformly <strong>"+dimensionText(bottomOverhang)+"</strong> past the framing, and the "+secondSide+" edge is square with the plywood on the other side. Put a screw on the track line <strong>"+dimensionText(secondInset)+"</strong> from the "+secondSide)

          task("square-mirror-sheathing-corner", "Align the top "+secondSide+" corner next, so that the top edge extends <strong>"+dimensionText(topOverhang)+"</strong> beyond the underlying framing. Put a screw on the track line <strong>"+dimensionText(secondInset)+"</strong> from the "+secondSide)

          task("screw-opposite-side-sheaething", "Put screws on the top and bottom track lines <strong>"+dimensionText(firstInset)+"</strong> from the "+firstSide)

        }
      )

      steps.add("attach sheathing",
        function(task) {
          task("attach-sheathing", "Put screws on the stud and track lines every 10 inches as with the interior plywood")
        }
      )

      return steps
    }

    function dimensionRound(number) {
      var rounded = Math.round(number*2)/2
      return dimensionText(rounded)
    }

    return buildFaceWall
  }
)

