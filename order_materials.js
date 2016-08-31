var orderMaterials = (function() {

  function orderMaterials(materialSets) {

    var grandSubtotal = 0

    for(var description in materialSets) {
      var set = materialSets[description]

      if (set.bulk) {
        describeBulk(set)
        continue
      }

      var els = []
      var ct = 1
      for(var i=0; i<set.length; i++) {
        var item = set[i]

        if (item.description == "door") {
          els.push(element(" ("+ct+") "+item.parts[0]))
        } else {
          var cutPlan = element(
            " ("+ct+") "+cutPlanText(item)
          )
          els.push(cutPlan)
        }

        ct++
      }

      var material = allocateMaterials.BASE_MATERIALS[description]
      var count = els.length + (material.extra || 0)
      var price = material.price

      var subtotal = count * price
      grandSubtotal += subtotal

      var header = description+": "+els.length+" CT "
      if (material.extra) {
        header += "+"+material.extra+" "
      }
      header += "@$"+toDollarString(price)+" = $"+toDollarString(subtotal)


      addHtml(element(element.raw("<br/>")).html())
      addHtml(
        element(header).html()
      )
      addHtml(element(els).html())
    }


    function describeBulk(set) {

      var set = bulkMaterialSets[description]
      var material = allocateMaterials.BASE_MATERIALS[description]
      var totalQuantity = 0
      var els = []
      var ct = 1

      for(var i=0; i<set.length; i++) {
        var quantity = set[i].quantity
        var name = set[i].name

        totalQuantity = totalQuantity + quantity

        els.push(element(
          " ("+ct+") "+name+" ("+quantity+" "+material.unit+")"
        ))

        ct++
      }

      var subtotal = Math.ceil(totalQuantity * material.price)
      addHtml(element(element.raw("<br/>")).html())
      addHtml(
        element(description+": "+totalQuantity+" "+material.unit+" @$"+toDollarString(material.price)+" = $"+toDollarString(subtotal)).html()
      )
      addHtml(element(els).html())

    }

    var extras = [
      {name: "liquid nails", unit: " tubes", price: 250, quantity: 4},
      {name: "screws", unit: "lb", price: 650, quantity: 4},
      {name: "side flange", unit: "CT", price: 277, quantity: 8},
      {name: "4ft aluminum tube", unit: "x", price: 1350, quantity: 4},
      {name: "weatherproof inlet", unit: "x", price: 1800, quantity: 1},
      {name: "cord", unit: " roll", price: 500, quantity: 1},
      {name: "GFCI outlet", unit: "x", price: 2000, quantity: 2},
      {name: "wiring box", unit: "x", price: 500, quantity: 2},
      {name: "wire", unit: "100ft", price: 50, quantity: 1},
      {name: "concealed door hinge", unit: "x", price: 2000, quantity: 6},
      {name: "floor vent", unit: "x", price: 500, quantity: 2},
      {name: "lumber crayons", unit: "x", price: 100, quantity: 2},
    ]


    var els = []
    var extrasSubtotal = 0

    for(var i=0; i<extras.length; i++) {
      var extra = extras[i]

      var cost = extra.quantity * extra.price
      extrasSubtotal += cost

      els.push(element(
        extra.name+": "+extra.quantity+extra.unit+" @$"+toDollarString(extra.price)+" = $"+toDollarString(cost)
      ))
    }

    addHtml(element(element.raw("<br/>EXTRAS: $"+toDollarString(extrasSubtotal))).html())

    addHtml(element(els).html())

    var subtotal = grandSubtotal+extrasSubtotal
    var TAX_RATE = 0.095
    var salesTax = subtotal*TAX_RATE
    var total = subtotal + salesTax

    addHtml(
      "<br/>SUBTOTAL: $"+toDollarString(subtotal)+
      "<br/>TAX: $"+toDollarString(salesTax)+
      "<br/>GRAND TOTAL: $"+toDollarString(total)+"<br><br>"
    )


  }




  function cutPlanText(item) {
    var text = ""

    if (!item.parts) {return false}

    for(var i=0; i<item.parts.length; i++) {
      if (i > 0) {
        text = text + " PLUS "
      }
      var name = item.parts[i]
      if (name) {
        text = text + item.parts[i] + " ("+dimensionText(item.cutLengths[i])+" "+item.cut+")"
      } else {
        text = text + dimensionText(item.cutLengths[i])
      }
    }

    return text
  }

  function dimensionText(number) {
    var integer = Math.floor(number)
    var remainder = number - integer
    var sixteenths = Math.round(remainder*16)

    if (sixteenths == 16) {
      integer++
      var text = ""
    } else if (sixteenths == 0) {
      var text = ""
    } else if (sixteenths == 8) {
      var text = " 1/2"
    } else if (sixteenths % 4 == 0) {
      var text = " "+(sixteenths/4)+"/4"
    } else if (sixteenths % 2 == 0) {
      var text = " "+(sixteenths/2)+"/8"
    } else {
      var text = " "+sixteenths+"/16"
    }

    text = integer.toString()+"\""+text

    return text
  }

  function toDollarString(cents) {

    cents = Math.ceil(cents)

    var dollars = Math.floor(cents / 100)
    var remainder = cents - dollars*100
    if (remainder < 10) {
      remainder = "0"+remainder
    }

    return dollars+"."+remainder
  }

  return orderMaterials
})()