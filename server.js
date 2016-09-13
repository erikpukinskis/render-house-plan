var library = require("nrtv-library")(require)

library.using(
  ["nrtv-server", "./teensy-house-3", "./buy_materials", "./drawing", "./build"],
  function(server, teensyHouse, buy, draw, build) {
    server.start(8181)

    var teensy = teensyHouse()

    server.addRoute(
      "get", "/buy",
      buy(teensy)
    )

    server.addRoute(
      "get", "/drawing",
      draw(teensy, "top")
    )

    server.addRoute(
      "get", "/build",
      build.index(teensy)
    )

    server.addRoute(
      "get", "/build-left-floor-section",
      build.floor(teensy)
    )
  }
)