var library = require("module-library")(require)

library.using(
  ["web-host", "./teensy-house-3", "./render-house-plan", "browser-bridge"],
  function(host, teensyHouse, renderHousePlan, BrowserBridge) {

    var house = teensyHouse()

    host.onSite(prepareSite)

    function prepareSite(site) {
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