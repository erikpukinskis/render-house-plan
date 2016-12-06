var library = require("module-library")(require)

library.using(
  ["web-site", "./teensy-house-3", "./allocate_materials", "./buy_materials", "./drawing", "./build", "make-request"],
  function(server, teensyHouse, allocateMaterials, buy, draw, build, makeRequest) {
    site.start(process.env.PORT||8181)

    var house = teensyHouse()
    var materials = allocateMaterials(house)

    site.addRoute(
      "get", "/buy",
      buy(materials)
    )

    site.addRoute(
      "get", "/drawing/:view",
      draw(house)
    )

    site.addRoute(
      "get", "/build",
      build.index()
    )

    site.addRoute(
      "get", "/build-section/:name",
      build.section(house, materials, server)
    )

    // makeRequest("http://localhost:8181/build-section/left-wall-A")

  }
)