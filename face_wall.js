var library = require("nrtv-library")(require)

module.exports = library.export(
  "face-wall",
  ["./house_plan"],
  function(HousePlan) {


    function faceWall(section, plywood, stud, trim, sloped, verticalSlice, insulation, options) {

      if (!options.orientation) {
        throw new Error("face wall needs an orientation")
      }

      var wall = section(options)

      var topOverhang = options.topOverhang || 0

      var bottomOverhang = options.bottomOverhang || 0

      var insideTopOverhang = options.insideTopOverhang || 0

      var battenHeight = options.height + topOverhang + bottomOverhang

      var battenZPos = options.orientation == "south" ? stud.DEPTH + plywood.THICKNESS : -plywood.THICKNESS - trim.THICKNESS

      var batten = {
        section: wall,
        part: trim,
        "z-index": 100,
        xSize: HousePlan.parts.batten.WIDTH,
        zSize: trim.THICKNESS,
        yPos: bottomOverhang,
        ySize: -battenHeight,
        zPos: battenZPos,
        slope: options.slope,
      }

      var battenGenerator = options.slopeBattens === false ? trim : sloped


      if (typeof options.leftBattenOverhang != "undefined") {
        battenGenerator(batten, {
          name: options.name+"-batten-1",
          xPos: -options.leftBattenOverhang,
        })
      }

      var maxSegments = (options.width - 12)/24
      var bottomGap = options.middleBattenBottomGap||0

      for (var i=1; i<maxSegments; i++) {
        var xPos = 24*i - HousePlan.parts.batten.WIDTH/2
        var yPos = bottomOverhang - bottomGap
        var ySize = -battenHeight + bottomGap
        battenGenerator(batten, {
          name: options.name+"-batten-2",
          xPos: xPos,
          yPos: yPos,
          ySize: ySize,
        })
      }

      if (typeof options.rightBattenOverhang != "undefined") {
        battenGenerator(batten, {
          name: options.name+"-batten-2",
          xPos: options.width - HousePlan.parts.batten.WIDTH + options.rightBattenOverhang,
        })
      }

      // PLYWOOD

      var oppositeOrientation = options.orientation == "north" ? "south" : "north"

      var overhang = {
        left: options.leftOverhang || 0,
        right: options.rightOverhang || 0,
        top: options.topOverhang || 0,
        bottom: options.bottomOverhang || 0,
      }

      plywood({
        section: wall,
        name: options.name+"-interior",
        sanded: true,
        xPos: 0 - overhang.left,
        xSize: options.width + overhang.left + overhang.right,
        yPos: 0,
        ySize: -options.height,
        zPos: options.orientation == "south" ? -plywood.THICKNESS : stud.DEPTH,
        orientation: oppositeOrientation
      })

      plywood({
        section: wall,
        name: options.name+"-sheathing",
        xPos: overhang.left,
        xSize: options.width + overhang.left + overhang.right,
        ySize: -(options.height + overhang.bottom + overhang.top),
        yPos: overhang.bottom,
        zPos: options.orientation == "south" ? stud.DEPTH : -plywood.THICKNESS,
        orientation: options.orientation
      })

      join = {}
      ;["left", "right", "top", "bottom"].forEach(function(direction) {

        var hasJoin = options.joins.match(direction)

        join[direction] = hasJoin ? 0.75 : 0
      })

      var plateSize = options.width - join.left - join.right

      stud({
        section: wall,
        name: options.name+"-bottom-plate",
        orientation: "up-across",
        xPos: join.left,
        xSize: plateSize,
        yPos: -stud.WIDTH - join.bottom
      })

      var studHeight = options.height - join.top - join.bottom

      stud({
        section: wall,
        name: options.name+"-top-plate",
        orientation: "down-across",
        xPos: join.left,
        xSize: plateSize,
        yPos: -options.height + join.top
      })

      var wallStud = {
        orientation: "west",
        ySize: -studHeight,
        yPos: -join.bottom
      }

      stud(wallStud, {
        section: wall,
        name: options.name+"-stud-1",
        orientation: "east",
        xPos: join.left,
      })

      var maxStudOffset = options.width - join.right - stud.WIDTH
      var insulated = 0

      for(var i=1; i<8; i++){
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

    function contains(array, value) {
      if (!Array.isArray(array)) {
        throw new Error("looking for "+JSON.stringify(value)+" in "+JSON.stringify(array)+", which is supposed to be an array. But it's not.")
      }
      var index = -1;
      var length = array.length;
      while (++index < length) {
        if (array[index] == value) {
          return true;
        }
      }
      return false;
    }

    return faceWall
  }
)
