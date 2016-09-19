var library = require("nrtv-library")(require)

module.exports = library.export(
  "doable",
  ["make-request"],
  function(makeRequest) {
    function Task(text, id, universe, bridge) {
      this.text = text
      this.id = id
      this.__universe = universe
    }

    var completed = {}

    function doable() {
    }

    doable.complete = function(id) {
      doable.count++
      completed[id] = true
    }

    doable.isCompleted = function(id) {
      return completed[id] || false
    }

    doable.complete.defineOn =
      function(server, bridge, universe) {
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

          doable.complete(request.params.id)

          universe.do("doable.complete", request.params.id)

          response.json({status: "ok"})
        }

        return binding
      }

    doable.count = 0

    return doable
  }
)