var library = require("nrtv-library")(require)

module.exports = library.export(
  "send-instructions",
  ["nrtv-browser-bridge", "nrtv-element", "./dimension_text"],
  function(BrowserBridge, element, dimensionText) {
    function sendInstructions(steps, bridge) {

      var body = element()

      steps.play({
        step: function(description, results) {
          var stepEl = element(
            ".step",
            element(".step-title", description)
          )
          if (results) {
            results.map(function(el) {
              stepEl.addChild(el)
            })
          }
          body.addChild(stepEl)
        },
        task: function(text) {
          return element(".task", text)
        },
        cut: function(scraps) {
          return element(".cut_instructions", scraps.map(toCutInstruction))
        }
      })

      function toCutInstruction(scrap) {
        var text = " - "+scrap.cut+" cut <strong>"+dimensionText(scrap.size)+"</strong> from "+scrap.material.description+" #"+scrap.material.number

        return element(text)
      }

      return bridge.sendPage(body)
    }

    return sendInstructions
  }
)
