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

      if (options.name == "left-side-bottom-plate") {
        // debugger
      }

      if (topView && o=="north" || sideView && o=="up" && options.xSize|| frontView && o=="up" && options.zSize
      ) {

        // U-shape
        this.appendStyles({
          "border-width": [0, size, size, size].join(" "),
          "width": stud.DEPTH+"em",
          "height": stud.WIDTH+"em"
        })

      } else if (topView && o=="south" || sideView && o=="down" || frontView && o=="down" && options.zSize
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

    if (options.color) {
      styles["border-color"] = options.color
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

  var zDepth = 0

  function setZDepth(d) {
    zDepth = d
  }

  function sloped(options) {

    var generator = options.part
    delete options.part

    if (topView || frontView) {
      return generator.call(null, options)
    }

    if (!options.slope) {
      throw new Error("You need to pass a slope option when you create a sloped piece. You passed options "+JSON.stringify(options))
    }

    var wrapperOptions = {
      slope: options.slope
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

      var zIntersect = zDepth - minZ
      var boost = zIntersect * options.slope

      if (maxZ < zDepth || minZ > zDepth) {
        return
      }

      var newOptions = merge(options, {
        yPos: options.yPos - boost
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
      "height": "0"
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
  var zoomFactor = 0.39

  var container = element.template(
    ".plan",
    element.style({
      "position": "relative",
      "left": "26em",
      "top": "10em",
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
    ".button",
    element.style({
      "display": "inline-block",
      "color": "white",
      "padding": "0px 6px",
      "background": "#1ef",
      "text-decoration": "none",
      "font-family": "sans-serif",
      "margin-right": "0.25em",
      "line-height": "2em",
      "margin-bottom": "0.25em"
    }),
    function(view) {
      this.children.push(view)
      this.attributes.href = "javascript: drawPlan.setView(\""+view+"\")"
    }
  ) 

  var zoomButton = element.template(
    ".zoom-button.button",
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
    ".reset-zoom-button.button",
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
    ".section-toggle.button",
    {
      "display": "block",
      "background": "#bbb"
    }
  )

  var sectionToggleOn = element.style(
    ".section-toggle.button.on",
    {"background": "#6f5"}
  )

  var controls = overlay([
    viewButton("side"),
    viewButton("front"),
    viewButton("top"),
    element(".zoom", [
      zoomButton(0.8, "-"),
      resetZoom(),
      zoomButton(1.2, "+")
    ]),
    element(".section-toggles")
  ])


  addHtml(
    element.stylesheet(
      container,
      stud,
      plywood,
      section,
      sectionBefore,
      sectionAfter,
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
      sectionToggleOn
    ).html()
  )

  addHtml(element(".plan").html())

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
  }

  function zoom(by) {
    if (by == "default") {
      zoomFactor = 0.39
    } else {
      zoomFactor = zoomFactor*by
    }
    document.querySelector(".plan").style["font-size"] = zoomFactor+"em"
  }

  drawPlan.addStylesFromOptions = addStylesFromOptions

  drawPlan.parts = parts

  drawPlan.toggleSection = toggleSection

  drawPlan.setView = setView

  drawPlan.setZDepth = setZDepth

  drawPlan.zoom = zoom

  return drawPlan
})()
