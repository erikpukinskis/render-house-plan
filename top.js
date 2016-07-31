drawPlan(function(stud, plywood, section) {

var DOOR_WIDTH = 32


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



addHtml(element.stylesheet(trim, door, doorBox, doorSwing).html())


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

door({
  section: opening,
  left: trim.THICKNESS,
  bottom: 0
})

door({
  section: opening,
  left: trim.THICKNESS+door.WIDTH,
  bottom: 0,
  orientation: "east"
})

trim({
  section: opening,
  height: 3.5,
  bottom: -trim.THICKNESS,
  left: trim.THICKNESS+door.WIDTH*2
})


// FRONT WALL

var distanceIn = plywood.THICKNESS + stud.DEPTH + trim.THICKNESS*2 + door.WIDTH*2

var front = section({
  top: 48+24,
  left: distanceIn
})

plywood({
  section: front,
  width: 96 - distanceIn - plywood.THICKNESS,
  orientation: "south"
})

plywood({
  section: front,
  width: 96 - distanceIn - plywood.THICKNESS*3 - stud.DEPTH,
  bottom: stud.DEPTH,
  orientation: "north"
})

stud({
  section: front,
  orientation: "east",
  bottom: 0
})

stud({
  section: front,
  orientation: "east",
  bottom: 0,
  left: 12
})

stud({
  section: front,
  orientation: "west",
  bottom: 0,
  left: 96 - distanceIn - plywood.THICKNESS*3 - stud.DEPTH - stud.WIDTH
})




})