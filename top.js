drawPlan(function(stud, plywood, section) {


var trim = element.template(
  ".trim",
  element.style({
    "box-sizing": "border-box",
    "border": "0.3em solid #ec4",
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

addHtml(element.stylesheet(trim).html())


// BACK

var back = section({
  left: 0,
  top: 0
})

plywood({
  section: back,
  length: 48,
  rotate: 90,
  top: -plywood.THICKNESS,
  left: -plywood.THICKNESS,
  orientation: "north"
})

plywood({
  section: back,
  length: 48 - stud.DEPTH - 2*plywood.THICKNESS,
  rotate: 90,
  top: stud.DEPTH,
  left: stud.DEPTH + plywood.THICKNESS,
  orientation: "south"
})

stud({
  section: back,
  orientation: "east",
  left: stud.DEPTH + plywood.THICKNESS
})

var secondStudOffset = 16 - plywood.THICKNESS - stud.WIDTH/2

stud({
  section: back,
  orientation: "west",
  left: secondStudOffset
})

stud({
  section: back,
  orientation: "west",
  left: secondStudOffset + 16
})

stud({
  section: back,
  orientation: "west",
  left: 48 - plywood.THICKNESS - stud.WIDTH/2
})

// BACK RIGHT

plywood({
  section: back,
  length: 48,
  left: 48-plywood.THICKNESS,
  rotate: 90,
  top: -plywood.THICKNESS,
  orientation: "north"
})

plywood({
  section: back,
  length: 48 - stud.DEPTH - 2*plywood.THICKNESS,
  left: 48-plywood.THICKNESS,
  rotate: 90,
  top: stud.DEPTH,
  orientation: "south"
})

stud({
  section: back,
  orientation: "west",
  left: 48 - plywood.THICKNESS + 16 - stud.WIDTH/2
})

stud({
  section: back,
  orientation: "west",
  left: 48 - plywood.THICKNESS + 2*16 - stud.WIDTH/2
})

stud({
  section: back,
  orientation: "west",
  left: 48*2 - plywood.THICKNESS*3 - stud.WIDTH-stud.DEPTH
})




// SIDES

sideWall({
  left: 0,
  top: 0
})

sideWall({
  left: 96 - stud.DEPTH - plywood.THICKNESS*2,
  top: 0
})


// BATTENS

var battens = section({
  left: 0,
  top: 0
})

var BATTEN_WIDTH = 1.75

westBatten(-plywood.THICKNESS)
westBatten(24 - BATTEN_WIDTH/2)
westBatten(48 - BATTEN_WIDTH/2)
westBatten(72 - BATTEN_WIDTH)


function westBatten(top) {
  trim({
    section: battens,
    height: BATTEN_WIDTH,
    left: -plywood.THICKNESS-trim.THICKNESS,
    top: top
  })
}


function sideWall(position) {

  var long = section(position)

  stud({
    section: long,
    top: 0,
    orientation: "south"
  })

  stud({
    section: long,
    top: 16 - stud.WIDTH/2
  })

  stud({
    section: long,
    top: 16*2 - stud.WIDTH/2
  })

  stud({
    section: long,
    top: 48 - stud.WIDTH/2
  })

  plywood({
    section: long,
    length: 48,
    left: -plywood.THICKNESS,
    orientation: "west"
  })

  plywood({
    section: long,
    length: 24,
    left: stud.DEPTH,
    orientation: "east"
  })

  stud({
    section: long,
    top: 48+12 - stud.WIDTH/2
  })

  stud({
    section: long,
    top: 48+24 - stud.WIDTH
  })

  plywood({
    section: long,
    length: 24,
    top: 48,
    left: -plywood.THICKNESS,
    orientation: "west"
  })

  plywood({
    section: long,
    length: 48,
    top: 24,
    left: stud.DEPTH,
    orientation: "east"
  })
}



// DOOR OPENING

var opening = section({
  top: 72,
  left: stud.DEPTH+plywood.THICKNESS
})

trim({
  section: opening,
  height: 3.5,
  bottom: -trim.THICKNESS
})

trim({
  section: opening,
  width: trim.THICKNESS+plywood.THICKNESS*2+stud.DEPTH,
  bottom: -trim.THICKNESS,
  right: 0
})


// FRONT WALL

var front = section({
  top: 48+24,
  left: 48*2-plywood.THICKNESS*2
})

plywood({
  section: front,
  width: 24,
  orientation: "south",
  right: -plywood.THICKNESS
})

stud({
  section: front,
  orientation: "west",
  bottom: 0,
  right: stud.DEPTH+plywood.THICKNESS
})



})