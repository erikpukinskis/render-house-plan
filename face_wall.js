function faceWall(section, plywood, stud, trim, sloped, verticalSlice, insulation, options) {

  var wall = section(options)

  var studHeight = options.height

  var topOverhang = options.topOverhang || 0

  var bottomOverhang = options.bottomOverhang || 0

  var insideTopOverhang = options.insideTopOverhang || 0

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
    xSize: BATTEN_WIDTH,
    zSize: trim.THICKNESS,
    yPos: bottomOverhang,
    zPos: battenZPos,
  }

  var battenOffset = overhangs[0] == "none" ? -plywood.THICKNESS : -BATTEN_WIDTH/2

  if (typeof options.leftBattenOverhang != "undefined") {
    sloped(batten, {
      section: wall,
      name: options.name+"-batten-1",
      xPos: -options.leftBattenOverhang,
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

  if (typeof options.rightBattenOverhang != "undefined") {
    sloped(batten, {
      section: wall,
      name: options.name+"-batten-2",
      xPos: options.width - BATTEN_WIDTH + options.rightBattenOverhang,
      ySize: -shortBattenHeight
    })
  }

  // PLYWOOD

  var oppositeOrientation = options.orientation == "north" ? "south" : "north"

  plywood({
    section: wall,
    name: options.name+"-interior",
    sanded: true,
    xPos: 0,
    xSize: options.width,
    yPos: 0,
    ySize: -options.height - insideTopOverhang,
    zPos: options.orientation == "south" ? -plywood.THICKNESS : stud.DEPTH,
    orientation: oppositeOrientation
  })

  plywood({
    section: wall,
    name: options.name+"-sheathing",
    xPos: 0,
    xSize: options.width,
    ySize: -(options.height + bottomOverhang + topOverhang),
    yPos: bottomOverhang,
    zPos: options.orientation == "south" ? stud.DEPTH : -plywood.THICKNESS,
    orientation: options.orientation
  })


  var plateSize = options.width - leftHang - rightHang

  stud({
    section: wall,
    name: options.name+"-bottom-plate",
    orientation: "up-across",
    xPos: leftHang,
    xSize: plateSize,
    yPos: -stud.WIDTH
  })

  stud({
    section: wall,
    name: options.name+"-top-plate",
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
    name: options.name+"-stud-1",
    orientation: "east",
    xPos: leftHang,
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