var library = require("nrtv-library")(require)

library.using(
  ["nrtv-server", "./teensy-house-3", "./allocate_materials", "./buy_materials", "./drawing", "./build", "./send_instructions"],
  function(server, teensyHouse, allocateMaterials, buy, draw, build, sendInstructions) {
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
      "get", "/build-left-floor-section",
      sendInstructions(house, materials, server, "floor-left")
    )

  }
)