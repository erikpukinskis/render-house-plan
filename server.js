var library = require("nrtv-library")(require)

library.using(
  ["nrtv-server", "./teensy-house-3", "./allocate_materials", "./buy_materials", "./drawing", "./build", "./build_floor", "./send_instructions"],
  function(server, teensyHouse, allocateMaterials, buy, draw, build, buildFloor, sendInstructions) {
    server.start(8181)

    var house = teensyHouse()
    var materials = allocateMaterials(house)

    server.addRoute(
      "get", "/buy",
      buy(materials)
    )

    server.addRoute(
      "get", "/drawing",
      draw(house, "top")
    )

    server.addRoute(
      "get", "/build",
      build.index()
    )

    server.addRoute(
      "get", "/build-section/:name",
      function(request, response) {
        var name = request.params.name
        var options = house.getOptions(name)
        var steps = buildFloor(options, materials)
        sendInstructions(steps, materials, server, name)(request, response)
      }
    )

  }
)