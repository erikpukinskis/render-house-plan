var library = require("nrtv-library")(require)

module.exports = library.export(
  "send-instructions",
  ["nrtv-browser-bridge", "nrtv-element", "./dimension_text"],
  function(BrowserBridge, element, dimensionText) {

    var stepTitle = element.template(
      ".step-title",
      element.style({
        "margin": "12pt 0",
        "font-size": "1.5em",
        "line-height": "1em",
      }),
      function(text) {
        this.addChild(text)
      }
    )

    var em = element.style("strong", {
      "font-weight": "bold",
      "font-size": "1.15em",
      "line-height": "1em",
    })

    var checkBox = element.template(
      "button.toggle-button",
      element.style({
        "border": "2px solid #bef",
        "vertical-align": "middle",
        "background": "transparent",
        "width": "1.15em",
        "height": "1.15em",
        "margin-right": "0.5em",
        "color": "#dff",
        "padding": "1px 3px 0px 3px",
        "font-size": "1.15em",
        "line-height": "1em",
        "display": "inline-block",
        "cursor": "pointer",
      })
    )

    var taskTemplate = element.template(
      ".task",
      element.style({
        "margin-bottom": "0.5em",
        "cursor": "pointer",
      }),
      function(toggleTask, text) {
        if (!text) {
          throw new Error("na")
        }
        this.addChild(checkBox())
        this.addChild(text)
        this.onclick(toggleTask)
      }
    )

    function sendInstructions(steps, bridge) {

      var body = element(
        element.stylesheet(stepTitle, em, checkBox, taskTemplate)
      )

      var toggleTask = bridge.defineFunction(function() {
        console.log("bam!")
      })

      var task = taskTemplate.bind(null, toggleTask)

      steps.play({
        step: function(description, results) {
          var stepEl = element(
            ".step",
            stepTitle(description)
          )

          if (results) {
            results.map(function(el) {
              stepEl.addChild(el)
            })
          }
          body.addChild(stepEl)
        },
        task: function(text) {
          return task(text)
        },
        cut: function(scraps) {
          return element(".cut_instructions", scraps.map(toCutInstruction))
        }
      })

      function toCutInstruction(scrap) {
        var text = scrap.cut+" cut <strong>"+dimensionText(scrap.size)+"</strong> from "+scrap.material.description+" #"+scrap.material.number

        return task(text)
      }

      return bridge.sendPage(body)
    }

    return sendInstructions
  }
)
