function faceWall(section, plywood, stud, trim, sloped, verticalSlice, insulation, options) {

  var wall = section(options)

  var studHeight = options.height - 1.5

  var topOverhang = options.topOverhang || 0

  var bottomOverhang = options.bottomOverhang || 0

  var backBattenHeight = options.height + topOverhang + bottomOverhang + topOverhang - plywood.THICKNESS*SLOPE

  var shortBattenHeight = backBattenHeight - verticalSlice(TWIN_WALL_THICKNESS, SLOPE)


  var overhangs = options.overhangs.split("/")

  if (overhangs[0] == "none" || overhangs[0] == "door") {
    var leftHang = 0
  } else {
    var leftHang = 0.75
  }

  if (overhangs[1] == "none" || overhangs[1] == "door") {
    var rightHang = 0
  } else {
    var rightHang = 0.75
  }



  var battenZPos = options.orientation == "south" ? stud.DEPTH + plywood.THICKNESS : -plywood.THICKNESS - trim.THICKNESS

  var batten = {
    part: trim,
    "z-index": 100,
    slope: SLOPE,
    xPos: -plywood.THICKNESS - trim.THICKNESS,
    xSize: BATTEN_WIDTH,
    zSize: trim.THICKNESS,
    yPos: bottomOverhang,
    zPos: battenZPos,
  }

  var battenOffset = overhangs[0] == "none" ? -plywood.THICKNESS : -BATTEN_WIDTH/2

  if (overhangs[0] == "none") {
    sloped(batten, {
      section: wall,
      name: options.name+"-batten-1",
      xPos: battenOffset,
      ySize: -backBattenHeight
    })
  }

  if (options.width > 26) {

    sloped(batten, {
      section: wall,
      name: options.name+"-batten-2",
      xPos: 24,
      ySize: -shortBattenHeight
    })
  }

  if (overhangs[1] == "none") {
    sloped(batten, {
      section: wall,
      name: options.name+"-batten-2",
      xPos: options.width - BATTEN_WIDTH + plywood.THICKNESS,
      ySize: -shortBattenHeight
    })
  }

  // PLYWOOD

  plywood({
    section: wall,
    name: "back-left-interior",
    sanded: true,
    xPos: 0,
    xSize: options.width,
    yPos: 0,
    ySize: -BACK_WALL_INSIDE_HEIGHT,
    zPos: options.orientation == "south" ? -plywood.THICKNESS : stud.DEPTH,
    orientation: "south"
  })

  plywood({
    section: wall,
    name: "back-left-sheathing",
    xPos: 0,
    xSize: options.width,
    ySize: -(BACK_WALL_INSIDE_HEIGHT + bottomOverhang + topOverhang),
    yPos: wholeFloorHeight,
    zPos: options.orientation == "south" ? stud.DEPTH : -plywood.THICKNESS,
    orientation: "north"
  })


  // STUDS

  var plateSize = options.width - leftHang - rightHang

  stud({
    section: wall,
    name: "back-left-bottom-plate",
    orientation: "up-across",
    xPos: leftHang,
    xSize: plateSize,
    yPos: -stud.WIDTH
  })

  stud({
    section: wall,
    name: "back-left-top-plate",
    orientation: "down-across",
    xPos: leftHang,
    xSize: plateSize,
    yPos: -studHeight
  })

  var wallStud = {
    orientation: "west",
    ySize: -studHeight,
    yPos: 0
  }

  stud(wallStud, {
    section: wall,
    name: "back-left-stud-1",
    orientation: "east",
    xPos: rightHang,

  })

  var maxStudOffset = options.width - rightHang - stud.WIDTH
  var insulated = 0

  for(var i=1; i<4; i++){
    var tryOffset = 16*i - stud.WIDTH/2

    if (tryOffset + 3 > maxStudOffset) {
      var offset = maxStudOffset
      var bail = true
    } else {
      var offset = tryOffset
      var bail = false
    }

    stud(wallStud, {
      section: wall,
      name: options.name+"-stud-"+(i+1),
      xPos: offset,
    })

    var insulationWidth = offset - insulated

    insulation({
      section: wall,
      name: options.name+"-insulation-"+(i+1),
      xPos: insulated,
      xSize: insulationWidth,
      yPos: 0,
      zPos: 0,
      zSize: stud.DEPTH,
      ySize: -80,
    })

    insulated = offset

    if (bail) { break }
  }

}