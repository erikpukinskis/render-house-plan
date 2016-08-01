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

    var styles = {}
    var isSome = false

    ;["top", "bottom", "left", "right", "height", "width"].forEach(
      function(attribute) {
        var value = options[attribute]

        if (typeof value != "undefined") {
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
      this.height = options.height
      this.width = options.width

      var size = "0.2em"

      switch (options.orientation) {
        case "west":
          this.appendStyles({
            "border-left": size+" solid black",
            "border-right": size+" dashed red"
          })
          break
        case "east":
          this.appendStyles({
            "border-right": size+" solid black",
            "border-left": size+" dashed red"
          })
          break
        case "north":
          this.appendStyles({
            "border-top": size+" solid black",
            "border-bottom": size+" dashed red"
          })
          break
        case "south":
          this.appendStyles({
            "border-bottom": size+" solid black",
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



  var slope = element.template(
    ".slope-wrapper",
    element.style({
      "width": stud.WIDTH+"em",
      "position": "absolute",
      "overflow": "hidden",
      "box-sizing": "border-box"
    }),
    function(el, options) {

      var angle = Math.atan(options.slope)/Math.PI*180

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

      this.children.push(el)

      drawPlan.addStylesFromOptions(options, this)
    }
  )




  var frontStud = element.template(
    ".front-stud-inner",
    element.style({
      "width": stud.WIDTH+"em",
      "border": "1px solid #999",
      "box-sizing": "border-box"
    }),
    function(options) {
      this.height = options.height
      this.width = options.width
      this.borderBottom = "1px solid #999"

      drawPlan.addStylesFromOptions(options, this)
    } 
  )




  var twinWall = element.template(
    ".twin-wall",
    element.style({
      "background": "url(twin-wall.png)",
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
      "left": "5em",
      "top": "10em",
      "width": "100em",
      "height": "120em",
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
    slope,
    twinWall
  ).html())

  var parts = {
    section: section,
    stud: stud,
    plywood: plywood,
    section: section,
    door: door,
    trim: trim,
    frontStud: frontStud,
    slope: slope,
    twinWall: twinWall
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

  drawPlan.addStylesFromOptions = addStylesFromOptions

  return drawPlan
})()
