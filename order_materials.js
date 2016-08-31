var orderMaterials = (function() {
  var BASE_MATERIALS = {
    "0.5in rough plywood": {
      length: 96,
      width: 48,
      price: 1795,
      extra: 0,
    },
    "0.375in rough plywood": {
      length: 96,
      width: 48,
      price: 1533,
      extra: 1,
    },
    "0.375in sanded plywood": {
      length: 96,
      width: 48,
      price: 2723,
      extra: 1,
    },
    "8ft 2x4": {
      length: 96,
      width: 3.5,
      price: 321,
      extra: 1,
    },
    "8ft 2x6": {
      length: 96,
      width: 5.5,
      price: 483,
      extra: 1,
    },
    "8ft 1x4": {
      length: 96,
      width: 3.5,
      price: 248,
      extra: 1,
    },
    "8ft 1x6": {
      length: 96,
      width: 5.5,
      price: 752,
      extra: 1,
    },
    "8ft 1x8": { // http://www.homedepot.com/p/202603657
      length: 96,
      width: 7.5,
      price: 678,
      extra: 1,
    },
    "8ft furring strip": {
      length: 96,
      width: 1.5,
      price: 91,
      extra: 2,
    },
    "8ft steel stud": {
      length: 96,
      price: 357,
      extra: 2,
    },
    "10ft steel track": {
      length: 120,
      price: 433,
      extra: 1,
    },
    "twin wall poly": {
      length: 96,
      width: 48,
      price: 6100,
      extra: 0,
    },
    "door": {
      price: 10000,
      extra: 0,
    },
    "fiberglass insulation": {
      length: 32*12,
      width: 15,
      price: 1498,
      extra: 0,
    },
    "vinyl flooring": {
      unit: "sq ft",
      price: 150,
    },
    "reflectix roll": {
      length: 25*12,
      width: 48,
      price: 4400,
      extra: 0,
    }
  }

  var grandSubtotal = 0

  var bulkMaterialSets = {}

  function getBulk(description, quantity, name) {


    var set = bulkMaterialSets[description]
    if (!set) {
      set = bulkMaterialSets[description] = []
    }

    var price = BASE_MATERIALS[description].price

    grandSubtotal += quantity * price

    set.push({name: name, quantity: quantity})
  }


  var materialSets = {}

  function getMaterial(description, cut, size) {

    var set = materialSets[description]
    if (!set) {
      set = materialSets[description] = []
    }

    for(var i=0; i<set.length; i++) {
      var material = set[i]

      if (material.cut != cut) {
        continue
      }

      if (cut == "rip" && material.width >= size) {
        return material
      } else if (cut == "cross" && material.length >= size) {
        return material
      }
    }

    var material = BASE_MATERIALS[description]

    if (!material) {
      throw new Error("Add "+description+" to base materials")
    }

    material = merge(material, {
      parts: [],
      cutLengths: [],
      description: description
    })

    set.push(material)

    return material
  }

  function cutMaterial(material, cut, size, name) {
    if (material.cut && cut != material.cut) {
      throw new Error("trying to cut material the wrong way")
    }

    var constraint = cut == "cross" ? "length" : "width"

    if (material[constraint] < size) {
      throw new Error("not enough material")
    }

    material[constraint] = material[constraint] - size - 1/8
    material.cut = cut
    material.parts.push(name)
    material.cutLengths.push(size)

    var scrap = {
      cut: cut,
      part: name
    }
    scrap[constraint] = size

    return scrap

  }

  function plywoodMaterial(options) {
    var dimensions = lumberDimensions(
      options,
      {
        defaultThickness: plan.parts.plywood.THICKNESS,
        maxThickness: 1,
        maxWidth: 48
      }
    )

    if (dimensions.length <= 48) {
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
      var sheet = getMaterial(description, "cross", dimensions.length)

      var scrap = cutMaterial(sheet, "cross", dimensions.length, options.name)

    } else {
      var sheet = getMaterial(description, "rip", dimensions.width)

      var scrap = cutMaterial(sheet, "rip", dimensions.width, options.name)
    }
  }
  plywoodMaterial.THICKNESS = plan.parts.plywood.THICKNESS

  function trimMaterial(options) {
    var dimensions = lumberDimensions(
      options,
      {
        defaultThickness: trimMaterial.THICKNESS,
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
      var board = getMaterial(description, "cross", dimensions.length)

      var scrap = cutMaterial(board, "cross", dimensions.length, options.name)

    } else {

      var board = getMaterial(description, "rip", dimensions.width)

      var scrap = cutMaterial(board, "rip", dimensions.width, options.name)

    }

  }
  trimMaterial.THICKNESS = plan.parts.trim.THICKNESS

  function doorMaterial(options) {
    var door = getMaterial("door")
    door.parts.push(options.name)
    console.log(door)
  }
  doorMaterial.HEIGHT = plan.parts.door.HEIGHT
  doorMaterial.WIDTH = plan.parts.door.WIDTH
  doorMaterial.THICKNESS = plan.parts.door.THICKNESS

  function studMaterial(options) {
    var dimensions = lumberDimensions(
      options,
      {
        defaultThickness: studMaterial.WIDTH,
        maxThickness: studMaterial.WIDTH,
        maxWidth: studMaterial.DEPTH,
      }
    )

    if (dimensions.length < 5) {
      throw new Error("can't make stud less than 5 inches tall")
    }

    var isTrack = ["down", "up", "down-across", "up-across", "horizontal-south", "horizontal-north"].indexOf(options.orientation) != -1

    var description = isTrack ? "10ft steel track" : "8ft steel stud"

    var steel = getMaterial(description, "cross", dimensions.length)

    var scrap = cutMaterial(steel, "cross", dimensions.length, options.name)
  }
  studMaterial.DEPTH = plan.parts.stud.DEPTH
  studMaterial.WIDTH = plan.parts.stud.WIDTH


  function twinWallMaterial(options) {
    var dimensions = lumberDimensions(
      options,
      {
        defaultThickness: twinWallMaterial.THICKNESS,
        maxThickness: 1,
        maxWidth: 48,
      }
    )

    var poly = getMaterial("twin wall poly", "cross", dimensions.length)

    cutMaterial(poly, "cross", dimensions.length, options.name)

  }
  twinWallMaterial.THICKNESS = plan.parts.twinWall.THICKNESS

  function insulationMaterial(options) {
    var dimensions = lumberDimensions(
      options,
      {
        defaultThickness: plan.parts.stud.DEPTH,
        maxThickness: 4,
        maxWidth: 18,
      }
    )

    var fiberglass = getMaterial("fiberglass insulation", "cross", dimensions.length)

    cutMaterial(fiberglass, "cross", dimensions.length, options.name)

  }

  function reflectixMaterial(options) {
    var dimensions = lumberDimensions(
      options,
      {
        defaultThickness: 0.5,
        maxThickness: 0.5,
        maxWidth: 48,
      }
    )

    var shade = getMaterial("reflectix roll", "cross", dimensions.length)

    cutMaterial(shade, "cross", dimensions.length, options.name)

  }


  function flooringMaterial(options) {
    var area = options.xSize/12 * options.zSize/12

    var description = "vinyl flooring"

    getBulk(description, area, options.name)
  }

  function slopedMaterial(options) {
    options.part(options)
  }

  function tiltedMaterial(options) {
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


  function noop() {}

  var materialParts = {
    section: noop,
    stud: studMaterial,
    plywood: plywoodMaterial,
    insulation: insulationMaterial,
    flooring: flooringMaterial,
    door: doorMaterial,
    trim: trimMaterial,
    shade: reflectixMaterial,
    sloped: slopedMaterial,
    twinWall: twinWallMaterial,
    tilted: tiltedMaterial,
    slopeToRadians: plan.parts.slopeToRadians,
    slopeToDegrees: plan.parts.slopeToDegrees,
    verticalSlice: plan.parts.verticalSlice
  }



  /** TESTS ******/
  var options = {
    defaultThickness: 0.5,
    maxThickness: 1,
    maxWidth: 48,
  }
  var dim = lumberDimensions({
    ySize: 48, zSize: 60
  }, options)
  if (dim.thickness != 0.5 || dim.width != 48 || dim.length != 60) { th() }

  dim = lumberDimensions({
    xSize: 65, ySize: 1, zSize: 38
  }, options)
  if (dim.thickness != 1 || dim.width != 38 || dim.length != 65) { th() }

  function th() {
    throw new Error("lumberDimensions is not working")
  }
  /****************/



  function lumberDimensions(shape, options) {

    var xSize = Math.abs(shape.xSize || options.defaultThickness)
    var ySize = Math.abs(shape.ySize || options.defaultThickness)
    var zSize = Math.abs(shape.zSize || options.defaultThickness)

    var minDimension = Math.min(xSize, ySize, zSize)

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

    return {
      length: length,
      width: width,
      thickness: thickness
    }
  }


  function orderMaterials(plan) {

    for(var i=0; i<plan.generators.length; i++) {

      var generator = plan.generators[i]

      var params = plan.parameterSets[i]

      var args = materialPartsFor(generator, params).concat(params)

      generator.apply(null, args)

    }


    for(var description in materialSets) {
      var set = materialSets[description]

      var els = []
      var ct = 1
      for(var i=0; i<set.length; i++) {
        var item = set[i]

        if (item.description == "door") {
          els.push(element(" ("+ct+") "+item.parts[0]))
        } else {
          var cutPlan = element(
            " ("+ct+") "+cutPlanText(item)
          )
          els.push(cutPlan)
        }

        ct++
      }

      var material = BASE_MATERIALS[description]
      var count = els.length + (material.extra || 0)
      var price = material.price

      var subtotal = count * price
      grandSubtotal += subtotal

      var header = description+": "+els.length+" CT "
      if (material.extra) {
        header += "+"+material.extra+" "
      }
      header += "@$"+toDollarString(price)+" = $"+toDollarString(subtotal)


      addHtml(element(element.raw("<br/>")).html())
      addHtml(
        element(header).html()
      )
      addHtml(element(els).html())
    }


    for (var description in bulkMaterialSets) {

      var set = bulkMaterialSets[description]
      var material = BASE_MATERIALS[description]
      var totalQuantity = 0
      var els = []
      var ct = 1

      for(var i=0; i<set.length; i++) {
        var quantity = set[i].quantity
        var name = set[i].name

        totalQuantity = totalQuantity + quantity

        els.push(element(
          " ("+ct+") "+name+" ("+quantity+" "+material.unit+")"
        ))

        ct++
      }

      var subtotal = Math.ceil(totalQuantity * material.price)
      addHtml(element(element.raw("<br/>")).html())
      addHtml(
        element(description+": "+totalQuantity+" "+material.unit+" @$"+toDollarString(material.price)+" = $"+toDollarString(subtotal)).html()
      )
      addHtml(element(els).html())

    }

    var extras = [
      {name: "liquid nails", unit: " tubes", price: 250, quantity: 4},
      {name: "screws", unit: "lb", price: 650, quantity: 4},
      {name: "side flange", unit: "CT", price: 277, quantity: 8},
      {name: "4ft aluminum tube", unit: "x", price: 1350, quantity: 4},
      {name: "weatherproof inlet", unit: "x", price: 1800, quantity: 1},
      {name: "cord", unit: " roll", price: 500, quantity: 1},
      {name: "GFCI outlet", unit: "x", price: 2000, quantity: 2},
      {name: "wiring box", unit: "x", price: 500, quantity: 2},
      {name: "wire", unit: "100ft", price: 50, quantity: 1},
      {name: "concealed door hinge", unit: "x", price: 2000, quantity: 6},
      {name: "floor vent", unit: "x", price: 500, quantity: 2},
      {name: "lumber crayons", unit: "x", price: 100, quantity: 2},
    ]


    var els = []
    var extrasSubtotal = 0

    for(var i=0; i<extras.length; i++) {
      var extra = extras[i]

      var cost = extra.quantity * extra.price
      extrasSubtotal += cost

      els.push(element(
        extra.name+": "+extra.quantity+extra.unit+" @$"+toDollarString(extra.price)+" = $"+toDollarString(cost)
      ))
    }

    addHtml(element(element.raw("<br/>EXTRAS: $"+toDollarString(extrasSubtotal))).html())

    addHtml(element(els).html())

    var subtotal = grandSubtotal+extrasSubtotal
    var TAX_RATE = 0.095
    var salesTax = subtotal*TAX_RATE
    var total = subtotal + salesTax

    addHtml(
      "<br/>SUBTOTAL: $"+toDollarString(subtotal)+
      "<br/>TAX: $"+toDollarString(salesTax)+
      "<br/>GRAND TOTAL: $"+toDollarString(total)+"<br><br>"
    )


  }




  function cutPlanText(item) {
    var text = ""

    for(var i=0; i<item.parts.length; i++) {
      if (i > 0) {
        text = text + " PLUS "
      }
      var name = item.parts[i]
      if (name) {
        text = text + item.parts[i] + " ("+dimensionText(item.cutLengths[i])+" "+item.cut+")"
      } else {
        text = text + dimensionText(item.cutLengths[i])
      }
    }

    return text
  }

  function dimensionText(number) {
    var integer = Math.floor(number)
    var remainder = number - integer
    var sixteenths = Math.round(remainder*16)

    if (sixteenths == 16) {
      integer++
      var text = ""
    } else if (sixteenths == 0) {
      var text = ""
    } else if (sixteenths == 8) {
      var text = " 1/2"
    } else if (sixteenths % 4 == 0) {
      var text = " "+(sixteenths/4)+"/4"
    } else if (sixteenths % 2 == 0) {
      var text = " "+(sixteenths/2)+"/8"
    } else {
      var text = " "+sixteenths+"/16"
    }

    text = integer.toString()+"\""+text

    return text
  }

  function toDollarString(cents) {

    cents = Math.ceil(cents)

    var dollars = Math.floor(cents / 100)
    var remainder = cents - dollars*100
    if (remainder < 10) {
      remainder = "0"+remainder
    }

    return dollars+"."+remainder
  }

  function materialPartsFor(generator) {
    var names = argNames(generator)

    var args = []
    names.forEach(function(name) {
      var helper = materialParts[name]
      if (helper) { args.push(helper) }
    })

    return args
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
  return orderMaterials
})()