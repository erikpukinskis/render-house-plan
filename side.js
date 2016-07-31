

drawPlan(function(stud, plywood, section) {

  var slopeWrapper = element.template(
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




  // SHEATHING

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

  addHtml(element.stylesheet(frontStud, slopeWrapper).html())




  function slopedStud(offset) {
    var rightSide = offset + stud.WIDTH

    var height = 72 + rightSide/72*12

    var newStud = frontStud({
      section: side,
      width: stud.WIDTH,
      height: height
    })

    side.children.push(
      slopeWrapper(
        newStud,
        {
          slope: 1/6,
          left: offset,
          bottom: 0
        }
      )
    )
  }


  function slopedPly(offset, width) {
    var rightSide = offset + width

    var height = 72 + rightSide/72*12

    plywood.push = false

    var ply = plywood({
      width: width,
      height: height,
      orientation: "in",
    })

    side.children.push(
      slopeWrapper(
        ply,
        {
          slope: 1/6,
          left: offset,
          bottom: 0
        }
      )
    )
  }



  var side = section({
    left: 0,
    top: 96
  })

  slopedPly(0, 48)
  slopedPly(48, 24)

  slopedStud(0)
  slopedStud(16-stud.WIDTH/2)
  slopedStud(16*2-stud.WIDTH/2)
  slopedStud(16*3-stud.WIDTH/2)
  slopedStud(48+12-stud.WIDTH/2)
  slopedStud(72-stud.WIDTH)


  var back = section({
    left: 0,
    top: 96
  })

  plywood({
    section: back,
    height: 72,
    bottom: 0,
    left: -plywood.THICKNESS,
    orientation: "west"
  })



})




