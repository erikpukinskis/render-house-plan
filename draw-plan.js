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

      switch(options.orientation) {
        case "north":
        default:
          this.appendStyles({
            "border-width": [0, size, size, size].join(" "),
            "width": stud.DEPTH+"em",
            "height": stud.WIDTH+"em"
          })
          break
        case "south":
          this.appendStyles({
            "border-width": [size, size, 0, size].join(" "),
            "width": stud.DEPTH+"em",
            "height": stud.WIDTH+"em"
          })
          break
        case "east":
          this.appendStyles({
            "border-width": [size, 0, size, size].join(" "),
            "width": stud.WIDTH+"em",
            "height": stud.DEPTH+"em"
          })
          break
        case "west":
          this.appendStyles({
            "border-width": [size, size, size, 0].join(" "),
            "width": stud.WIDTH+"em",
            "height": stud.DEPTH+"em"
          })
          break
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

    ;["top", "bottom", "left", "right", "height", "width"].forEach(
      function(attribute) {
        var value = options[attribute]

        if (typeof value != "undefined") {
          el[attribute] = value
          styles[attribute] = value+"em"
          isSome = true
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

      switch (options.orientation) {
        case "west":
          this.appendStyles({
            "border-left": size+" solid #863",
            "border-right": size+" dashed red"
          })
          break
        case "east":
          this.appendStyles({
            "border-right": size+" solid #863",
            "border-left": size+" dashed red"
          })
          break
        case "north":
          this.appendStyles({
            "border-top": size+" solid #863",
            "border-bottom": size+" dashed red"
          })
          break
        case "south":
          this.appendStyles({
            "border-bottom": size+" solid #863",
            "border-top": size+" dashed red"
          })
          break
        case "in":
          this.borderBottom = size+" solid black"
          this.appendStyles({
            "border": size+" solid black"
          })
          break

      }
      if (options.section) {
        options.section.children.push(this)
      }

      if (options.rotate == 90) {
        this.appendStyles({
          "width": options.length+"em"
        })
      } else if (options.length) {
        this.appendStyles({
          "height": options.length+"em"
        })
      }

      if (options.left) {
        this.appendStyles({
          "left": options.left+"em"
        })
      }
      if (options.top) {
        this.appendStyles({
          "top": options.top+"em"
        })
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
      if (options.height) {
        this.appendStyles({
          "width": trim.THICKNESS+"em"
        })
      } else {
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

    if (!options.slope) {
      throw new Error("You need to pass a slope option when you create a sloped piece. You passed options "+JSON.stringify(options))
    }

    var wrapperOptions = {}
    var innerOptions = {}

    for(var key in options) {
      switch(key) {
        case "part":
          var generator = options[key]
          break
        case "left":
        case "right":
        case "top":
        case "bottom":
        case "slope":
          wrapperOptions[key] = options[key]
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

      var angle = drawPlan.slopeToDegrees(options.slope)

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




  var frontStud = element.template(
    ".front-stud-inner",
    element.style({
      "border": "1px solid #999",
      "box-sizing": "border-box",
      "position": "absolute"
    }),
    function(options) {
      if (options.section) {
        options.section.children.push(this)
      }

      if (options.height) {
        this.appendStyles({
          "width": stud.WIDTH+"em"
        })
      }

      if (options.width) {
        this.appendStyles({
          "height": stud.WIDTH+"em"
        })
      }

      this.borderBottom = "1px solid #999"

      drawPlan.addStylesFromOptions(options, this)
    } 
  )




  function tilted(options) {

    var height = verticalSlice(options.height, options.slope)

    var drop = options.slope*options.left

    if (options.normal) {
      var top = -height - drop + stockThicknessToEdgeHeight(options.normal, options.slope)
    } else {
      var top = options.top - drop
    }

    var radians = drawPlan.slopeToRadians(options.slope)

    // cos(angle) = floorWidth/ceilingWidth

    // floorWidth = ceilingWidth*cos(angle)

    if (options.length) {
      options.width = options.length*Math.cos(radians)
    }

    options.height = height
    options.top = top

    var generator = options.part
    delete options.part

    var el = generator.call(null, options)

    el.appendStyles({
      "transform-origin": "0% 0%",
      "transform": "skewY(-"+drawPlan.slopeToDegrees(options.slope)+"deg)",
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
    frontStud,
    slopeWrapper,
    twinWall,
    twinWallSide
  ).html())

  var parts = {
    section: section,
    stud: stud,
    plywood: plywood,
    section: section,
    door: door,
    trim: trim,
    frontStud: frontStud,
    sloped: sloped,
    twinWall: twinWall,
    twinWallSide: twinWallSide,
    tilted: tilted
  }

  function drawPlan(generator) {
    sections = []

    var args = argsFor(generator)

    generator.apply(null, args)

    sections.forEach(
      function(houseSection) {
        addHtml(houseSection.html())
      }
    )
  }

  function argsFor(generator) {
    var names = argNames(generator)

    var args = names.map(toPart)

    function toPart(partName) {
      return parts[partName]
    }

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

  function verticalSlice(thickness, slope) {
    // cos(angle) = adjacent/hypotenuse

    // cos(angle) = thickness/slice

    // slice = thickness/cos(angle)

    var angle = drawPlan.slopeToRadians(slope)

    return thickness/Math.cos(angle)
  }


  drawPlan.addStylesFromOptions = addStylesFromOptions

  drawPlan.parts = parts

  drawPlan.slopeToDegrees = function(slope) {
    var degrees = 180*drawPlan.slopeToRadians(slope)/Math.PI
    // console.log(degrees)
    return degrees
  }

  drawPlan.slopeToRadians = function(slope) {

    // tan(angle) = opposite/adjacent

    // tan(angle) = slope

    // angle = atan(slope)

    return Math.atan(slope)
  }

  drawPlan.verticalSlice = verticalSlice

  return drawPlan
})()
