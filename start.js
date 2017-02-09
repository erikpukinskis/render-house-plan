var library = require("module-library")(require)

library.using(
  ["web-host", "./teensy-house-3", "./render-house-plan", "browser-bridge", "web-element"],
  function(host, teensyHouse, renderHousePlan, BrowserBridge, element) {

    var house = teensyHouse()

    host.onSite(prepareSite)

    var breadcrumb = element.style(".breadcrumb", {
      "font-family": "sans-serif",
      "font-size": "1.2em",
      "display": "inline-block",
      "padding": "20px",
      "color": "#99d",
    })

    function prepareSite(site) {
      site.addRoute(
        "get",
        "/house-plan/:view",
        function(request, response) {
          var bridge = new BrowserBridge()
          bridge.addToBody([
            element("a.breadcrumb", {href: "/house-plan/side"}, "Side"),
            element("a.breadcrumb", {href: "/house-plan/top"}, "Top"),
            element("a.breadcrumb", {href: "/house-plan/front"}, "Front"),
            element.stylesheet(breadcrumb),
          ])
          var view = request.params.view || "side"
          var page = renderHousePlan(bridge, house, {view: view})

          bridge.sendPage(page)(request, response)
        }
      )
    }

  }
)