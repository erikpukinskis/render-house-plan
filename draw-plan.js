var drawPlan = (function() {
  var stud = element.template(
    ".stud",
    element.style({
      "box-sizing": "border-box",
      "border": "0.4em solid gray",
      "border-top": "none",
      "border-radius": "0.2em",
      "position": "absolute"
    }),
    function(options) {
      if (options.section) {
        options.section.children.push(this)
      }

      switch(options.orientation) {
        case "south":
          this.appendStyles({
            "transform": "rotate(180deg)"
          })
          break;
        case "east":
          this.appendStyles({
            "transform": "rotate(90deg)",
            "transform-origin": (stud.WIDTH/2)+"em "+(stud.WIDTH/2)+"em"
          })
          break;
        case "west":
          this.appendStyles({
            "transform": "rotate(-90deg)",
            "transform-origin": (stud.WIDTH)+"em "+(stud.WIDTH)+"em"
          })
          break;
      }

      if (options.top) {
        this.appendStyles({
          "top": options.top+"em"
        })
      }
      if (options.left) {
        this.appendStyles({
          "left": options.left+"em"
        })
      }
    }
  )

  stud.WIDTH = 1.25
  stud.DEPTH = 2.5
  stud.cssProperties.width = stud.DEPTH+"em"
  stud.cssProperties.height = stud.WIDTH+"em"


  var plywood = element.template(
    ".plywood",
    element.style({
      "background": "#fdb",
      "box-sizing": "border-box",
      "border-color": "#da7",
      "border-style": "solid",
      "border-width": "0.2em 0.2em 0 0",
      "position": "absolute",
      "top": "0"
    }),
    function(options) {
      if (options.section) {
        options.section.children.push(this)
      }

      if (options.rotate == 90) {
        this.appendStyles({
          "width": options.length+"em"
        })
      } else {
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
    }
  )
  plywood.THICKNESS = 3/8
  plywood.cssProperties.width = plywood.THICKNESS+"em"
  plywood.cssProperties.height = plywood.THICKNESS+"em"

  var section = element.template(
    ".section",
    element.style({
      "position": "relative",
      "transform-origin": "50% 50% 0"
    }),
    function(options) {
      this.appendStyles({
        "left": (options.left)+"em",
        "top": (options.top)+"em"
      })

      if (options.rotate) {
        this.appendStyles({
          "transform": "rotate("+options.rotate+"deg)"
        })
      }

      sections.push(this)
    }
  )

  var sections

  var body = element.template(
    "body",
    element.style({
      "position": "relative",
      "left": "5em",
      "top": "10em",
      "font-size": "0.4em"
    })
  )

  addHtml(element.stylesheet(
    body,
    stud,
    plywood,
    section
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

  return drawPlan
})()
