var library = require("nrtv-library")(require)

module.exports = library.export(
  "drawing",
  ["nrtv-browser-bridge", "./viewer"],
  function(BrowserBridge, Viewer) {

    function sendDrawing(plan, view) {
      var bridge = new BrowserBridge()

      Viewer.defineHandlersOn(bridge)
      var viewer = new Viewer(view)

      return bridge.sendPage(viewer.render(plan))
    }

    return sendDrawing
  }
)