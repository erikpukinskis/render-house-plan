var library = require("nrtv-library")(require)

module.exports = library.export(
  "build",
  ["nrtv-browser-bridge", "nrtv-element", "./build_floor", "./send_instructions"],
  function(BrowserBridge, element, buildFloor, sendInstructions) {

    var body = element.style("body", {
      "font-family": "sans-serif",
      "line-height": "1.5em",
      "font-size": "1.15em",
      "color": "#def",
      "background": "#48e",
      "-webkit-font-smoothing": "antialiased",
    })

    var builders = {
      "floor-left": buildFloor
    }

    function index() {
      var bridge = new BrowserBridge()

      var page = element()

      for(var name in builders) {
        var link = element(
          "a",
          name+" section",
          {href: "/build-section/"+name}
        )
        page.addChild(element(link))
      }

      page.addChild(element.stylesheet(body))

      return bridge.sendPage(page)
    }

    function buildSection(house, materials, server) {
      return function(request, response) {
        var name = request.params.name
        var options = house.getOptions(name)
        var steps = buildFloor(options, materials)

        // should be buildBridge.fork()
        var bridge = new BrowserBridge()
        bridge.addToHead(element.stylesheet(body).html())

        sendInstructions(steps, materials, bridge, server, name)(request, response)
      }
    }



    return {
      index: index,
      section: buildSection
    }
})
