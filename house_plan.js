var library = require("nrtv-library")(require)

module.exports = library.export(
  "house-plan",
  function() {

    function HousePlan() {
      this.generators = []
      this.parameterSets = []
    }

    HousePlan.parts = {
      stud: {
        WIDTH: 1.25,
        DEPTH: 2.5,
      },
      plywood: {
        THICKNESS: 3/8,
      },
      trim: {
        THICKNESS: 0.75,
      },
      door: {
        WIDTH: 32,
        THICKNESS: 1.5,
        HEIGHT: 80,
      },
      batten: {
        WIDTH: 1.5,
      },
      twinWall: {
        THICKNESS: 7/16
      },
    }

    var helpers = {
      verticalSlice: verticalSlice,
      slopeToDegrees: slopeToDegrees,
      slopeToRadians: slopeToRadians,
    }



    HousePlan.prototype.generate =
      function(getHandler) {


        for(var i=0; i<this.generators.length; i++) {

          var generator = this.generators[i]

          var names = argNames(generator)

          var args = []

          names.forEach(function(name) {
            var handler = getHandler(name)
            if (!handler) {
              handler = helpers[name]
            }
            if (handler) {
              args.push(handler)
            }
          })

          args = args.concat(this.parameterSets[i])

          var boundGenerator = Function.prototype.apply.bind(generator, null, args)

          boundGenerator()
        }

      }

    function argNames(func) {
      var pattern = /^function[ a-zA-Z]*\(([a-zA-Z, ]*)/
      var argString = func.toString().match(pattern)[1]

      if (argString) {
        return argString.split(/, ?/)
      } else {
        return []
      }
    }

    HousePlan.prototype.add =
      function add(generator) {
        var parameters = []

        for(var i=1; i<arguments.length; i++) {
          parameters.push(arguments[i])
        }

        this.generators.push(generator)
        this.parameterSets.push(parameters)
      }

    function verticalSlice(thickness, slope) {
      if (!slope) {
        throw new Error("verticalSlice takes a thickness and a slope. You didn't provide a slope")
      }
      var angle = slopeToRadians(slope)
      return thickness/Math.cos(angle)
    }

    function slopeToDegrees(slope) {
      var degrees = 180*slopeToRadians(slope)/Math.PI
      return degrees
    }

    function slopeToRadians(slope) {
      return Math.atan(slope)
    }


    HousePlan.verticalSlice = verticalSlice

    return HousePlan
  }
)