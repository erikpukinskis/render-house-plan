function floorSection(section, plywood, stud, insulation, flooring, options) {

  if (!options.zSize) {
    console.log(options)
    throw new Error("floor section must have a zSize")
  }

  var id = options.name

  var floor = section({
    name: id,
    xPos: options.xPos,
    yPos: FLOOR_TOP,
    zPos: 0
  })

  var letters = ["A","B","C", "D"]

  for(var i=0; i<3; i++) {
    insulation({
      section: floor,
      name: options.name+"-insulation-"+letters[i],
      xPos: 1+i*16,
      xSize: 14,
      yPos: 1,
      ySize: 2,
      zPos: 1,
      zSize: options.zSize-2,
    })
  }

  var trackLength = options.xSize
  if (options.join == "right" || options.join == "left") {
    trackLength = trackLength - 0.75
  }

  var framingOffset = 0
  if (options.join == "left") {
    framingOffset = 0.75
  }

  stud({
    section: floor,
    name: id+"-back-track",
    xPos: framingOffset,
    xSize: trackLength,
    yPos: FLOORING_THICKNESS + SUBFLOOR_THICKNESS,
    orientation: "horizontal-south"
  })

  stud({
    section: floor,
    name: id+"-front-track",
    xPos: framingOffset,
    xSize: trackLength,
    yPos: FLOORING_THICKNESS + SUBFLOOR_THICKNESS,
    zPos: options.zSize - stud.WIDTH,
    orientation: "horizontal-north"
  })

  var joist = {
    section: floor,
    orientation: "horizontal-east",
    xPos: framingOffset,
    yPos: FLOORING_THICKNESS + SUBFLOOR_THICKNESS,
    ySize: stud.DEPTH,
    zSize: 72
  }

  stud(joist, {
    name: id+"-joist-A",
    xPos: framingOffset,
  })

  stud(joist, {
    name: id+"-joist-B",
    xPos: framingOffset + 16,
  })

  stud(joist, {
    name: id+"-joist-C",
    xPos: framingOffset + 16*2,
  })

  stud(joist, {
    name: id+"-joist-D",
    orientation: "horizontal-west",
    xPos: framingOffset + trackLength - stud.WIDTH,
  })

  plywood({
    section: floor,
    name: id+"-subfloor",
    xPos: 0,
    xSize: options.xSize,
    yPos: 1/4,
    ySize: SUBFLOOR_THICKNESS,
    zSize: options.zSize,
    orientation: "up"
  })

  flooring({
    section: floor,
    name: id+"-flooring",
    xPos: 0,
    xSize: options.xSize,
    yPos: 0,
    ySize: 1/4,
    zSize: options.zSize,
  })

  plywood({
    section: floor,
    name: id+"-sheathing",
    xSize: options.xSize,
    yPos: FLOORING_THICKNESS + SUBFLOOR_THICKNESS + stud.DEPTH,
    zSize: options.zSize,
    orientation: "down"
  })


}
