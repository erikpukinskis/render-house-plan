var library = require("nrtv-library")(require)

library.using(
  ["nrtv-server", "./teensy-house-3", "./buy_materials", "./drawing", "./build", "./send_instructions"],
  function(server, teensyHouse, buy, draw, build, sendInstructions) {
    server.start(8181)

    var house = teensyHouse()

    server.addRoute(
      "get", "/buy",
      buy(house)
    )

    server.addRoute(
      "get", "/drawing",
      draw(house, "top")
    )

    server.addRoute(
      "get", "/build",
      build.index(house)
    )

    server.addRoute(
      "get", "/build-left-floor-section",
      sendInstructions(house, server, "floor-left")
    )

  }
)