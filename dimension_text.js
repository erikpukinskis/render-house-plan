module.exports = function dimensionText(number) {
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

  if (integer == 0 && sixteenths != 0) {
    text = text+"\""
  } else {
    text = integer.toString()+"\""+text
  }

  return "<strong>"+text+"</strong>"
}
