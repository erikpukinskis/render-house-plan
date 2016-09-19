var library = require("nrtv-library")(require)

module.exports = library.export(
  "send-instructions",
  ["browser-bridge", "web-element", "./dimension_text", "./module_universe", "./doable"],
  function(BrowserBridge, element, dimensionText, ModuleUniverse, doable) {

    var universe = new ModuleUniverse(
      "houses",
      ["doable"],
      function(doable) {
        // begin
      }
    )

    universe.replayRemote(function() {
      console.log("OK! "+doable.count+" tasks done")
    })

    function sendInstructions(steps, materials, bridge, server, sectionName) {

      var saveCompletion = doable.complete.defineOn(server, bridge, universe)

      var completeTask = bridge.defineFunction(
        [saveCompletion],
        function(save, id) {

          var el = document.querySelector(".task-"+id)

          var isCompleted = el.classList.contains("task-completed")

          if (isCompleted) { return }

          el.classList.add("task-completed")

          save(id)
        }
      )

      bridge.addToHead(element.stylesheet(stepTitle, em, checkBox, checkMark, checkMarkChecked, taskTemplate, taskCompleted).html())

      var page

      var handlers = {
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
          if (!Array.isArray(scraps)) {
            scraps = [scraps]
          }
          console.log(scraps)
          return element(".cut_instructions", scraps.map(scrapToTask))
        },
        chalkLines: function(direction, joists) {

          var horizontal = task("chalk-horizontal-lines", "Add chalk lines <strong>3/4\"</strong> in from the front and back edge (the shorter sides)")

          var distances = joists.map(toLeft).join(", ")

          function toLeft(joist) {
            return "<strong>"+dimensionText(joist.destination.xPos + 0.75)+"</strong>"
          }

          var vertical = task("chalk-vertical-lines", "Add chalk lines at "+distances+" from the "+direction+" (long side)")

          return [horizontal, vertical]
        },
      }

      function scrapToTask(scrap) {
        var material = scrap.material

        var text = scrap.cut+" cut <strong>"+dimensionText(scrap.size)+"</strong> from "+material.description+" #"+material.number
  
        var id = "cut-"+scrap.name+"-from-"+toSlug(material.description)+"-no"+material.number

        return task(id, text)
      }

      function task(id, text) {
        id = "building-house-X-"+id+"-for-"+sectionName

        return taskTemplate(
          text,
          id,
          completeTask,
          bridge
        )
      }

      return function(request, response) {
        if (!universe.isReady()) {
          throw new Error("server not ready yet")
        }

        page = element()
        steps.play(handlers)
        bridge.sendPage(page)(request, response)
      }
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

    var checkMark = element.template(
      ".check-mark",
      element.style({
        "display": "none"
      }),
      "✗"
    )

    var checkMarkChecked = element.style(".task-completed .check-mark", {
      "display": "block"
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
      }),
      checkMark()
    )

    var taskCompleted = element.template(
      ".task-completed",
      element.style({
        "text-decoration": "line-through"
      })
    )

    var taskTemplate = element.template(
      ".task",
      element.style({
        "margin-bottom": "0.5em",
        "cursor": "pointer",
      }),
      function(text, id, complete, bridge) {
        var isCompleted = doable.isCompleted(id)
        if (isCompleted) {
          this.classes.push("task-completed")
        }
        this.addChild(checkBox(isCompleted))
        this.addChild(text)

        this.classes.push("task-"+id)
        this.onclick(complete.withArgs(id).evalable())
      }
    )

    function toSlug(string) {
      return string.toLowerCase().replace(/[^0-9a-z]+/g, "-")
    }

    return sendInstructions
  }
)
