var library = require("nrtv-library")(require)

module.exports = library.export(
  "drawing",
  ["nrtv-browser-bridge", "./viewer"],
  function(BrowserBridge, Viewer) {

    function sendDrawing(plan) {
      var bridge = new BrowserBridge()

      Viewer.defineHandlersOn(bridge)

      return bridge.sendPage(Viewer.render(plan))
    }

    return sendDrawing
  }
)