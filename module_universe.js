var library = require("nrtv-library")(require)

module.exports = library.export(
  "module-universe",
  ["knox"],
  function(knox) {


    var s3 = knox.createClient({
      key: process.env.AWS_ACCESS_KEY_ID,
      secret: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: "ezjs"
    })

    function ModuleUniverse(name,
      moduleNames, initialize) {
      this.name = name
      this.moduleNames = moduleNames
      this.baseLog = initialize
      this.log = []
      this.waitingForReady = []
      this.waiting = false
    }

    ModuleUniverse.prototype.isReady = function() { return !this.waiting }

    ModuleUniverse.prototype.getRemoteSource = function(callback) {
      this.waiting = true

      var universe = this
      var source = ""

      s3.get(this.path()).on('response',
        function(res){
          res.setEncoding('utf8')
          res.on('data', append)
          res.on('end', done)
        }
      ).end()

      function append(chunk){
        source += chunk
      }

      function done() {
        callback(source)
        universe.waitingForReady.forEach(call)
        universe.waitingForReady = []
        universe.waiting = false
      }

      function call(fn) { fn() }
    }

    ModuleUniverse.prototype.onReady =
      function(callback) {
        if (!this.waiting) {
          callback()
        } else {
          this.waitingForReady.push(callback)
        }
      }

    ModuleUniverse.prototype.replayRemote = function(callback) {

      var modules = this.moduleNames
      var universe = this
      this.getRemoteSource(play)

      function play(source) {
        var generator = eval("("+source+")")

        universe.baseLog = generator

        library.using(
          modules, generator
        )
        callback()
      }

    }

    ModuleUniverse.prototype.do =
      function(call) {
        var args = Array.prototype.slice.call(arguments, 1)
        var paramString = args.map(JSON.stringify).join(", ")
        var line = call+"("+paramString+")"
        this.log.push(line)
        this.persist()
      }

    ModuleUniverse.prototype.source =
      function() {
        var base = this.baseLog.toString()

        var generator = base
          .replace(
            / +\/\/ begin/,
            "  "+this.log.join("\n  ")+"\n  // begin"
          )
          .replace(
            / *}$/,
            "}"
          )

        return generator
      }

    ModuleUniverse.prototype.path =
      function() {
        return "/universes/"+this.name+"/all.js"
      }

    ModuleUniverse.prototype.persist = function() {

      var log = new Buffer(
        this.source()
      )

      console.log("\n===\nNEW LOG\n===\n"+this.source())

      s3.putBuffer(
        log,
        this.path(),
        {"Content-Type": "text/plain"},
        handleResponse
      )

      function handleResponse(error, response) {
        if (error) {
          throw new Error(error)
        }
        response.pipe(process.stdout)
      }

    }

    return ModuleUniverse
  }
)