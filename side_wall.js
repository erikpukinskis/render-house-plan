var library = require("nrtv-library")(require)

module.exports = library.export(
  "side-wall",
  ["./house_plan", "./roof", "./floor_section"],
  function(HousePlan, roof, floorSection) {

    function sideWall(section, stud, plywood, sloped, trim, sloped, tilted, verticalSlice, insulation, options) {

      var wall = section(
        pick(options, "name", "xPos", "yPos", "zPos")
      )

      var name = options.name
      var whichSide = options.whichSide
      var flip = whichSide == "right"

      var wallHang = HousePlan.parts.stud.DEPTH + HousePlan.parts.plywood.THICKNESS*2
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

      var backCornerHeight = options.backWallHeight - backWallWidth*options.slope + verticalSlice(roof.RAFTER_HEIGHT, options.slope) + floorSection.HEIGHT

      var startOffset = options.zPos

      var endOffset = startOffset + options.width

      var sheathingHeight = backCornerHeight + endOffset*options.slope

      var interiorWidth = options.width - outerShortHang + innerShortHang - outerTallHang + innerTallHang

      var backInsideToInteriorEnd = options.zPos + options.width - outerTallHang + innerTallHang - stud.DEPTH - plywood.THICKNESS

      var interiorHeight = options.backWallHeight + backInsideToInteriorEnd*options.slope + options.innerTopOverhang||0

      verticalSlice(0.75, options.slope) + (options.zPos + interiorWidth)*options.slope

      sloped({
        section: wall,
        name: name+"-sheathing",
        part: plywood,
        xPos: flip ? stud.DEPTH : -plywood.THICKNESS,
        zPos: 0,
        zSize: options.width,
        ySize: -sheathingHeight,
        slope: options.slope,
        orientation: flip ? "east" : "west",
        yPos: floorSection.HEIGHT
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
        slope: options.slope,
        yPos: 0
      })

      var studHeightAtZero = options.backWallHeight - backWallWidth*options.slope + (options.zPos+stud.WIDTH)*options.slope

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
        ySize: -studHeightAtZero - offset*options.slope,
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
          ySize: -studHeightAtZero - offset*options.slope,
        })

        var insulationWidth = offset - distance

        sloped({
          part: insulation,
          name: name+"-insulation-"+(i+1),
          slope: options.slope,
          section: wall,
          zPos: distance,
          zSize: insulationWidth,
          yPos: 0,
          ySize: -83 - (distance + insulationWidth)*options.slope
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

      var studHeightAtZero = options.backWallHeight - (stud.DEPTH + plywood.THICKNESS)*options.slope

      var topPlateYPos = -studHeightAtZero - (options.zPos + plateOffset)*options.slope

      tilted({
        section: wall,
        part: stud,
        slope: options.slope,
        name: name+"-top-plate",
        orientation: "down",
        ySize: stud.WIDTH,
        yPos: topPlateYPos,
        zPos: plateOffset,
        zSize: plateLength,
      })

      var battenHeightAtZero = studHeightAtZero + floorSection.HEIGHT + verticalSlice(roof.RAFTER_HEIGHT, options.slope) + HousePlan.parts.batten.WIDTH*options.slope + options.zPos*options.slope

      var battenXPos = flip ? stud.DEPTH + plywood.THICKNESS : -plywood.THICKNESS - trim.THICKNESS

      var batten = {
        section: wall,
        part: trim,
        slope: options.slope,
        xPos: battenXPos,
        yPos: floorSection.HEIGHT,
        zSize: HousePlan.parts.batten.WIDTH,
      }

      var shortBattenOffset = overhangs[0] == "wall" ? -trim.THICKNESS : -HousePlan.parts.batten.WIDTH/2
      sloped(batten, {
        name: name+"-batten-A",
        ySize: -battenHeightAtZero - shortBattenOffset*options.slope,
        zPos: shortBattenOffset,
      })

      var tallBattenOverhang = overhangs[1] == "join" ? HousePlan.parts.batten.WIDTH/2 : trim.THICKNESS
      var maxBattenOffset = options.width - HousePlan.parts.batten.WIDTH + tallBattenOverhang

      for(var i=1; i<3; i++) {

        var tryOffset = offset = 24*i - HousePlan.parts.batten.WIDTH/2
        var bail = false
        if (tryOffset + HousePlan.parts.batten.WIDTH + 1 > maxBattenOffset) {
          offset = maxBattenOffset
          bail = true
        }

        sloped(batten, {
          name: name+"-batten-B",
          ySize: -battenHeightAtZero - offset*options.slope,
          zPos: offset,
        })

        if (bail) { break }
      }
    }

    function pick(object) {
      var keys = Array.prototype.slice.call(arguments, 1)
      var light = {}
      keys.forEach(function(key) {
        light[key] = object[key]
      })
      return light
    }

    return sideWall
  }
)