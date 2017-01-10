var library = require("module-library")(require)

module.exports = library.export(
  "house-plan-server",
  ["./teensy-house-3", "./render-house-plan", "browser-bridge"],
  function(teensyHouse, renderHousePlan, BrowserBridge) {

    return function(site) {

      var house = teensyHouse()

      site.addRoute(
        "get",
        "/house-plan/:view",
        function(request, response) {
          var bridge = new BrowserBridge()
          var view = request.params.view || "side"
          var page = renderHousePlan(bridge, house, {view: view})

          bridge.sendPage(page)(request, response)
        }
      )
    }

  }
)