

drawPlan(function(stud, plywood, section) {

  var frontStud = element.template(
    ".front-stud",
    element.style({
      "width": stud.WIDTH+"em",
      "position": "absolute",
      "overflow": "hidden",
      "box-sizing": "border-box",
      "border-bottom": "1px solid #bbb"
    }),
    function(options) {
      options.section.children.push(this)
      this.children.push(
        inner({height: options.height, topSlope: options.topSlope})
      )
      this.appendStyles({
        "height": options.height+"em"
      })
      if (options.left) {
        this.appendStyles({
          "left": options.left+"em"
        })
      }
      if (typeof options.bottom != "undefined") {
        this.appendStyles({
          "bottom": options.bottom+"em"
        })
      }   
    }
  )



  var inner = element.template(
    ".front-stud-inner",
    element.style({
      "width": stud.WIDTH+"em",
      "background": "#ccc",
      "border": "1px solid #999",
      "box-sizing": "border-box",
      "border-color": "#bbb #bbb #999 #999",
      "position": "absolute"
    }),
    function(options) {
      this.appendStyles({
        height: options.height+"em"
      })
      if (options.topSlope) {
        var angle = Math.atan(options.topSlope)/Math.PI*180
        var dh = stud.WIDTH*options.topSlope
        this.appendStyles({
          "transform": "skewY(-"+angle+"deg)",
          "top": dh+"em"
        })
      }        
    } 
  )

  addHtml(element.stylesheet(frontStud, inner).html())






  var side = section({
    left: 0,
    top: 96
  })


  // SHEATHING

  plywood({
    section: side,
    length: 72,
    bottom: 0,
    width: 48
  })

  plywood({
    section: side,
    length: 72,
    left: 48,
    bottom: 0,
    width: 24
  })


  // SIDE STUDS

  myFrontStud(0)
  myFrontStud(16-stud.WIDTH/2)
  myFrontStud(16*2-stud.WIDTH/2)
  myFrontStud(16*3-stud.WIDTH/2)
  myFrontStud(48+12-stud.WIDTH/2)
  myFrontStud(72-stud.WIDTH)

  function myFrontStud(offset) {
    var leftSide = offset + stud.WIDTH

    var height = 72 + leftSide/72*12

    frontStud({
      section: side,
      height: height,
      left: offset,
      bottom: 0,
      topSlope: 1/6
    })
  }



})




