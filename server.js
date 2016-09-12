var library = require("nrtv-library")(require)

library.using(
  ["nrtv-server", "./buy_materials"],
  function(server, buy) {
    server.start(8181)

    server.addRoute("get", "/buy", buy)
  }
)