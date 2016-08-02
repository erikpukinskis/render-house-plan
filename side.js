var BACK_STUD_HEIGHT = 80


drawPlan(floor)
drawPlan(header)
drawPlan(rearWall)
drawPlan(sideWall)


function floor(section, stud, frontStud, plywood) {

  var floor = section({
    top: 96,
    left: 0
  })

  plywood({
    section: floor,
    width: 72,
    orientation: "north"
  })

  plywood({
    section: floor,
    width: 72,
    top: plywood.THICKNESS + stud.DEPTH,
    orientation: "south"
  })

  frontStud({
    section: floor,
    top: plywood.THICKNESS,
    width: 72,
    height: stud.DEPTH
  })

  stud({
    section: floor,
    orientation: "east",
    top: plywood.THICKNESS
  })

  stud({
    section: floor,
    orientation: "west",
    top: plywood.THICKNESS,
    left: 72 - stud.WIDTH
  })

}


function sideWall(section, stud, frontStud, plywood, slope) {


  var side = section({
    left: 0,
    top: 96
  })

  slopedPly(0, 48)
  slopedPly(48, 24)

  function slopedPly(offset, width) {
    var rightSide = offset + width

    var height = BACK_STUD_HEIGHT + rightSide/72*12

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


  slopedStud(0)
  slopedStud(16-stud.WIDTH/2)
  slopedStud(16*2-stud.WIDTH/2)
  slopedStud(16*3-stud.WIDTH/2)
  slopedStud(48+12-stud.WIDTH/2)
  slopedStud(72-stud.WIDTH)

  function slopedStud(offset) {
    var rightSide = offset + stud.WIDTH

    var height = BACK_STUD_HEIGHT + rightSide/72*12

    var newStud = frontStud({
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

}



function rearWall(section, plywood, stud) {

  var back = section({
    left: 0,
    top: 96
  })

  plywood({
    section: back,
    height: BACK_STUD_HEIGHT + plywood.THICKNESS*2 + stud.DEPTH,
    bottom: -plywood.THICKNESS*2 - stud.DEPTH,
    left: -plywood.THICKNESS,
    orientation: "west"
  })

}


function header(section, stud, plywood) {

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


}



