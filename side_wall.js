
function sideWall(section, stud, plywood, sloped, trim, sloped, tilted, verticalSlice, insulation, options) {

  var wall = section(
    pick(options, "name", "xPos", "yPos", "zPos")
  )

  var name = options.name
  var whichSide = options.whichSide
  var flip = whichSide == "right"

  var wallHang = plan.parts.stud.DEPTH + plan.parts.plywood.THICKNESS*2
  var joinHang = 0.75

  var overhangs = options.overhangs.split("/")

  if (overhangs[0] == "wall") {
    var outerShortHang = wallHang
    var innerShortHang = 0    
  } else {
    var outerShortHang = joinHang
    var innerShortHang = joinHang
  }

  if (overhangs[1] == "wall") {
    var outerTallHang = wallHang
    var innerTallHang = 0
  } else {
    var outerTallHang = joinHang
    var innerTallHang = joinHang
  }

  var backWallWidth = stud.DEPTH + plywood.THICKNESS*2

  var backCornerHeight = BACK_WALL_INSIDE_HEIGHT - backWallWidth*SLOPE + verticalSlice(RAFTER_HEIGHT, SLOPE) + wholeFloorHeight

  var startOffset = options.zPos

  var endOffset = startOffset + options.width

  var sheathingHeight = backCornerHeight + endOffset*SLOPE

  var interiorWidth = options.width - outerShortHang + innerShortHang - outerTallHang + innerTallHang

  var backInsideToInteriorEnd = options.zPos + options.width - outerTallHang + innerTallHang - stud.DEPTH - plywood.THICKNESS

  var interiorHeight = BACK_WALL_INSIDE_HEIGHT + backInsideToInteriorEnd*SLOPE + options.innerTopOverhang||0

  verticalSlice(0.75, SLOPE) + (options.zPos + interiorWidth)*SLOPE

  sloped({
    section: wall,
    name: name+"-sheathing",
    part: plywood,
    xPos: flip ? stud.DEPTH : -plywood.THICKNESS,
    zPos: 0,
    zSize: options.width,
    ySize: -sheathingHeight,
    slope: SLOPE,
    orientation: flip ? "east" : "west",
    yPos: wholeFloorHeight
  })

  sloped({
    section: wall,
    name: name+"-interior",
    part: plywood,
    sanded: true,
    "z-index": "100",
    xPos: flip ? -plywood.THICKNESS : stud.DEPTH,
    zPos: outerShortHang - innerShortHang,
    orientation: flip ? "west" : "east",
    zSize: interiorWidth,
    ySize: -interiorHeight,
    slope: SLOPE,
    yPos: 0
  })

  var studHeightAtZero = BACK_WALL_INSIDE_HEIGHT - backWallWidth*SLOPE + (options.zPos+stud.WIDTH)*SLOPE

  var sideStud = {
    part: stud,
    orientation: "north",
    zSize: stud.WIDTH,
    slope: 1/6,
    yPos: 0
  }

  var offset = outerShortHang
  sloped(sideStud, {
    section: wall,
    name: name+"-stud-1",
    orientation: "south",
    zPos: offset,
    ySize: -studHeightAtZero - offset*SLOPE,
  })

  var maxOffset = options.width - outerTallHang - stud.WIDTH

  var distance = 0

  for(var i=1; i<4; i++) {

    var tryOffset = offset = 16*i - stud.WIDTH/2
    var bail = false
    if (tryOffset + stud.WIDTH + 1 > maxOffset) {
      offset = maxOffset
      bail = true
    }

    sloped(sideStud, {
      section: wall,
      name: name+"-stud-"+(i+1),
      zPos: offset,
      ySize: -studHeightAtZero - offset*SLOPE,
    })

    var insulationWidth = offset - distance

    sloped({
      part: insulation,
      name: name+"-insulation-"+(i+1),
      slope: SLOPE,
      section: wall,
      zPos: distance,
      zSize: insulationWidth,
      yPos: 0,
      ySize: -83 - (distance + insulationWidth)*SLOPE
    })

    distance = offset

    if (bail) { break }
  }

  var plateOffset = outerShortHang
  var plateLength = options.width - stud.DEPTH - plywood.THICKNESS*2 - 0.75

  stud({
    section: wall,
    name: name+"-bottom-plate",
    orientation: "up",
    yPos: -stud.WIDTH,
    zPos: plateOffset,
    zSize: plateLength,
  })

  var plateStart = options.zPos + outerShortHang

  var studHeightAtZero = BACK_WALL_INSIDE_HEIGHT - (stud.DEPTH + plywood.THICKNESS)*SLOPE

  var topPlateYPos = -studHeightAtZero - (options.zPos + plateOffset)*SLOPE

  tilted({
    section: wall,
    part: stud,
    slope: SLOPE,
    name: name+"-top-plate",
    orientation: "down",
    ySize: stud.WIDTH,
    yPos: topPlateYPos,
    zPos: plateOffset,
    zSize: plateLength,
  })

  var battenHeightAtZero = studHeightAtZero + wholeFloorHeight + verticalSlice(RAFTER_HEIGHT, SLOPE) + BATTEN_WIDTH*SLOPE + options.zPos*SLOPE

  var battenXPos = flip ? stud.DEPTH + plywood.THICKNESS : -plywood.THICKNESS - trim.THICKNESS

  var batten = {
    section: wall,
    part: trim,
    slope: SLOPE,
    xPos: battenXPos,
    yPos: wholeFloorHeight,
    zSize: BATTEN_WIDTH,
  }

  var shortBattenOffset = overhangs[0] == "wall" ? -trim.THICKNESS : -BATTEN_WIDTH/2
  sloped(batten, {
    name: name+"-batten-A",
    ySize: -battenHeightAtZero - shortBattenOffset*SLOPE,
    zPos: shortBattenOffset,
  })

  var tallBattenOverhang = overhangs[1] == "join" ? BATTEN_WIDTH/2 : trim.THICKNESS
  var maxBattenOffset = options.width - BATTEN_WIDTH + tallBattenOverhang

  for(var i=1; i<3; i++) {

    var tryOffset = offset = 24*i - BATTEN_WIDTH/2
    var bail = false
    if (tryOffset + BATTEN_WIDTH + 1 > maxBattenOffset) {
      offset = maxBattenOffset
      bail = true
    }

    sloped(batten, {
      name: name+"-batten-B",
      ySize: -battenHeightAtZero - offset*SLOPE,
      zPos: offset,
    })

    if (bail) { break }
  }
}