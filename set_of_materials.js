var library = require("nrtv-library")(require)

module.exports = library.export(
  "set-of-materials",
  ["./some_materials"],
  function(BASE_MATERIALS) {
    function SetOfMaterials() {
      this.byDescription = {}
      this.scrapsByName = {}
      this.scrapsByQuery = {}
      this.get = get.bind(this)
    }

    SetOfMaterials.prototype.groupedByDescription = function() {
        return this.byDescription
      }

    function ofKind(description, set) {
      var group = set.byDescription[description]

      if (!group) {
        group = set.byDescription[description] = []
      }

      return group
    }

    SetOfMaterials.prototype.reserveBulk =
      function(description, quantity, name) {

        var group = ofKind(description, this)

        var material = {
          name: name,
          quantity: quantity,
          bulk: true
        }

        // PERSIST
        group.push(material)

        return material
      }

    SetOfMaterials.prototype.reserve =
      function(description, cut, size) {

        var group = ofKind(description, this)

        for(var i=0; i<group.length; i++) {
          var material = group[i]

          if (material.cut != cut) {
            continue
          }

          if (cut == "rip" && material.width >= size) {
            return material
          } else if (cut == "cross" && material.length >= size) {
            return material
          }
        }

        var base = BASE_MATERIALS[description]

        if (!base) {
          throw new Error("Add "+description+" to base materials")
        }

        material = merge(base, {
          parts: [],
          cutLengths: [],
          description: description,
          number: group.length + 1
        })

        // PERSIST

        group.push(material)

        return material
      }

    function getWildcard(set, query) {
      if (set.prefix) {
        query = set.prefix+"-"+query
      }
      pattern = "^"+query.replace("*", ".+")+"$"
      var scraps = set.scrapsByQuery[query]
      if (scraps) { return scraps }

      var scraps = []
      for (var name in set.scrapsByName) {
        var isMatch = !!name.match(pattern)
        if (isMatch) {
          scraps.push(set.scrapsByName[name])
        }
      }
      set.scrapsByQuery[query] = scraps
      return scraps
    }

    // This gets bound as setOfMaterials.get in the constructor:
    function get(name) {
      if (this.prefix) {
        name = this.prefix+"-"+name
      }

      var scrap = this.scrapsByName[name]
      if (!scrap) {
        throw new Error("no scraps named "+name)
      }
      return scrap
    }

    SetOfMaterials.prototype.list =
      function() {
        var names = Array.prototype.slice.call(arguments)

        var list = []

        for(var i=0; i<names.length; i++) {
          var name = names[i]
          var hasWildcard = !!name.match(/\*/)

          if (hasWildcard) {
            var matches = getWildcard(this, name)
            list = list.concat(matches)
          } else {
            var scrap = this.get(name)
            list.push(scrap)
          }
        }

        return list
      }

    SetOfMaterials.prototype.setPrefix =function(newPrefix) {
        this.prefix = newPrefix
      }

    SetOfMaterials.prototype.cut =
      function(material, cut, size, options) {
        var name = options.name

        if (material.cut && cut != material.cut) {
          throw new Error("trying to cut material the wrong way")
        }

        var constraint = cut == "cross" ? "length" : "width"

        if (material[constraint] < size) {
          throw new Error("not enough material")
        }

        var scrap = {
          cut: cut,
          name: name,
          material: material,
          size: size,
          destination: toDestination(options)
        }
        if (!name) {
          console.log(scrap)
          throw new Error("every scrap needs a name")
        }

        // scrap[constraint] = size

        // PERSIST
        material[constraint] = material[constraint] - size - 1/8
        material.cut = cut
        material.parts.push(name)
        material.cutLengths.push(size)

        // PERSIST
        this.scrapsByName[name] = scrap

        return scrap

      }

    function toDestination(options) {
      var destination = {}

      ;["xPos", "xSize", "yPos", "ySize", "zPos", "zSize"].forEach(function(key) {
        destination[key] = options[key] || 0
      })

      return destination
    }

    function merge(obj1,obj2){
      var obj3 = {};
      for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
      for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
      return obj3;
    }
    return SetOfMaterials
  }
)
