var library = require("nrtv-library")(require)

module.exports = library.export(
  "send-instructions",
  ["./build", "./build_floor", "browser-bridge", "web-element", "./dimension_text", "make-request"],
  function(build, buildFloor, BrowserBridge, element, dimensionText, makeRequest) {

    function sendInstructions(plan, materials, server, sectionName) {

      var options = plan.getOptions(sectionName)

      var steps = buildFloor(options, materials)

      var bridge = new BrowserBridge()

      bridge.addToHead(build.stylesheet.html())
      bridge.addToHead(element.stylesheet(stepTitle, em, checkBox, taskTemplate).html())

      var page = element()

      var toggle = toggleTask(server, bridge)

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
        task: task,
        cut: function(scraps) {
          return element(".cut_instructions", scraps.map(scrapToTask))
        }
      })

      function scrapToTask(scrap) {
        var material = scrap.material

        var text = scrap.cut+" cut <strong>"+dimensionText(scrap.size)+"</strong> from "+material.description+" #"+material.number
  
        var id = "cut-"+scrap.name+"-from-"+toSlug(material.description)+"-no"+material.number

        return task(id, text)
      }

      function task(id, text) {
        id = "building-house-X-"+id+"-for-"+sectionName

        return taskTemplate(toggle, text, id)
      }

      return bridge.sendPage(page)
    }

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
      function(toggleTask, text, id) {
        // if (!text) {
        //   throw new Error("task needs text")
        // }
        this.addChild(checkBox())
        this.addChild(text||"hay")
        this.onclick(toggleTask.withArgs(id).evalable())
      }
    )

    function toSlug(string) {
      return string.toLowerCase().replace(/[^0-9a-z]+/g, "-")
    }

    function toggleTask(server, bridge) {
      if (!server.__toggleTaskRoute) {
        server.addRoute("post", "/tasks/:id/complete",
          handleRequest)
      }

      var binding = bridge.defineFunction(
        [makeRequest.defineOn(bridge)],
        sendRequest
      )

      function sendRequest(makeRequest, identifier) {
        makeRequest({
          method: "post",
          path: "/tasks/"+identifier+"/complete"
        }, function(resp) {
          console.log("got resp", resp)
        })
      }

      function handleRequest(request, response) {

        console.log("task.complete", request.params.id)
        response.json({status: "ok"})
      }

      return binding
    }

    return sendInstructions
  }
)
