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

  var section = element.template(
    ".section",
    element.style({
      "position": "absolute",
      "width": "0",
      "height": "0"
    }),
    function(options) {

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
      content: "\\00a0",
      background: "cyan",
      width: "1px",
      height: "20px",
      position: "absolute",
      top: "-10px"
    }
  )

  var sectionAfter = element.style(
    ".section::after", 
    {
      content: "\\00a0",
      background: "cyan",
      width: "20px",
      height: "0.5px",
      position: "absolute",
      left: "-10px"
    }
  )

  var sections

  var body = element.template(
    "body",
    element.style({
      "position": "relative",
      "left": "5em",
      "top": "10em",
      "width": "0",
      "height": "0",
      "font-size": "0.4em",
      "margin": "0"
    })
  )

  addHtml(element.stylesheet(
    body,
    stud,
    plywood,
    section,
    sectionBefore,
    sectionAfter
  ).html())


  function drawPlan(generator) {
    sections = []
    generator(stud, plywood, section)
    sections.forEach(
      function(houseSection) {
        addHtml(houseSection.html())
      }
    )
  }

  drawPlan.addStylesFromOptions = addStylesFromOptions

  return drawPlan
})()
