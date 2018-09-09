var library = require("module-library")(require)

library.using(
  ["web-site", "./render-house-plan", "house-plan", "browser-bridge", "web-element"],
  function(WebSite, renderHousePlan, HousePlan, BrowserBridge, element) {

    var house = new HousePlan()
    var site = new WebSite()

    house.add(function(section, stud) {
      var floor = section({
        name: "floor panel",
        xPos: 0,
        yPos: 0,
        zPos: 0,
      })

      stud({
        name: "floor-stud-1",
        section: floor,
        xPos: 0,
        yPos: 0,
        zPos: 0,
        xSize: 1.25,
        ySize: 2.5,
        zSize: 96,
        orientation: "horizontal-east",
      })
    })


    site.addRoute(
      "get",
      "/house-plan/:view",
      function(request, response) {
        var bridge = new BrowserBridge()

        var options = {
          view: request.params.view || "side",
          zoom: request.query.zoom,
          left: request.query.left,
          top: request.query.top,
        }

        var page = renderHousePlan(bridge, house, options)

        bridge.forResponse(response).send(page)})

    site.start(1413)

  }
)