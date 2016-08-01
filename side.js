drawPlan(function(stud, frontStud, plywood, section, slope) {



var BACK_WALL_HEIGHT = 80

function slopedStud(offset) {
  var rightSide = offset + stud.WIDTH

  var height = BACK_WALL_HEIGHT + rightSide/72*12

  frontStud.push = false

  var newStud = frontStud({
    section: side,
    width: stud.WIDTH,
    height: height
  })

  side.children.push(
    slope(
      newStud,
      {
        slope: 1/4,
        left: offset,
        bottom: 0
      }
    )
  )
}


function slopedPly(offset, width) {
  var rightSide = offset + width

  var height = BACK_WALL_HEIGHT + rightSide/72*12

  plywood.push = false

  var ply = plywood({
    width: width,
    height: height,
    orientation: "in",
  })

  side.children.push(
    slope(
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


// REAR WALL

var back = section({
  left: 0,
  top: 96
})

plywood({
  section: back,
  height: BACK_WALL_HEIGHT,
  bottom: 0,
  left: -plywood.THICKNESS,
  orientation: "west"
})


// HEADER

var header = section({
  left: 72-stud.DEPTH,
  top: 96-80-12
})

plywood({
  section: header,
  height: 12,
  left: -plywood.THICKNESS,
  orientation: "west"
})

plywood({
  section: header,
  height: 12,
  left: stud.DEPTH,
  orientation: "east"
})

stud({
  section: header,
  orientation: "north",
  top: 12-stud.WIDTH
})

stud({
  section: header,
  orientation: "south",
  top: 0
})

})




