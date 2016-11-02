var library = require("nrtv-library")(require)

module.exports = library.export(
  "build",
  ["nrtv-browser-bridge", "nrtv-element", "./build_floor", "./build_face_wall", "./build_instructions_page"],
  function(BrowserBridge, element, buildFloor, buildWall, buildInstructionsPage) {

    var body = element.style("body, a", {
      "font-family": "sans-serif",
      "line-height": "1.5em",
      "font-size": "1.15em",
      "color": "#def",
      "background": "#48e",
      "-webkit-font-smoothing": "antialiased",
    })

    var builders = {
      "floor-left": buildFloor,
      "floor-right": buildFloor,
      "back-wall-left": buildWall,
      "left-wall-A": buildWall,
    }


    function index() {
      var bridge = new BrowserBridge()

      var page = element()

      page.addChild(element(
        element("a", "Top view", {href: "/drawing/top"})
      ))

      page.addChild(element(
        element("a", "Side view", {href: "/drawing/side"})
      ))

      page.addChild(element(
        element("a", "Front view", {href: "/drawing/front"})
      ))

      page.addChild(element(
        element("a", "Materials", {href: "/buy"})
      ))

      page.addChild(element.raw("<br/>"))

      for(var name in builders) {
        var link = element(
          "a",
          name,
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
        var builder = builders[name]

        var steps = builder(options, materials)

        // should be buildBridge.fork()
        var bridge = new BrowserBridge()
        bridge.addToHead(element.stylesheet(body).html())

        var handler = buildInstructionsPage(steps, materials, bridge, server, name)

        handler(request, response)
      }
    }



    return {
      index: index,
      sections: Object.keys(builders),
      section: buildSection
    }
})
