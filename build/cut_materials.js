function cutMaterials(step, parts) {
  parts.forEach(function(scrap) {
    var text = " - "+scrap.cut+" cut <strong>"+dimensionText(scrap.size)+"</strong> from "+scrap.material.description+" #"+scrap.material.number
    step.activity(
      element(text)
    )
  })
}
