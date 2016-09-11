
function floorInstructions(options, materials) {

  var STUD_WIDTH = plan.parts.stud.WIDTH

  materials.setPrefix(options.name)

  var joists = materials.list(
    "joist-A",
    "joist-B",
    "joist-C",
    "joist-D"
  )

  step("cut steel track", function() {

    cutMaterials(step, materials.list(
      "front-track",
      "back-track"
    ))

  })

  step("cut joists", function() {

    cutMaterials(step, materials.list(
      "joist-A", "joist-B", "joist-C", "joist-D"
    ))

  })

  step("cut sheathing", function() {

    cutMaterials(step, materials.list("sheathing"))

    chalkLines("right")
  })



  function chalkLines(direction) {

    step.instruction("Add chalk lines 3/4\" in from the front and back edge (the shorter sides)")

    var distances = joists.map(toLeft).join(", ")

    function toLeft(joist) {
      return "<strong>"+dimensionText(joist.destination.xPos + 0.75)+"</strong>"
    }

    step.instruction("Add chalk lines at "+distances+" from the "+direction+" (long side)")

  }


  step("cut subfloor", function() {

    cutMaterials(step, materials.list("subfloor"))

    chalkLines("left")

  })

  step("lay out framing", function() {

    var trackLength = dimensionText(materials.list("front-track")[0].size
    )

    step.instruction("Lay out the front and back tracks ("+trackLength+" long) "+dimensionText(options.zSize)+" apart.")

    function toLeft(joist) {
      return "<strong>"+dimensionText(joist.destination.xPos)+"</strong>"
    }

    step.instruction("Set the joists inthe tracks "+joists.map(toLeft)+" from the right")

    // diagram("bottom", materials.list("front-track", "back-track", "joist-A", "joist-B", "joist-C", "joist-D"))

    step.instruction("Crimp each stud to both tracks, with one single crimp on the top side of the stud")

    step.instruction("Add shims underneath each of the four corners until the tracks and the outer studs are level")

  })


  step("attach sheathing", function() {

    var inverseJoin = {
      left: "right",
      right: "left"
    }[options.join]

    step.instruction("Lay the sheathing plywood on top of the framing, so that "+itLinesUp(inverseJoin))

    step.instruction("Screw down the sheathing, one screw every 8 inches on the chalk lines")

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

  step("flip the section over")

  step("add insulation", function() {

    step.instruction("cut and add insulation between the joists")

    cutMaterials(step, materials.list("insulation-A", "insulation-B", "insulation-C"))

  })

  step("attach subfloor", function() {

    step.instruction("Lay the subfloor plywood on top of the framing, so that "+itLinesUp(options.join))

    step.instruction("Screw down the subfloor, one screw ever 8 inches on the chalk lines")

  })

  step("flooring", function() {

    step.instruction("Glue down flooring to cover the entire subflooor")

  })

  step("you did it!")
  return

}
