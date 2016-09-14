var library = require("nrtv-library")(require)

module.exports = library.export(
  "build",
  ["nrtv-browser-bridge", "nrtv-element"],
  function(BrowserBridge, element) {

    var body = element.style("body", {
      "font-family": "sans-serif",
      "line-height": "1.5em",
      "font-size": "1.15em",
      "color": "#def",
      "background": "#48e",
      "-webkit-font-smoothing": "antialiased",
    })

    var urls = {
      "left_floor": "/build-left-floor-section"
    }
    function index(plan) {
      var bridge = new BrowserBridge()


      var page = element()

      for(var name in urls) {
        var link = element(
          "a",
          name+" section",
          {href: urls[name]}
        )
        page.addChild(element(link))
      }

      page.addChild(element.stylesheet(body))

      return bridge.sendPage(page)
    }


    return {
      index: index,
      stylesheet: element.stylesheet(body)
    }
})
