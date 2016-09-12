var library = require("nrtv-library")(require)

library.using(
  ["nrtv-server", "./teensy-house-3", "./buy_materials", "./drawing"],
  function(server, teensyHouse, buy, draw) {
    server.start(8181)

    var teensy = teensyHouse()

    server.addRoute("get", "/buy", buy(teensy))

    server.addRoute("get", "/drawing", draw(teensy))
  }
)