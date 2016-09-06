var step = (function() {
  var lastStepRendered = 0
  var currentStep = 0
  var container

  var stepButton = element.template(
    "button.next-button",
    element.style({
      "padding": "4px 12px 6px 12px",
      "background": "transparent",
      "border": "1px solid #7fc",
      "border-radius": "2px",
      "font-size": "1em",
      "color": "#7fe",
      "margin-top": "12pt",
      "margin-right": "12pt",
      "cursor": "pointer",
    }),
    function(label, stepNumber, color) {
      this.addChild(label)
      var next = functionCall("step.advance").withArgs(stepNumber)
      this.onclick(next.evalable())
      if (color) {
        this.appendStyles({
          "color": color,
          "border-color": color,
        })
      }
    }
  )

  function advance(toStep) {
    var target = document.querySelector(".step-"+(toStep))

    if (!target) { return }

    document.querySelector(".step-"+currentStep).style.display = "none"

    target.style.display = "block"

    currentStep = toStep
  }

  function step(text, generator) {
    var stepNumber = lastStepRendered = lastStepRendered + 1

    container = element(".step", 
      element(
        ".step-title",
        stepNumber+". "+text
      )
    )

    container.classes.push("step-"+stepNumber)

    generator && generator()

    if (currentStep && stepNumber != currentStep) {
      container.appendStyles({display: "none"})
    } else {
      currentStep = stepNumber
    }

    container.addChild(
      element(".buttons", [
        stepButton("<", stepNumber-1, "#04f"),
        stepButton("Next >", stepNumber+1)
      ])
    )

    addHtml(container.html())

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

  var instruction = element.template(
    ".instruction",
    element.style({
      "margin-top": "12pt",
    }),
    function(text) {
      this.addChild(text)
    }
  )

  // Instruction helpers

  function addInstruction(text) {
    container.addChild(instruction(text))
  }

  function diagram(view, scraps) {
    var el = diagramContainer()
    plan.drawScraps(scraps, view, el)
    container.addChild(el)
    return el
  }

  var diagramContainer = element.template(
    ".diagram-container",
    element.style({
      "font-size": "0.1em",
      "position": "relative",
      "background": "#eef",
      "border": "2em solid #eef",
    }),
    function() {
      this.html()
      this.appendStyles({
        width: 48+"em",
        height: 72+"em",
      })
    }
  )


  function addChalkLine(orientation, diagramEl, distance) {

    el = chalk({top: distance+"em"})

    diagramEl.addChild(el)

    return diagramEl
  }

  var chalk = element.template(
    ".chalk-line",
    element.style({
      "position": "absolute",
      "border": "1px solid #f88",
    }),
    function(options) {
      if (typeof options.top != "undefined") {
        options.width = "100%"
      }
      this.appendStyles(options)
    }
  )



  var body = element.style("body", {
    "font-family": "sans-serif",
    "line-height": "1.5em",
    "font-size": "1.15em",
    "color": "#def",
    "background": "#48e",
    "-webkit-font-smoothing": "antialiased",
  })

  var em = element.style("strong", {
    "font-weight": "bold",
    "border": "1px solid #bef",
    "color": "#dff",
    "padding": "1px 3px 0px 3px",
    "font-size": "1.15em",
    "line-height": "1em",
    "display": "inline-block",
  })

  var buttons = element.style(".buttons", {
    // "position": "absolute",
    // "top": "400px",
  })

  function activity(text) {
    container.addChild(
      element(text)
    )
  }

  function diagram(view, scraps) {
    var el = diagramContainer()
    plan.drawScraps(scraps, view, el)
    container.addChild(el)
    container.html()
    return el
  }


  addHtml(element.stylesheet(
    body,
    em,
    diagramContainer,
    stepTitle,
    stepButton,
    buttons,
    instruction,
    chalk
  ).html())

  step.instruction = addInstruction
  step.advance = advance
  step.activity = activity

  return step
})()