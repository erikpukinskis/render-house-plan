var library = require("nrtv-library")(require)

module.exports = library.export(
  "send-instructions",
  ["./build", "./allocate_materials", "./build_floor", "browser-bridge", "web-element", "./dimension_text", "make-request"],
  function(build, allocateMaterials, buildFloor, BrowserBridge, element, dimensionText, makeRequest) {

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
        this.onclick(toggleTask.withArgs(42).evalable())
      }
    )

    function toggleTask(server, bridge) {
      if (!server.__toggleTaskRoute) {
        server.addRoute("post", "/tasks/:id/completed",
          handleRequest)
      }

      var binding = bridge.defineFunction(
        [makeRequest.defineOn(bridge)],
        sendRequest
      )

      function sendRequest(makeRequest, identifier) {
        makeRequest({
          method: "post",
          path: "/tasks/"+identifier+"/completed",
        }, function(resp) {
          console.log("got resp", resp)
        })
      }

      function handleRequest(request, response) {
        response.json({status: "ok"})
      }

      return binding
    }

    function sendInstructions(plan, server, sectionName) {

      var materials = allocateMaterials(plan)

      var options = plan.getOptions(sectionName)

      var steps = buildFloor(options, materials)

      var bridge = new BrowserBridge()

      bridge.addToHead(build.stylesheet.html())
      bridge.addToHead(element.stylesheet(stepTitle, em, checkBox, taskTemplate).html())

      var page = element()

      var toggle = toggleTask(server, bridge)

      var task = taskTemplate.bind(null, toggle)

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
          page.addChild(stepEl)
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

      return bridge.sendPage(page)
    }

    return sendInstructions
  }
)
