var library = require("nrtv-library")(require)

module.exports = library.export(
  "drawing",
  ["nrtv-browser-bridge", "./viewer"],
  function(BrowserBridge, Viewer) {

    function sendDrawing(plan) {
      var bridge = new BrowserBridge()

      Viewer.defineHandlersOn(bridge)

      return function(request, response) {
        var viewer = new Viewer(request.params.view)

        var page = viewer.render(plan)

        bridge.sendPage(page)(request, response)
      }
    }

    return sendDrawing
  }
)