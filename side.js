

drawPlan(function(stud, plywood, section) {

  var frontStud = element.template(
    ".front-stud",
    element.style({
      "width": stud.WIDTH+"em",
      "position": "absolute",
      "overflow": "hidden"
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
      "background": "#999",
      "position": "absolute"
    }),
    function(options) {
      this.appendStyles({
        height: options.height+"em"
      })
      if (options.topSlope) {
        var angle = Math.atan(options.topSlope)/Math.PI*180
        console.log("angle of", options.topSlope, "is", angle)
        var dh = stud.WIDTH*options.topSlope
        this.appendStyles({
          "transform": "skewY(-"+angle+"deg)",
          "top": dh+"em"
        })
      }        
    } 
  )

  addHtml(element.stylesheet(frontStud, inner).html())

  // SIDE SECTION

  var side = section({
    left: 0,
    top: 96
  })

  var firstStudHeight = 80+1/6*stud.WIDTH

  for(var i=0; i<6; i++) {
    frontStud({
      section: side,
      height: firstStudHeight+i/6*16,
      left: i*16,
      bottom: 0,
      topSlope: 1/6
    })
  }
})




