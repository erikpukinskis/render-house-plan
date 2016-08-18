var drawPlan = (function() {

  var PLAN_ORIGIN = {
    left: 36,
    top: 20
  }

  var resetZDepth = false

  if (resetZDepth || !localStorage.zDepth) {
    var zDepth = 72
  } else {
    var zDepth = parseFloat(localStorage.zDepth)
  }

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
        var across = parts[1] == "across"
        var flat = true

      } else {
        vertical = true
        northSouth = parts[0] == "north" || parts[0] == "south"
        eastWest = !northSouth
      }

      if (options.name == "header-stud-1") {
        // debugger
      }

      if (topView && o=="north" || sideView && o=="up-across" && options.xSize|| frontView && o=="up"
      ) {

        // U-shape
        this.appendStyles({
          "border-width": [0, size, size, size].join(" "),
          "width": stud.DEPTH+"em",
          "height": stud.WIDTH+"em"
        })

      } else if (topView && o=="south" || sideView && o=="down-across" || frontView && o=="down"
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

      } else if (topView && horizontal && northSouth || sideView && flat && !across || frontView && flat && across) {

        // short horizontal
        this.appendStyles({
          "border-width": thin,
          "height": stud.WIDTH+"em"
        })

      } else if (topView && flat && !across || sideView && vertical && eastWest || frontView && vertical && northSouth) {

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

    if (options.color) {
      styles["border-color"] = options.color
    }

    if (options.background) {
      styles["background"] = options.background
    }

    if (options["z-index"]) {
      styles["z-index"] = options["z-index"]
    }

    if (options.name) {
      el.attributes["data-name"] = options.name
    }

    ;["top", "bottom", "left", "right", "height", "width", "xPos", "yPos", "zPos", "xSize", "ySize", "zSize"].forEach(
      function(attribute) {
        var value = options[attribute]
        var screenAttr

        if (typeof value != "undefined") {

          if (attribute == "zPos") {
            screenAttr = {
              side: "left",
              top: "top",
              front: "__ignore"
            }[view]
          } else if (attribute == "xPos") {
            screenAttr = {
              top: "left",
              side: "__ignore",
              front: "left"
            }[view]
          } else if (attribute == "yPos") {

            screenAttr = {
              side: "top",
              top: "__ignore",
              front: "top"
            }[view]
          } else if (attribute == "xSize") {
            screenAttr = {
              top: "width",
              side: "__ignore",
              front: "width"
            }[view]
          } else if (attribute == "ySize") {
            screenAttr = {
              top: "__ignore",
              side: "height",
              front: "height"
            }[view]
          } else if (attribute == "zSize") {
            screenAttr = {
              top: "height",
              side: "width",
              front: "__ignore"
            }[view]
          }

          if (screenAttr == "__ignore") { return }

          var isPos = attribute.substr(1) == "Pos"

          var isSize = attribute.substr(1) == "Size"

          if (isPos) {
            var dimension = attribute[0]
            var sizeAttr = dimension+"Size"
            if (options[sizeAttr] < 0) {

              screenAttr = reverse(screenAttr)
              value = -value
            }
          }

          if (isSize) {
            value = Math.abs(value)
          }

          el[screenAttr || attribute] = value
          styles[screenAttr || attribute] = value+"em"
          isSome = true

        }
      }
    )

    if (isSome) {
      el.appendStyles(styles)
    }

  }

  function reverse(attr) {
    return {
      left: "right",
      top: "bottom"
    }[attr]
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

      } else if (topView && o=="north" || sideView && o=="up" || frontView && o=="up") {

          this.appendStyles({
            "border-top": size+" solid #863",
            "border-bottom": size+" dashed red"
          })

      } else if (topView && o=="south" || sideView && o=="down" || frontView && o=="down") {

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
  var DOOR_THICKNESS = 1.5

  var trim = element.template(
    ".trim",
    element.style({
      "box-sizing": "border-box",
      "border": "0.2em solid #ec4",
      "position": "absolute"
    }),
    function(options) {
      this.borderBottom = "0.2em solid #ec4"

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


  var topDoorContainer = element.template(
    ".top-door-container",
    element.style({
      "position": "absolute"
    }),
    function(options) {
      var swing = doorSwing()
      var box = doorBox(swing)

      if (options.orientation == "west") {
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
  door.THICKNESS = DOOR_THICKNESS
  door.HEIGHT = 80

  var doorBox = element.template.container(
    ".door-box",
    element.style({
      "width": DOOR_WIDTH+"em",
      "height": DOOR_WIDTH+"em",
      "box-sizing": "border-box",
      "border-top": door.THICKNESS+"em solid black",
      "position": "absolute",
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

  var basicDoor = element.template(
      ".door",
      element.style({
        "position": "absolute",
        "width": door.THICKNESS+"em",
        "height": door.THICKNESS+"em",
        "box-sizing": "border-box",
        "border": "0.4em solid black"
      }),
      function(options) {
        if (!options.ySize) {
          options.ySize = door.HEIGHT
        }

        if (options.section) {
          options.section.children.push(this)
        }

        addStylesFromOptions(options, this)
      }
    )

  var doorKnob = element.style(
    ".door::after", 
    {
      "z-index": "10",
      "content": "\\00a0",
      "width": "2em",
      "height": "2.5em",
      "box-sizing": "border-box",
      "border-radius": "1em",
      "border": "0.4em solid black",
      "background": "white",
      "position": "absolute",
      "left": "1.2em",
      "top": door.HEIGHT/2+"em"
    }
  )


  function door(options) {
    if (topView) {
      topDoorContainer(options)
    } else {
      basicDoor(options)
    }
  }

  function zDepthToLeft(depth) {
    return (zDepth + PLAN_ORIGIN.left)*zoomFactor - 0.5
  }

  function setZDepth(d) {
    if (d != zDepth) {
      localStorage.zDepth = d
    }

    zDepth = d

    var left = zDepthToLeft(d)

    document.querySelector(".depth-slider").style.left = left+"em"
  }

  function sloped(options) {

    var generator = options.part
    delete options.part

    if (topView) {
      return generator.call(null, options)
    } else if (frontView) {
      var sectionZ = options.section.origin.zPos
      if (typeof sectionZ == "undefined") {
        throw new Error("can't slope "+options.name+" unless you give section "+options.section.name+" a zPos")
      }

      var originZ = sectionZ + (options.zPos || 0)

      var depth = Math.abs(options.zSize)

      if (options.zSize < 0) {
        var minZ = originZ - depth
        var maxZ = originZ
      } else {
        var minZ = originZ
        var maxZ = originZ + depth
      }

      var zTravel = maxZ - zDepth

      var yPos = options.yPos || 0

      var yTravel = zTravel*options.slope

      var ySize = options.ySize
      var yDirection = ySize / Math.abs(ySize)

      var isPinnedAtBottom = yDirection < 0

      if (isPinnedAtBottom) {
        var newYPos = yPos
        var newYSize = ySize + yTravel
      } else {
        var newYPos = yPos + yTravel
        var newYSize = ySize - yTravel
      }

      if (maxZ < zDepth || minZ > zDepth) {
        return
      }

      var newOptions = merge(options, {
        yPos: newYPos,
        ySize: newYSize
      })

      return generator.call(null, newOptions)
    }


    if (!options.slope) {
      throw new Error("You need to pass a slope option when you create a sloped piece. You passed options "+JSON.stringify(options))
    }

    var wrapperOptions = {
      slope: options.slope,
    }

    if (options.name) {
      wrapperOptions.name = options.name
    }
    var parentSection = options.section

    var innerOptions = {}

    for(var key in options) {
      if (key == "section" || key == "slope") {
        continue
      }

      var isPos = key.substr(1) == "Pos"
      var isSize = key.substr(1) == "Size"

      if (isPos) {
        wrapperOptions[key] = options[key]
      } else if (isSize) {
        wrapperOptions[key] = innerOptions[key] = options[key]
      } else {
        innerOptions[key] = options[key]
      }        

    }

    var innerEl = generator.call(null, innerOptions)

    var wrapped = slopeWrapper(innerEl, wrapperOptions)

    if (parentSection) {
      parentSection.children.push(wrapped)
    }

    return wrapped
  }

  function merge(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
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

    if (topView) {
      return generator.call(null, options)
    } else if (frontView) {
      var originZ = options.zPos
      var depth = Math.abs(options.zSize)

      if (options.zSize < 0) {
        var minZ = originZ - depth
        var maxZ = originZ
      } else {
        var minZ = originZ
        var maxZ = originZ + depth
      }

      var zIntersect = zDepth - originZ
      var boost = zIntersect * options.slope

      var zPos = options.zPos || 0

      var zTravel = zDepth - options.section.origin.zPos

      var newYPos = options.yPos - zTravel*options.slope

      if (maxZ < zDepth || minZ > zDepth) {
        return
      }

      var newOptions = merge(options, {
        yPos: newYPos
      })

      return generator.call(null, newOptions)
    }

    if (options.name == "left-side-top-plate") {
      // debugger
    }
    if (typeof options.ySize == "undefined") {
      throw new Error("sloped parts need to specify a ySize")
    }
    if (typeof options.zPos == "undefined") {
      throw new Error("sloped parts need to specify a zPos")
    }
    var height = verticalSlice(options.ySize, options.slope)


    var drop = options.slope*options.zPos

    var yPos = options.yPos - drop
    
    var radians = slopeToRadians(options.slope)

    // cos(angle) = floorWidth/ceilingWidth

    // floorWidth = ceilingWidth*cos(angle)

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
      "background-color": "rgba(0,0,255,0.02)",
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
      "height": "0",
      "transition": "transform 100ms",
      "transition-timing-function": "linear",
    }),
    function(options) {
      if (options.name) {
        this.attributes["data-name"] = this.name = options.name
      }
      if (options.rotate) {
        this.appendStyles({
          "transform": "rotate("+options.rotate+"deg)"
        })
      }

      addStylesFromOptions(options, this)

      this.origin = options

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
    if (!slope) {
      throw new Error("verticalSlice takes a thickness and a slope. You didn't provide a slope")
    }
    // cos(angle) = adjacent/hypotenuse

    // cos(angle) = thickness/slice

    // slice = thickness/cos(angle)

    var angle = slopeToRadians(slope)

    return thickness/Math.cos(angle)
  }


  slopeToDegrees = function(slope) {
    var degrees = 180*slopeToRadians(slope)/Math.PI
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

  if (localStorage.zoomFactor) {
    var zoomFactor = parseFloat(localStorage.zoomFactor)
  } else {
    var zoomFactor = 0.39
  }

  var container = element.template(
    ".plan",
    element.style({
      "z-index": "10",
      "position": "relative",
      "left": PLAN_ORIGIN.left+"em",
      "top": PLAN_ORIGIN.top+"em",
      "min-width": "120em",
      "min-height": "120em",
      "font-size": zoomFactor+"em",
      "margin": "0"
    })
  )

  var overlay = element.template(
    ".overlay",
    element.style({
      "background": "white",
      "z-index": "100",
      "position": "fixed",
      "left": "0.25em",
      "top": "0.5em"
    }),
    function(children) {
      this.children = children
    }
  )

  var viewButton = element.template(
    "a.button",
    element.style({
      "display": "inline-block",
      "cursor": "pointer",
      "color": "white",
      "padding": "0px 6px",
      "background": "#1ef",
      "text-decoration": "none",
      "font-family": "sans-serif",
      "margin-right": "0.25em",
      "line-height": "2.5em",
      "margin-bottom": "0.25em"
    }),
    function(view) {
      this.children.push(view)
      this.attributes.href = "javascript: drawPlan.setView(\""+view+"\")"
    }
  ) 

  var zoomButton = element.template(
    "a.zoom-button.button",
    element.style({
      "padding-left": "1em",
      "padding-right": "1em"
    }),
    function(factor, label) {
      this.children.push(label)
      this.attributes.href = "javascript: drawPlan.zoom("+factor+")"
    }
  )

  var resetZoom = element.template(
    "a.reset-zoom-button.button",
    "zoom",
    element.style({
      "background": "white",
      "padding-left": "0.05em",
      "padding-right": "0.1em",
      "color": "#1ef"
    }),
    {
      href: "javascript: drawPlan.zoom(\"default\")"
    }
  )

  var sectionToggle = element.style(
    "a.section-toggle.button",
    {
      "display": "block",
      "background": "#bbb"
    }
  )

  var sectionToggleOn = element.style(
    ".section-toggle.button.on",
    {"background": "#6f5"}
  )


  var explodeButton = element.template(
    ".explode.button",
    element.style({
      "color": "white",
      "background": "black",
      "display": "block"
    }),
    {
      onclick: "drawPlan.explode()"
    },
    "disassemble"
  )


  var transforms = {
    "left-wall-short": [-10, -3],
    "doors": [0, 30],
    "header": [0, 10],
  }

  var exploded = false

  function explode() {

    for(name in transforms) {
      var d = exploded ? [0,0] : transforms[name]

      var el = document.querySelector("[data-name="+name+"]")

      if (!el) { continue }

      el.style.transform = "translateX("+d[0]+"em) translateY("+d[1]+"em)"

    }

    exploded = !exploded

  }

  var controls = overlay([
    viewButton("side"),
    viewButton("front"),
    viewButton("top"),
    element(".zoom", [
      zoomButton(0.8, "-"),
      resetZoom(),
      zoomButton(1.2, "+")
    ]),
    element(".section-toggles"),
    explodeButton()
  ])

  var depthSlider = element.template(
    ".depth-slider",
    element.style({
      "color": "white",
      "position": "absolute",
      "width": "2em",
      "line-height": "1.9em",
      "font-family": "sans-serif",
      "text-align": "center",
      "top": "0.4em",
      "height": "2em",
      "border-radius": "1em",
      "background": "rgba(255,0,0,0.1)",
      "-webkit-user-select": "none",
      "cursor": "pointer"
    }),
    { 
      ondragstart: "drawPlan.zDragStart(event)",
      ondrag: "drawPlan.dragZ(event)"
    },
    function() {
      this.appendStyles({
        left: zDepthToLeft(zDepth)+"em"
      })
    }
  )


  var startXPixels
  var startZDepth

  function dragZ(event) {
    if (event.screenX == 0) { return }
    var dx = event.screenX - startXPixels
    var newZDepth = startZDepth + dx / (16*zoomFactor)
    setZDepth(newZDepth)
  }

  function zDragStart(event) {
    startXPixels = event.screenX
    startZDepth = zDepth
  }

  var depthSliderBar = element.style(
    ".depth-slider::after",
    {
      "position": "absolute",
      "z-index": "0",
      "content": "\\00a0",
      "height": "50em",
      "left": "0.95em",
      "width": "0.1em",
      "top": "2em",
      "background": "rgba(255,0,0,0.1)" 
    }
  )

  addHtml(
    element.stylesheet(
      container,
      stud,
      plywood,
      section,
      // sectionBefore,
      // sectionAfter,
      trim,
      topDoorContainer,
      basicDoor,
      doorKnob,
      doorBox,
      doorSwing,
      slopeWrapper,
      twinWall,
      twinWallSide,
      overlay,
      viewButton,
      zoomButton,
      resetZoom,
      sectionToggle,
      sectionToggleOn,
      depthSlider,
      depthSliderBar,
      explodeButton
    ).html()
  )

  addHtml(element(".plan").html())

  addHtml(depthSlider().html())

  addHtml(controls.html())



  var generators = []

  function drawPlan(generator) {
    sections = []
 
    if (!view) { setView("top", false) }

    var args = argsFor(generator)

    for(var i=1; i<arguments.length; i++) {
      args.push(arguments[i])
    }

    var draw = Function.prototype.apply.bind(generator, null, args)

    draw()

    generators.push(draw)

    sections.forEach(addToPage)
  }

  function redraw() {
    emptyNode(container)
    sections = []
    generators.map(call)
    sections.forEach(addToPage)
    drawing = false
  }

  function addToPage(section) {
    var name = section.name
    ensureToggle(name)

    if (showSection[name] === false) { return }

    addHtml.inside(container, section.html())
  }

  drawPlan.clear = function() {
    generators = []
    emptyNode(container)
  }

  if (localStorage.showSection) {
    var showSection = JSON.parse(localStorage.showSection)
  } else {
    var showSection = {}
  }

  var toggles = document.querySelector(".section-toggles")

  var togglesAdded = {}

  function ensureToggle(name) {
    if (!name) { return }

    if (!togglesAdded[name]) {
      togglesAdded[name] = true

      var show = showSection[name] !== false
      showSection[name] = show

      var link = element("a.section-toggle.button", name, {
        href: "javascript: drawPlan.toggleSection(\""+name+"\")"
      })
      if (show) {
        link.classes.push("on")
      }
      link.classes.push("toggle-"+name)
      addHtml.inside(toggles, link.html())
    }
  }

  var drawing = false
  var container = document.querySelector(".plan")

  function toggleSection(name) {
    if (drawing) { return }

    var on = !showSection[name]

    showSection[name] = on
    localStorage.showSection = JSON.stringify(showSection)
    
    var toggle = document.querySelector(".toggle-"+name)

    if (on) {
      toggle.classList.add("on")
    } else {
      toggle.classList.remove("on")
    }

    emptyNode(container)

    if (drawing) { return }
    setTimeout(redraw, 0)
    drawing = true
  }

  function emptyNode(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild)
    }
  }

  function call(func) { func() }

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

  setView(localStorage.view)

  function setView(newView, draw) {
    if (!newView) { return }

    view = newView
    localStorage.view = newView
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

    if (draw !== false) { redraw() }

    document.querySelector(".depth-slider").style.display = sideView ? "block" : "none"
  }

  function zoom(by) {
    if (by == "default") {
      zoomFactor = 0.39
    } else {
      zoomFactor = zoomFactor*by
    }
    localStorage.zoomFactor = zoomFactor
    document.querySelector(".plan").style["font-size"] = zoomFactor+"em"
    setZDepth(zDepth)
  }

  drawPlan.addStylesFromOptions = addStylesFromOptions
  drawPlan.parts = parts
  drawPlan.toggleSection = toggleSection
  drawPlan.setView = setView
  drawPlan.setZDepth = setZDepth
  drawPlan.zoom = zoom
  drawPlan.dragZ = dragZ
  drawPlan.zDragStart = zDragStart
  drawPlan.explode = explode

  return drawPlan
})()
