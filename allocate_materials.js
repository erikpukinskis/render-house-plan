var library = require("nrtv-library")(require)


module.exports = library.export(
  "allocate-materials",
  ["./some_materials", "./set_of_materials", "./house_plan"],
  function(BASE_MATERIALS, SetOfMaterials, HousePlan) {

    function allocateMaterials(plan) {
      var set = new SetOfMaterials()

      var getHandler = getMaterialHandler.bind(null, set)

      plan.generate(getHandler)

      return set
    }

    function getMaterialHandler(materials, name) {

      var helper = helpers[name]

      if (!helper) { return }

      helper = helper.bind(null, materials)

      return helper
    }

    var helpers = {
      section: noop,
      stud: stud,
      plywood: plywood,
      insulation: insulation,
      flooring: flooring,
      door: door,
      trim: trim,
      shade: reflectix,
      sloped: sloped,
      twinWall: twinWall,
      tilted: tilted,
    }

    function noop() {}

    function plywood(materials) {
      var options = joinObjects(arguments, 1)

      var dimensions = lumberDimensions(
        options,
        {
          defaultThickness: HousePlan.parts.plywood.THICKNESS,
          maxThickness: 1,
          maxWidth: 48
        }
      )

      if (dimensions.length <= 48) {
        console.log(options)
        throw new Error("We don't need a full length of plywood for this piece")
      }

      if (dimensions.width < 2) {
        throw new Error("Use scrap for plywood pieces < 2in")
      }

      if (dimensions.width > 48) {
        throw new Error("plywood can't be wider than 4ft")
      }

      if (dimensions.length > 96) {
        throw new Error("plywood can't be wider than 8ft")
      }

      var finish = options.sanded ? "sanded" : "rough"

      var description = dimensions.thickness+"in "+finish+" plywood"

      if (dimensions.width > 45) {
        var sheet = materials.reserve(description, "cross", dimensions.length)

        materials.cut(sheet, "cross", dimensions.length, options)

      } else {
        var sheet = materials.reserve(description, "rip", dimensions.width)

        materials.cut(sheet, "rip", dimensions.width, options)
      }
    }

    function trim(materials) {
      var options = joinObjects(arguments, 1)

      var dimensions = lumberDimensions(
        options,
        {
          defaultThickness: HousePlan.parts.trim.THICKNESS,
          maxThickness: 1.5,  
          maxWidth: 7.5,
        }
      )

      if (dimensions.thickness == 1.5) {
        var description = "8ft 2x"
      } else if (dimensions.thickness == 0.75) {
        var description = "8ft 1x"
      } else {
        throw new Error("no trim pieces "+dimensions.thickness+"in thick")
      }

      var crossCut = dimensions.length < 48

      if (dimensions.width == 1.5 && dimensions.thickness == 0.75) {
        description = "8ft furring strip"
        crossCut = true

      } else if (dimensions.width > 7.5) {
        throw new Error(dimensions.width+" is too wide!")
      } else if (dimensions.width > 5.5) {
        description = description+"8"
      } else if (dimensions.width > 3.5) {
        description = description+"6"
      } else if (dimensions.width > 2.5) {
        description = description+"4"
      } else if (!crossCut && dimensions.width > 1.5) {
        description = description+"6"
      } else {
        description = description+"4"
      }

      if (crossCut) {
        var board = materials.reserve(description, "cross", dimensions.length)

        materials.cut(board, "cross", dimensions.length, options)

      } else {

        var board = materials.reserve(description, "rip", dimensions.width)

        materials.cut(board, "rip", dimensions.width, options)

      }

    }

    function door(materials) {
      var options = joinObjects(arguments, 1)

      var door = materials.reserve("door")
      door.parts.push(options.name)
    }

    function stud(materials) {
      var options = joinObjects(arguments, 1)

      var dimensions = lumberDimensions(
        options,
        {
          defaultThickness: HousePlan.parts.stud.WIDTH,
          maxThickness: HousePlan.parts.stud.WIDTH,
          maxWidth: HousePlan.parts.stud.DEPTH,
        }
      )

      if (dimensions.length < 5) {
        throw new Error("can't make stud less than 5 inches tall")
      }

      var isTrack = ["down", "up", "down-across", "up-across", "horizontal-south", "horizontal-north"].indexOf(options.orientation) != -1

      var description = isTrack ? "10ft steel track" : "8ft steel stud"

      var steel = materials.reserve(description, "cross", dimensions.length)

      materials.cut(steel, "cross", dimensions.length, options)
    }

    function twinWall(materials) {
      var options = joinObjects(arguments, 1)

      var dimensions = lumberDimensions(
        options,
        {
          defaultThickness: HousePlan.parts.twinWall.THICKNESS,
          maxThickness: 1,
          maxWidth: 48,
        }
      )

      var poly = materials.reserve("twin wall poly", "cross", dimensions.length)

      materials.cut(poly, "cross", dimensions.length, options)

    }

    function insulation(materials) {
      var options = joinObjects(arguments, 1)

      var dimensions = lumberDimensions(
        options,
        {
          defaultThickness: HousePlan.parts.stud.DEPTH,
          maxThickness: 4,
          maxWidth: 18,
        }
      )

      var fiberglass = materials.reserve("fiberglass insulation", "cross", dimensions.length)

      materials.cut(fiberglass, "cross", dimensions.length, options)

    }

    function reflectix(materials) {
      var options = joinObjects(arguments, 1)

      var dimensions = lumberDimensions(
        options,
        {
          defaultThickness: 0.5,
          maxThickness: 0.5,
          maxWidth: 48,
        }
      )

      var shade = materials.reserve("reflectix roll", "cross", dimensions.length)

      materials.cut(shade, "cross", dimensions.length, options)

    }


    function flooring(materials) {
      var options = joinObjects(arguments, 1)

      var area = options.xSize/12 * options.zSize/12

      var description = "vinyl flooring"

      materials.reserveBulk(description, area, options.name)
    }

    function sloped(materials) {
      var options = joinObjects(arguments, 1)
      options.part(options)
    }

    function tilted(materials) {
      var options = joinObjects(arguments, 1)

      if (!options.zSize) {
        console.log("offending part:", options)
        throw new Error("can't tilt a part without a zSize")
      }

      var rise = options.slope * options.zSize

      var newZSize = Math.sqrt(
        Math.pow(options.zSize, 2) + Math.pow(rise, 2)
      )

      options.part(merge(options, {
        zSize: newZSize
      }))

    }

    function joinObjects(iterable, start) {
      var joined = {}

      for(var i = start||0; i<iterable.length; i++) {
        for(var key in iterable[i]) {
          joined[key] = iterable[i][key]
        }
      }

      return joined
    }

    function merge(obj1,obj2){
      var obj3 = {};
      for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
      for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
      return obj3;
    }
    


    /** TESTS ******/
    var options = {
      defaultThickness: 0.5,
      maxThickness: 0.9,
      maxWidth: 48,
    }
    var dim = lumberDimensions({
      ySize: 48, zSize: 60
    }, options)
    if (dim.thickness != 0.5 || dim.width != 48 || dim.length != 60) { th() }

    dim = lumberDimensions({
      xSize: 65, ySize: 0.9, zSize: 38
    }, options)
    if (dim.thickness != 0.9 || dim.width != 38 || dim.length != 65) { th() }

    function th() {
      throw new Error("lumberDimensions is not working")
    }
    /****************/



    function lumberDimensions(shape, options) {

      var xSize = Math.abs(shape.xSize || options.defaultThickness)
      var ySize = Math.abs(shape.ySize || options.defaultThickness)
      var zSize = Math.abs(shape.zSize || options.defaultThickness)

      var minDimension = Math.min(xSize, ySize, zSize)

      // Hardcoded here for ripping the 1in shade rails 
      if (minDimension == 1) {
        minDimension = 1.5
      }

      if (xSize == minDimension) {
        var thickness = xSize
        if (ySize <= options.maxWidth) {
          var width = ySize
          var length = zSize
        } else {
          var length = ySize
          var width = zSize
        }
      } else if (ySize == minDimension) {
        var thickness = ySize
        if (xSize <= options.maxWidth) {
          var width = xSize
          var length = zSize
        } else {
          var length = xSize
          var width = zSize
        }      
      } else if (zSize == minDimension) {
        var thickness = zSize
        if (xSize <= options.maxWidth) {
          var width = xSize
          var length = ySize
        } else {
          var length = xSize
          var width = ySize
        }            
      }

      if (typeof thickness == "undefined") {
        debugger
      }
      return {
        length: length,
        width: width,
        thickness: thickness
      }
    }




    function argNames(func) {
      var pattern = /^function[ a-zA-Z]*\(([a-zA-Z, ]*)/
      var argString = func.toString().match(pattern)[1]

      if (argString) {
        return argString.split(/, ?/)
      } else {
        return []
      }
    }

    allocateMaterials.BASE_MATERIALS = BASE_MATERIALS

    return allocateMaterials
  }
)