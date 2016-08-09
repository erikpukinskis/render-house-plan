var drawPlan = (function() {
  var stud = element.template(
    ".stud",
    element.style({
      "box-sizing": "border-box",
      "border-color": "#999",
      "border-style": "solid",
      "border-radius": "0.2em",
      "position": "absolute"
    }),
    function(options) {
      if (options.section) {
        options.section.children.push(this)
      }

      var size = "0.4em"
      var thin = "0.2em"

      this.borderBottom = thin+" solid #999"

      var o = options.orientation

      var horizontal = false
      var vertical = false
      var flat = false
      var northSouth = false
      var eastWest = false

      var parts = o.split("-")

      if (parts[0] == "horizontal") {

        horizontal = true
        northSouth = parts[1] == "north" || parts[1] == "south"
        eastWest = !northSouth

      } else if (parts[0] == "down" || parts[0] == "up") {

        var flat = true

      } else {
        vertical = true
        northSouth = parts[0] == "north" || parts[0] == "south"
        eastWest = !northSouth
      }

      if (topView && o=="north" || sideView && o=="up" || frontView && o=="up"
      ) {

        // U-shape
        this.appendStyles({
          "border-width": [0, size, size, size].join(" "),
          "width": stud.DEPTH+"em",
          "height": stud.WIDTH+"em"
        })

      } else if (topView && o=="south" || sideView && o=="down" || frontView && o=="down"
      ) {

        // n-shape
        this.appendStyles({
          "border-width": [size, size, 0, size].join(" "),
          "width": stud.DEPTH+"em",
          "height": stud.WIDTH+"em"
        })

      } else if (topView && o=="east" || sideView && o=="horizontal-south" || frontView && o=="horizontal-east"
      ) {

        // C-shape
        this.appendStyles({
          "border-width": [size, 0, size, size].join(" "),
          "width": stud.WIDTH+"em",
          "height": stud.DEPTH+"em"
        })

      } else if (topView && o=="west" || sideView && o=="horizontal-north" || frontView && o=="horizontal-west"
      ) {

        // ɔ-shape
        this.appendStyles({
          "border-width": [size, size, size, 0].join(" "),
          "width": stud.WIDTH+"em",
          "height": stud.DEPTH+"em"
        })

      } else if (topView && flat && options.xSize || sideView && horizontal && eastWest || frontView && horizontal && northSouth) { 

        // tall horizontal
        this.appendStyles({
          "border-width": thin,
          "height": stud.DEPTH+"em"
        })

      } else if (topView && horizontal && northSouth || sideView && flat && options.zSize || frontView && flat && options.xSize) {

        // short horizontal
        this.appendStyles({
          "border-width": thin,
          "height": stud.WIDTH+"em"
        })

      } else if (topView && flat && options.zSize || sideView && vertical && eastWest || frontView && vertical && northSouth) {

        // wide vertical
        this.appendStyles({
          "border-width": thin,
          "width": stud.DEPTH+"em"
        })

      } else if (topView && horizontal && eastWest || sideView && vertical && northSouth || frontView && vertical && eastWest) {

        // narrow vertical
        this.appendStyles({
          "border-width": thin,
          "width": stud.WIDTH+"em"
        })

      }

      addStylesFromOptions(options, this)
    }
  )

  function addStylesFromOptions(options, el) {

    if (!el) {
      throw new Error("You wanted to add some styles from an options hash but you didn't pass an element: "+JSON.stringify(options))
    }
    var styles = {}
    var isSome = false

    ;["top", "bottom", "left", "right", "height", "width", "xPos", "yPos", "zPos", "xSize", "ySize", "zSize"].forEach(
      function(attribute) {
        var value = options[attribute]

        if (typeof value != "undefined") {

          if (attribute == "zPos") {
            attribute = {
              side: "left",
              top: "top",
              front: "__ignore"
            }[view]
          } else if (attribute == "xPos") {
            attribute = {
              top: "left",
              side: "__ignore",
              front: "left"
            }[view]
          } else if (attribute == "yPos") {
            attribute = {
              side: "top",
              top: "__ignore",
              front: "top"
            }[view]
          } else if (attribute == "xSize") {
            attribute = {
              top: "width",
              side: "__ignore",
              front: "width"
            }[view]
          } else if (attribute == "ySize") {
            attribute = {
              top: "__ignore",
              side: "height",
              front: "height"
            }[view]
            if (!attribute) { throw new Error }
          } else if (attribute == "zSize") {
            attribute = {
              top: "height",
              side: "width",
              front: "__ignore"
            }[view]
          }

          if (attribute != "__ignore") {
            el[attribute] = value
            styles[attribute] = value+"em"
            isSome = true
          }
        }
      }
    )

    if (isSome) {
      el.appendStyles(styles)
    }

  }

  stud.WIDTH = 1.25
  stud.DEPTH = 2.5

  var plywood = element.template(
    ".plywood",
    element.style({
      "box-sizing": "border-box",
      "position": "absolute"
    }),
    function(options) {

      var size = "0.2em"

      var o = options.orientation

      if (topView && o=="west" || sideView && o=="north" || frontView && o=="west"
      ) {

        this.appendStyles({
          "border-left": size+" solid #863",
          "border-right": size+" dashed red"
        })

      } else if (topView && o=="east" || sideView && o=="south" || frontView && o=="east") {

        this.appendStyles({
          "border-right": size+" solid #863",
          "border-left": size+" dashed red"
        })

      } else if (topView && o=="north" || sideView && o=="down" || frontView && o=="down") {

          this.appendStyles({
            "border-top": size+" solid #863",
            "border-bottom": size+" dashed red"
          })

      } else if (topView && o=="south" || sideView && o=="up" || frontView && o=="up") {

          this.appendStyles({
            "border-bottom": size+" solid #863",
            "border-top": size+" dashed red"
          })

      } else {

        this.borderBottom = size+" solid black"
        this.appendStyles({
          "border": size+" solid black"
        })

      }

      if (options.section) {
        options.section.children.push(this)
      }

      addStylesFromOptions(options, this)
    }
  )
  plywood.THICKNESS = 3/8
  plywood.cssProperties.width = plywood.THICKNESS+"em"
  plywood.cssProperties.height = plywood.THICKNESS+"em"



  var DOOR_WIDTH = 32


  var trim = element.template(
    ".trim",
    element.style({
      "box-sizing": "border-box",
      "border": "0.2em solid #ec4",
      "position": "absolute"
    }),
    function(options) {
      this.borderBottom = "0.2em solid #ec4"

      if (options.color) {
        this.appendStyles({
          "border-color": options.color
        })
      }

      var height = options.height

      if(topView && options.zSize) {
        height = options.zSize
      } else if (sideView && options.ySize) {
        height = options.ySize
      } else if (frontView && options.ySize) {
        height = options.ySize
      }

      var width = options.width

      if (topView && options.xSize) {
        width = options.xSize
      } else if (sideView && options.zSize) {
        width = options.zSize
      } else if (frontView && options.xSize) {
        width = options.xSize
      }

      if (height) {
        this.appendStyles({
          "width": trim.THICKNESS+"em"
        })
      } else if (width) {
        this.appendStyles({
          "height": trim.THICKNESS+"em"
        })
      }

      if (options.section) {
        options.section.children.push(this)
      }

      drawPlan.addStylesFromOptions(options, this)
    }
  )
  trim.THICKNESS = 0.75



  var door = element.template(
    ".door-container",
    element.style({
      "position": "absolute"
    }),
    function(options) {
      var swing = doorSwing()
      var box = doorBox(swing)

      if (options.orientation == "east") {
        box.appendStyles({
          "border-right": "0.4em solid black"
        })
      } else {
        box.appendStyles({
          "border-left": "0.4em solid black"
        })
        swing.appendStyles({
          "margin-left": (-DOOR_WIDTH-0.375)+"75em"
        })
      }

      this.children.push(box)

      if (options.section) {
        options.section.children.push(this)
      }

      drawPlan.addStylesFromOptions(options, this)
    }
  )
  door.WIDTH = DOOR_WIDTH

  var doorBox = element.template.container(
    ".door-box",
    element.style({
      "width": DOOR_WIDTH+"em",
      "height": DOOR_WIDTH+"em",
      "box-sizing": "border-box",
      "border-top": "1.5em solid black",
      "position": "absolute",
      "top": "-1.5em",
      "overflow": "hidden",
    })
  )

  var doorSwing = element.template(
    ".door-swing",
    element.style({
      "width": "200%",
      "height": "200%",
      "border": "0.4em solid black",
      "border-radius": (DOOR_WIDTH-1.5)+"em",
      "margin-top": (-DOOR_WIDTH+0.75)+"em"
    })
  )


  function sloped(options) {

    var generator = options.part
    delete options.part

    if (!sideView) {
      return generator.call(null, options)
    }

    if (!options.slope) {
      throw new Error("You need to pass a slope option when you create a sloped piece. You passed options "+JSON.stringify(options))
    }

    var wrapperOptions = {}
    var innerOptions = {}

    for(var key in options) {
      switch(key) {
        case "left":
        case "right":
        case "top":
        case "bottom":
        case "slope":
          wrapperOptions[key] = options[key]
          break
        case "zPos":
          if (sideView) {
            wrapperOptions.left = options.zPos
          } else {
            throw new Error("Can only slope in side view")
          }
          break
        case "yPos":
          if (sideView) {
            wrapperOptions.top = options.yPos
          } else {
            throw new Error("Can only slope in side view")
          }
          break
        case "section":
          var parentSection = options[key]
          break
        default:
          innerOptions[key] = options[key]
          break
      }
    }

    var innerEl = generator.call(null, innerOptions)

    var wrapped = slopeWrapper(innerEl, wrapperOptions)

    if (parentSection) {
      parentSection.children.push(wrapped)
    }

    return wrapped
  }

  var slopeWrapper = element.template(
    ".slope-wrapper",
    element.style({
      "width": stud.WIDTH+"em",
      "position": "absolute",
      "overflow": "hidden",
      "box-sizing": "border-box"
    }),
    function(el, options) {

      var angle = slopeToDegrees(options.slope)

      var dh = el.width*options.slope

      if (!el.width) {
        throw new Error("Can't slope an element without a width "+JSON.stringify(el))
      }

      el.appendStyles({
        "transform": "skewY(-"+angle+"deg)",
        "margin-top": dh/2+"em"
      })

      this.appendStyles({
        "height": el.height+"em",
        "width": el.width+"em",
        "border-bottom": el.borderBottom
      })

      this.children.push(el)

      drawPlan.addStylesFromOptions(options, this)
    }
  )



  function tilted(options) {
    var generator = options.part
    delete options.part

    if (!sideView) {
      return generator.call(null, options)
    }

    var height = verticalSlice(options.height, options.slope)

    var drop = options.slope*options.zPos

    var yPos = options.yPos - drop
    
    var radians = slopeToRadians(options.slope)

    // cos(angle) = floorWidth/ceilingWidth

    // floorWidth = ceilingWidth*cos(angle)

    if (options.length) {
      options.width = options.length*Math.cos(radians)
    }

    options.height = height
    options.yPos = yPos

    var el = generator.call(null, options)

    el.appendStyles({
      "transform-origin": "0% 0%",
      "transform": "skewY(-"+slopeToDegrees(options.slope)+"deg)",
    })

  }




  var twinWallSide = element.template(
    ".twin-wall-side",
    element.style({
      "position": "absolute",
      "border": "0.2em solid rgba(0,0,255,0.4)",
      "box-sizing": "border-box"
    }),
    function(options) {
      if (options.section) {
        options.section.children.push(this)
      }

      drawPlan.addStylesFromOptions(options, this)
    }
  )


  function stockThicknessToEdgeHeight(stockThickness, slope) {
      // x^2 + (x*SLOPE)^2 = stockHeight^2

      // ((1+SLOPE)*x)^2 = stockHeight^2

      // x = Math.sqrt(stockHeight^2)/(1+SLOPE)

      var height = Math.sqrt(
        Math.pow(stockThickness, 2)/
        (1+slope)
      ) 

      if (stockThickness < 0) {
        height = -height
      }

      return height
  }





  var twinWall = element.template(
    ".twin-wall",
    element.style({
      "background": "url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/230211/twin-wall.png)",
      "background-size": "1em",
      "position": "absolute",
      "box-sizing": "border-box",
      "border": "0.2em solid rgba(0,0,255,0.4)"
    }),
    function(options) {
      if (options.section) {
        options.section.children.push(this)
      }
      drawPlan.addStylesFromOptions(options, this)
    }
  )





  var section = element.template(
    ".section",
    element.style({
      "position": "absolute",
      "width": "0",
      "height": "0"
    }),
    function(options) {
      if (options.name) {
        this.attributes["data-name"] = options.name
      }
      if (options.rotate) {
        this.appendStyles({
          "transform": "rotate("+options.rotate+"deg)"
        })
      }

      addStylesFromOptions(options, this)

      sections.push(this)
    }
  )

  var sectionBefore = element.style(
    ".section::before",
    {
      "z-index": "10",
      content: "\\00a0",
      background: "cyan",
      width: "0.2em",
      height: "10em",
      position: "absolute",
      top: "-5em"
    }
  )

  var sectionAfter = element.style(
    ".section::after", 
    {
      "z-index": "10",
      content: "\\00a0",
      background: "cyan",
      width: "10em",
      height: "0.2em",
      position: "absolute",
      left: "-5em"
    }
  )


  function verticalSlice(thickness, slope) {
    // cos(angle) = adjacent/hypotenuse

    // cos(angle) = thickness/slice

    // slice = thickness/cos(angle)

    var angle = slopeToRadians(slope)

    return thickness/Math.cos(angle)
  }


  slopeToDegrees = function(slope) {
    var degrees = 180*slopeToRadians(slope)/Math.PI
    // console.log(degrees)
    return degrees
  }

  slopeToRadians = function(slope) {

    // tan(angle) = opposite/adjacent

    // tan(angle) = slope

    // angle = atan(slope)

    return Math.atan(slope)
  }






  // All of the parts and helpers:

  var parts = {
    section: section,
    stud: stud,
    plywood: plywood,
    section: section,
    door: door,
    trim: trim,
    sloped: sloped,
    twinWall: twinWall,
    twinWallSide: twinWallSide,
    tilted: tilted,
    slopeToRadians: slopeToRadians,
    slopeToDegrees: slopeToDegrees,
    verticalSlice: verticalSlice
  }







  var sections

  var body = element.template(
    "body",
    element.style({
      "position": "relative",
      "left": "10em",
      "top": "10em",
      "min-width": "120em",
      "min-height": "120em",
      "font-size": "0.39em",
      "margin": "0"
    })
  )

  addHtml(element.stylesheet(
    body,
    stud,
    plywood,
    section,
    sectionBefore,
    sectionAfter,
    trim,
    door,
    doorBox,
    doorSwing,
    slopeWrapper,
    twinWall,
    twinWallSide
  ).html())


  function drawPlan(generator) {
    sections = []

    var args = argsFor(generator)

    for(var i=1; i<arguments.length; i++) {
      args.push(arguments[i])
    }

    generator.apply(null, args)

    sections.forEach(
      function(houseSection) {
        addHtml(houseSection.html())
      }
    )
  }

  function argsFor(generator) {
    var names = argNames(generator)

    var args = []
    names.forEach(function(name) {
      var helper = parts[name]
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

  var sideView
  var frontView
  var topView
  var view

  drawPlan.setView = function(newView) {
    view = newView
    sideView = frontView = topView = false
    if (view == "side") {
      sideView = true
    } else if (view == "front") {
      frontView = true
    } else if (view == "top") {
      topView = true
    } else {
      throw new Error(view+" is not a valid view")
    }
  }

  drawPlan.addStylesFromOptions = addStylesFromOptions

  drawPlan.parts = parts

  return drawPlan
})()
