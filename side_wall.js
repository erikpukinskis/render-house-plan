var library = require("nrtv-library")(require)

module.exports = library.export(
  "side-wall",
  ["./house_plan", "./roof", "./floor_section", "./dimension_text", "./face_wall"],
  function(HousePlan, roof, floorSection, dimensionText, faceWall) {

    function sideWall(section, stud, plywood, sloped, trim, sloped, tilted, verticalSlice, insulation, options) {

      var wall = section(
        pick(options, "name", "xPos", "yPos", "zPos")
      )

      var name = options.name
      var whichSide = options.whichSide
      var flip = whichSide == "right"


      // SPE CU LA TION:

      options.joins // top right

      var joins = faceWall.getJoinGaps(options)

      var innerTopOverhang = HousePlan.verticalSlice(joins.top, options.slope)



      // var overhangs = options.overhangs.split("/")

      // if (overhangs[0] == "wall") {
      //   var outerShortHang = wallHang
      //   var innerShortHang = 0    
      // } else {
      //   var outerShortHang = joinHang
      //   var innerShortHang = joinHang
      // }

      // if (overhangs[1] == "wall") {
      //   var outerTallHang = wallHang
      //   var innerTallHang = 0
      // } else {
      //   var outerTallHang = joinHang
      //   var innerTallHang = joinHang
      // }

      var wallThickness = stud.DEPTH + plywood.THICKNESS

      var overhangs = faceWall.getOverhangs(options)

      var sheathingHeight = options.height + overhangs.top + overhangs.bottom + overhangs.right*options.slope

      var sheathingWidth = options.width + overhangs.left + overhangs.right

      var interiorWidth = options.width

      var interiorHeight = options.height

      verticalSlice(0.75, options.slope) + (options.zPos + interiorWidth)*options.slope

      describePly("sheathing height", options.width, sheathingHeight)

      console.log("zPos:", options.zPos, "leftHang:", overhangs.left)
      sloped({
        section: wall,
        name: name+"-sheathing",
        part: plywood,
        xPos: flip ? stud.DEPTH : -plywood.THICKNESS,
        ySize: -sheathingHeight,
        zPos: -overhangs.left,
        zSize: sheathingWidth,
        slope: options.slope,
        orientation: flip ? "east" : "west",
        yPos: floorSection.HEIGHT
      })

      describePly("interior height", interiorWidth, interiorHeight)

      sloped({
        section: wall,
        name: name+"-interior",
        part: plywood,
        sanded: true,
        "z-index": "100",
        xPos: flip ? -plywood.THICKNESS : stud.DEPTH,
        zPos: 0,
        orientation: flip ? "west" : "east",
        zSize: interiorWidth,
        ySize: -interiorHeight,
        slope: options.slope,
        yPos: 0
      })

      var studHeightAtZero = options.height - options.width*options.slope - verticalSlice(joins.top, options.slope) - joins.bottom

      var sideStud = {
        part: stud,
        orientation: "north",
        zSize: stud.WIDTH,
        slope: 1/6,
        yPos: 0
      }

      var studRise = options.slope*stud.WIDTH

      var offset = 0
      var firstStudHeight = studHeightAtZero + offset*options.slope + studRise
      describeStud(1, firstStudHeight)
      sloped(sideStud, {
        section: wall,
        name: name+"-stud-1",
        orientation: "south",
        zPos: offset,
        ySize: -firstStudHeight,
      })

      function describeStud(name, height) {
        if (options.name != "left-wall-A") {return}
        var shorterHeight = height - options.slope*stud.WIDTH
        console.log("stud "+name+": "+dimensionText(shorterHeight)+" to "+dimensionText(height))
      }

      function describePly(name, width, height) {
        if (options.name != "left-wall-A") {return}
        var shorterHeight = height - options.slope*width
        console.log(name+": "+dimensionText(shorterHeight)+" to "+dimensionText(height))
      }

      function describe(name, dimension) {
        if (options.name != "left-wall-A") {return}
        console.log(name+": "+dimensionText(dimension))
      }



      var maxOffset = options.width - joins.right - stud.WIDTH

      var distance = 0

      for(var i=1; i<4; i++) {

        var tryOffset = offset = 16*i - stud.WIDTH/2 - stud.WIDTH - plywood.THICKNESS
        var bail = false
        if (tryOffset + stud.WIDTH + 1 > maxOffset) {
          offset = maxOffset
          bail = true
        }

        var studHeight = studHeightAtZero + offset*options.slope + studRise
        describeStud(i+1, studHeight)

        sloped(sideStud, {
          section: wall,
          name: name+"-stud-"+(i+1),
          zPos: offset,
          ySize: -studHeight,
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

      describe("side wall bottom plate", options.width)
      stud({
        section: wall,
        name: name+"-bottom-plate",
        orientation: "up",
        yPos: -stud.WIDTH,
        zPos: 0,
        zSize: options.width,
      })

      describe("side wall sheathing corner overhang", overhangs.left)

      tilted({
        section: wall,
        part: stud,
        slope: options.slope,
        name: name+"-top-plate",
        orientation: "down",
        ySize: stud.WIDTH,
        yPos: -studHeightAtZero,
        zPos: 0,
        zSize: options.width,
      })

      var plateLength = options.width
      var rise = plateLength*options.slope
      var topLength = Math.sqrt(rise*rise+plateLength*plateLength)
      describe("side wall top plate", topLength)

      var battenXPos = flip ? stud.DEPTH + plywood.THICKNESS : -plywood.THICKNESS - trim.THICKNESS

      var battenWidth = HousePlan.parts.batten.WIDTH

      var batten = {
        section: wall,
        part: trim,
        slope: options.slope,
        xPos: battenXPos,
        yPos: floorSection.HEIGHT,
        zSize: -battenWidth,
      }

      var offset = -overhangs.left + plywood.THICKNESS + trim.THICKNESS
      var width = battenWidth + trim.THICKNESS

      var insideHeightAtBackWall = options.height - options.width*options.slope

      var studHeightAtWallStart = insideHeightAtBackWall - verticalSlice(joins.top, options.slope)

      var rafterHeight = verticalSlice(roof.RAFTER_HEIGHT, options.slope)

      var battenHeightAtZero = studHeightAtWallStart + floorSection.HEIGHT + rafterHeight

      if (!joins.left) {
        var height = battenHeightAtZero + offset*options.slope

        sloped(batten, {
          name: name+"-batten-A",
          ySize: -height,
          zPos: offset,
          zSize: -width
        })
      }

      var lastBattenOverhang = joins.right ? battenWidth/2 : plywood.THICKNESS + trim.THICKNESS

      var maxBattenOffset = options.width + overhangs.right + lastBattenOverhang

      var lastBattenWidth = overhangs.right ? battenWidth + trim.THICKNESS : battenWidth

      for(var i=1; i<3; i++) {

        var tryOffset = offset = 24*i + battenWidth/2

        var bail = false

        var isLastOne = tryOffset + battenWidth + 1 > maxBattenOffset

        if (isLastOne) {
          offset = maxBattenOffset
          bail = true
        }

        var height = battenHeightAtZero + offset*options.slope

        sloped(batten, {
          name: name+"-batten-B",
          ySize: -height,
          zPos: offset,
          zSize: isLastOne ? -lastBattenWidth : -battenWidth
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