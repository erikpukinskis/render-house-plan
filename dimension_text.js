module.exports = function dimensionText(number, options) {
  var integer = Math.floor(number)
  var remainder = number - integer
  var sixteenths = Math.round(remainder*16)

  if (sixteenths == 16) {
    integer++
  } else if (sixteenths == 0) {
    // nothing
  } else if (sixteenths == 8) {
    var fraction = "1/2"
  } else if (sixteenths % 4 == 0) {
    var fraction = (sixteenths/4)+"/4"
  } else if (sixteenths % 2 == 0) {
    var fraction = (sixteenths/2)+"/8"
  } else {
    var fraction = sixteenths+"/16"
  }

  if (integer == 0 && sixteenths != 0) {
    var inches = fraction+"\""
  } else {
    var inches = integer.toString()
    if (fraction) {
      inches += "&nbsp;"+fraction
    }
    inches += "\""
  }

  var wbr = options && options.wordBreak === false ? "" : "<wbr>"

  return "<div class=\"dimension\">"+inches+"</div>"+wbr
}
