var library = require("module-library")(require)


module.exports = library.export(
  "render-house-plan",
  ["house-plan", "web-element"],
  function(HousePlan, element) {

    var verticalSlice = HousePlan.helpers.verticalSlice
    var slopeToDegrees = HousePlan.helpers.slopeToDegrees
    var slopeToRadians = HousePlan.helpers.slopeToRadians

    function renderHousePlan(bridge, plan, options) {

      var viewer = new Viewer(options)

      var page = [
        element("a.breadcrumb.button", "⇦", moveBy(-1,0)),
        element("a.breadcrumb.button", "⬆", moveBy(0,-1)),
        element("a.breadcrumb.button", "⬇", moveBy(0,1)),
        element("a.breadcrumb.button", "⇨", moveBy(1,0)),
        element("a.breadcrumb.button", "+", zoomBy(1), element.style({"font-size": "1.5em"})),
        element("a.breadcrumb.button", "-", zoomBy(-1), element.style({"font-size": "2em", "vertical-align": "-0.1em"})),
        element("a.breadcrumb", {href: "/house-plan/side"}, "Side"),
        element("a.breadcrumb", {href: "/house-plan/top"}, "Top"),
        element("a.breadcrumb", {href: "/house-plan/front"}, "Front"),
        viewer.render(plan),
      ]

      return page
    }

    var zoom = 0.4
    var left
    var top
    var view

    function moveBy(x,y) {
      return {
        href: "/house-plan/"+view+"?zoom="+zoom.toFixed(1)+"&top="+(top+y*10)+"&left="+(left+x*10)
      }
    }

    function zoomBy(depth) {
      var newZoom = zoom+depth*0.3

      if (depth < 0) {
        depth = 0
      }

      return {
        href: "/house-plan/"+view+"?zoom="+(newZoom).toFixed(1)+"&top="+top+"&left="+left
      }
    }

    function Viewer(options) {
      zoom = this.zoom = typeof options.zoom == "string" ? parseFloat(options.zoom) : 0.4
      left = this.left = typeof options.left == "string" ? parseFloat(options.left) : 36
      top = this.top = typeof options.top == "string" ? parseFloat(options.top) : 0
      view = this.view = options.view
      focus = options.sectionName
    }

    Viewer.prototype.render = function(plan) {

      var styles = {}
      if (this.zoom) {

        var zoomString = (this.zoom*39/40).toFixed(1)

        styles["font-size"] = zoomString+"em"
      }
      if (this.left) {
        styles["left"] = this.left.toString()+"em"
      }
      if (this.top) {
        styles["top"] = this.top.toString()+"em"
      }

      var el = element(".plan", element.style(styles))

      var viewOptions = {
        view: this.view,
        zDepth: 65,
      }

      plan.generate(getPartGenerator.bind(null, el, viewOptions))

      el.addChild(
        element.stylesheet(
          breadcrumb,
          breadcrumbHover,
          button,
          planTemplate,
          stud,
          plywood,
          section,
          sectionBefore,
          sectionAfter,
          trim,
          shade,
          slopeWrapper,
          twinWall,
          insulation,
          flooring
        )
      )

      return el
    }

    function getPartGenerator(planElement, viewOptions, name) {

      if (name == "section") {

        return section.bind(null, planElement, viewOptions)

      } else {

        var generator = drawableParts[name]

        if (!generator) { return }

        return generator.bind(null, viewOptions)
      }
    }


    function joinObjects(iterable) {
      var joined = {}

      for(var i=0; i<iterable.length; i++) {
        for(var key in iterable[i]) {
          joined[key] = iterable[i][key]
        }
      }

      return joined
    }

    var breadcrumb = element.style(".breadcrumb", {
      "font-family": "sans-serif",
      "font-size": "1.2em",
      "display": "inline-block",
      "padding": "20px",
      "color": "#99d",
    })

    var breadcrumbHover = element.style(".breadcrumb:hover", {
      "background-color": "#f0f0ff",
    })

    var button = element.style(".button", {
      "text-decoration": "none",
    })

    var stud = element.template(
      ".stud",
      element.style({
        "box-sizing": "border-box",
        "border-color": "#999",
        "border-style": "solid",
        "border-radius": "0.2em",
        "position": "absolute"
      }),
      function(viewOptions) {
        var options = joinObjects(arguments, 1)

        if (options.name == "door-section-stud-A") {
          debugger
        }

        addPart(this, options)

        var size = "0.4em"
        var thin = "0.2em"

        this.borderBottom = thin+" solid #999"

        var o = options.orientation

        if (!o) {
          throw new Error("Every part needs an orientation: north, south, east, west, horizontal-north, horizontal-south, horizontal-east, horizontal-west, up, down, up-across, or down-across")
        }

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
        var v = viewOptions.view

        if (v == "top" && o=="north" || v == "side" && o=="up-across" && options.xSize || v == "front" && o=="up"
        ) {

          // U-shape
          this.appendStyles({
            "border-width": [0, size, size, size].join(" "),
            "width": stud.DEPTH+"em",
            "height": stud.WIDTH+"em"
          })

        } else if (v == "top" && o=="south" || v =="side" && o=="down-across" || v == "front" && o=="down"
        ) {

          // n-shape
          this.appendStyles({
            "border-width": [size, size, 0, size].join(" "),
            "width": stud.DEPTH+"em",
            "height": stud.WIDTH+"em"
          })

        } else if (v == "top" && o=="east" || v == "side" && o=="horizontal-south" || v == "front" && o=="horizontal-east"
        ) {

          // C-shape
          this.appendStyles({
            "border-width": [size, 0, size, size].join(" "),
            "width": stud.WIDTH+"em",
            "height": stud.DEPTH+"em"
          })

        } else if (v == "top" && o=="west" || v == "side" && o=="horizontal-north" || v == "front" && o=="horizontal-west"
        ) {

          // ɔ-shape
          this.appendStyles({
            "border-width": [size, size, size, 0].join(" "),
            "width": stud.WIDTH+"em",
            "height": stud.DEPTH+"em"
          })

        } else if (v == "top" && flat && options.xSize || v == "side" && horizontal && eastWest || v == "front" && horizontal && northSouth) { 

          // tall horizontal
          this.appendStyles({
            "border-width": thin,
            "height": stud.DEPTH+"em"
          })

        } else if (v == "top" && horizontal && northSouth || v == "side" && flat && !across || v == "front" && flat && across) {

          // short horizontal
          this.appendStyles({
            "border-width": thin,
            "height": stud.WIDTH+"em"
          })

        } else if (v == "top" && flat && !across || v == "side" && vertical && eastWest || v == "front" && vertical && northSouth) {

          // wide vertical
          this.appendStyles({
            "border-width": thin,
            "width": stud.DEPTH+"em"
          })

        } else if (v == "top" && horizontal && eastWest || v == "side" && vertical && northSouth || v == "front" && vertical && eastWest) {

          // narrow vertical
          this.appendStyles({
            "border-width": thin,
            "width": stud.WIDTH+"em"
          })

        }

        addStylesFromOptions(options, this, viewOptions)

      }
    )

    function addStylesFromOptions(options, el, viewOptions) {

      if (!el) {
        throw new Error("You wanted to add some styles from an options hash but you didn't pass an element: "+JSON.stringify(options))
      }
      var styles = {}
      var isSome = false

      // ;["x", "y", "z"].forEach(function(dim) {
      //   var size = options[dim+"Size"]
      //   var pos = options[dim+"Pos"]

      //   if (typeof size != "undefined" && size < 0 && typeof pos == "undefined") {
      //     console.log("zeroing", options.name)
      //     options[dim+"Pos"] = 0
      //   }
      // })

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

      ;["top", "bottom", "left", "right", "height", "width", "xPos", "yPos", "zPos", "xSize", "ySize", "zSize"].forEach(handleAttribute)

      function handleAttribute(attribute) {

        var value = options[attribute]
        
        if (Number.isNaN(value)) {
          console.log("offending options:", options)
          throw new Error("option "+attribute+" is not a number")
        }
        var view = viewOptions.view

        if (!view) {
          throw new Error("what view is this?")
        }

        if (typeof value != "undefined") {

          var screenAttr = toScreenAttribute(attribute, view)

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

          var attributeToSet = screenAttr || attribute

          styles[screenAttr || attribute] = value+"em"
          el[attributeToSet] = value
          isSome = true

        }
      }

      if (isSome) {
        el.appendStyles(styles)
      }

    }

    function toScreenAttribute(attribute, view) {
      if (attribute == "zPos") {
        return {
          side: "left",
          top: "top",
          front: "__ignore"
        }[view]
      } else if (attribute == "xPos") {
        return {
          top: "left",
          side: "__ignore",
          front: "left"
        }[view]
      } else if (attribute == "yPos") {
        return {
          side: "top",
          top: "__ignore",
          front: "top"
        }[view]
      } else if (attribute == "xSize") {
        return {
          top: "width",
          side: "__ignore",
          front: "width"
        }[view]
      } else if (attribute == "ySize") {
        return {
          top: "__ignore",
          side: "height",
          front: "height"
        }[view]
      } else if (attribute == "zSize") {
        return {
          top: "height",
          side: "width",
          front: "__ignore"
        }[view]
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
        "position": "absolute",
      }),
      function(viewOptions) {
        var options = joinObjects(arguments, 1)

        var size = "0.2em"

        var o = options.orientation
        var dashStyle = options.sanded ? " dashed purple" : " dashed red"

        if (!o) {
          throw new Error("plywood needs an orientation")
        }

        var v = options.view
        
        if (v == "top" && o=="west" || v == "side" && o=="north" || v == "front" && o=="west"
        ) {

          this.appendStyles({
            "border-left": size+" solid #863",
            "border-right": size+dashStyle
          })

        } else if (v == "top" && o=="east" || v == "side" && o=="south" || v == "front" && o=="east") {

          this.appendStyles({
            "border-right": size+" solid #863",
            "border-left": size+dashStyle
          })

        } else if (v == "top" && o=="north" || v == "side" && o=="up" || v == "front" && o=="up") {

            this.appendStyles({
              "border-top": size+" solid #863",
              "border-bottom": size+dashStyle
            })

        } else if (v == "top" && o=="south" || v == "side" && o=="down" || v == "front" && o=="down") {

            this.appendStyles({
              "border-bottom": size+" solid #863",
              "border-top": size+dashStyle
            })

        } else {

          this.borderBottom = size+" solid black"
          this.appendStyles({
            "border": size+" solid black"
          })

        }

        addPart(this, options)

        addStylesFromOptions(options, this, viewOptions)
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
      function(viewOptions) {
        var options = joinObjects(arguments, 1)

        this.borderBottom = "0.2em solid #ec4"

        var height = options.height
        var v = viewOptions.view
        if(v == "top" && options.zSize) {
          height = options.zSize
        } else if (v == "side" && options.ySize) {
          height = options.ySize
        } else if (v == "front" && options.ySize) {
          height = options.ySize
        }

        var width = options.width

        if (v == "top" && options.xSize) {
          width = options.xSize
        } else if (v == "side" && options.zSize) {
          width = options.zSize
        } else if (v == "front" && options.xSize) {
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

        addPart(this, options)

        if (options.border) {
          this.appendStyles({border: options.border})
        }

        addStylesFromOptions(options, this, viewOptions)
      }
    )
    trim.THICKNESS = 0.75



    var shade = element.template(
      ".shade",
      element.style({
        "box-sizing": "border-box",
        "border": "0.2em dotted #bcc",
        "position": "absolute"
      }),
      function(viewOptions) {
        var options = joinObjects(arguments, 1)

        addPart(this, options)

        addStylesFromOptions(options, this, viewOptions)
      }
    )



    function sloped(viewOptions) {
      var options = joinObjects(arguments, 1)
      var view = viewOptions.view
      var generator = options.part
      delete options.part

      if (view == "top") {
        return generator.call(null, options)
      } else if (view == "front") {
        var sectionZ = options.section && options.section.origin.zPos
        if (typeof sectionZ == "undefined") {
          console.log("options", options)
          throw new Error("can't slope "+options.name+" unless you give section "+(options.section && options.section.name)+" a zPos")
        }

        var originZ = sectionZ + (options.zPos || 0)

        var depth = Math.abs(options.zSize)

        var zDepth = options.zDepth

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


      if (typeof options.slope != "number") {
        throw new Error("You need to pass a slope option when you create a sloped piece.")
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


      var innerEl = generator.call(null, viewOptions, innerOptions)

      var wrapped = slopeWrapper(innerEl, wrapperOptions, viewOptions)

      addPart(wrapped, options)

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
      function(el, options, viewOptions) {

        var angle = slopeToDegrees(options.slope)

        if (!el.width) {
          throw new Error("Can't slope an element without a width "+JSON.stringify(el))
        }

        var dh = el.width*options.slope

        el.appendStyles({
          "transform": "skewY(-"+angle+"deg)",
          "margin-top": dh/2+"em"
        })

        this.appendStyles({
          "height": el.height+"em",
          "width": el.width+"em",
          "border-bottom": el.borderBottom
        })

        this.addChild(el)

        addStylesFromOptions(options, this, viewOptions)
      }
    )



    function tilted(viewOptions) {
      var options = joinObjects(arguments)

      var generator = options.part
      delete options.part

      var view = viewOptions.view
      if (view == "top") {
        return generator.call(null, options)
      } else if (view == "front") {
        var originZ = options.zPos
        var depth = Math.abs(options.zSize)

        if (options.zSize < 0) {
          var minZ = originZ - depth
          var maxZ = originZ
        } else {
          var minZ = originZ
          var maxZ = originZ + depth
        }

        var zDepth = options.zDepth
        var zIntersect = zDepth - originZ
        var boost = zIntersect * options.tilt

        // section.origin.zPos + options.zPos + zTravel = zDepth

        var zTravel = zDepth - options.section.origin.zPos - options.zPos||0

        var newYPos = options.yPos - zTravel*options.tilt

        var newYSize = verticalSlice(options.ySize, options.tilt)

        if (maxZ < zDepth || minZ > zDepth) {
          return
        }

        var newOptions = merge(options, {
          yPos: newYPos,
          ySize: newYSize,
        })

        return generator.call(null, viewOptions, newOptions)
      }

      if (typeof options.ySize == "undefined") {
        throw new Error("tilted parts need to specify a ySize")
      }
      if (typeof options.zPos == "undefined") {
        throw new Error("tilted parts need to specify a zPos")
      }
      var height = verticalSlice(options.ySize, options.tilt)


      var drop = options.tilt*options.zPos

      var yPos = options.yPos - drop
      
      var radians = slopeToRadians(options.tilt)

      // cos(angle) = floorWidth/ceilingWidth

      // floorWidth = ceilingWidth*cos(angle)

      options.ySize = height
      options.yPos = yPos

      var el = generator.call(null, options)

      el.appendStyles({
        "transform-origin": options.zPos+"em 0",
        "transform": "skewY(-"+slopeToDegrees(options.tilt)+"deg)",
      })

    }



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
        "position": "absolute",
        "box-sizing": "border-box",
        "border": "0.2em solid rgba(0,0,255,0.4)"
      }),
      function(viewOptions) {
        var options = joinObjects(arguments, 1)

        addPart(this, options)

        addStylesFromOptions(options, this, viewOptions)
      }
    )


    var flooring = element.template(
      ".flooring",
      element.style({
        "position": "absolute",
        "box-sizing": "border-box",
        "border": "0.2em solid #fa4"
      }),
      function(viewOptions) {
        var options = joinObjects(arguments, 1)

        addPart(this, options)

        addStylesFromOptions(options, this, viewOptions)
      }
    )



    var insulation = element.template(
      ".insulation",
      element.style({
        "display": "none",
        "background-color": "rgba(255,0,0,0.1)",
        "background-size": "1em",
        "position": "absolute",
        "box-sizing": "border-box",
        "border": "0.5em dotted rgba(255,255,255,0.8)",
        "z-index": "-100",
      }),
      function(viewOptions) {
        var options = joinObjects(arguments, 1)

        addPart(this, options)

        addStylesFromOptions(options, this, viewOptions)
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
      function(planElement, viewOptions) {
        var options = joinObjects(arguments, 1)

        if (options.name) {
          this.attributes["data-name"] = this.name = options.name
        }
        if (options.rotate) {
          this.appendStyles({
            "transform": "rotate("+options.rotate+"deg)"
          })
        }

        var filtered = pick(options, "xPos", "yPos", "zPos")
        addStylesFromOptions(filtered, this, viewOptions)

        this.origin = options

        if (planElement && (!focus || this.name == focus)) {
          planElement.addChild(this)
        } else {
          console.log(options.name)
        }
      }
    )

    var focus

    var drawableParts = {
      section: section,
      stud: stud,
      plywood: plywood,
      section: section,
      trim: trim,
      shade: shade,
      twinWall: twinWall,
      insulation: insulation,
      flooring: flooring,
      tilted: tilted,
      sloped: sloped,
      batten: noop,
    }

    function noop() {}

    var sectionBefore = element.style(
      ".section::before",
      {
        "z-index": "10",
        content: "\\00a0",
        background: "cyan",
        width: "1px",
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
        height: "1px",
        position: "absolute",
        left: "-5em"
      }
    )

    var planTemplate = element.template(
      ".plan",
      element.style({
        "z-index": "-1",
        "position": "relative",
        "min-width": "120em",
        "min-height": "120em",
        "margin": "0",
        "font-size": "0.39em",
      })
    )

    function addPart(el, options) {
      if (!el.html) {
        throw new Error("trying to add part to section, but it's not an element")
      }

      if (!options.section) {
        throw new Error("Every house plan parts needs a section:\n\nfunction(stud, section) {\n  var floor = section({name: \"floor\"})\n  stud({section: floor})\n}\n")
      }

      options.section.addChild(el)
    }

    function pick(object) {
      var keys = Array.prototype.slice.call(arguments, 1)
      var light = {}
      keys.forEach(function(key) {
        light[key] = object[key]
      })
      return light
    }

    return renderHousePlan

  }
)
