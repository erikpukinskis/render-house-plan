var library = require("nrtv-library")(require)

library.using(
  ["nrtv-server", "./teensy-house-3", "./allocate_materials", "./buy_materials", "./drawing", "./build"],
  function(server, teensyHouse, allocateMaterials, buy, draw, build) {
    server.start(process.env.PORT||8181)

    var house = teensyHouse()
    var materials = allocateMaterials(house)

    server.addRoute(
      "get", "/buy",
      buy(materials)
    )

    server.addRoute(
      "get", "/drawing/:view",
      draw(house)
    )

    server.addRoute(
      "get", "/build",
      build.index()
    )

    server.addRoute(
      "get", "/build-section/:name",
      build.section(house, materials, server)
    )

  }
)