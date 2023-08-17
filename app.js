const canvasID = document.querySelector("#drawbox");
const allDragElements = document.querySelectorAll(".elements > div");
const fabricCanvas = new fabric.Canvas("drawbox");
let activeObject;
fabricCanvas.setDimensions({ width: 400, height: 700 });
// fabricCanvas.on('mouse:down', function(options) {
//   console.log(options.e.clientX, options.e.clientY);
// });

function typeText() {
  const textInput = document.querySelector("#typeText .type-text");
  textInput.value = activeObject.text;

  const updateTextEvent = (e) => {
    console.log(e.target.value);
    activeObject.set("text", e.target.value);
    fabricCanvas.renderAll();
  };
  textInput.addEventListener("input", updateTextEvent);
}

function typeBar() {
  const textInput = document.querySelector("#typeBar .type-text");
  textInput.value = activeObject.textBar;
  const svgContainer = document.querySelector("#updateBarCode");
  const updateTextEvent = (e) => {
    const value = e.target.value.toString();
    JsBarcode("#updateBarCode", value.toString(), {
      format: "EAN13",
      textMargin: 0,
      fontOptions: "bold"
    })
    var serializer = new XMLSerializer();
    var svgStr = serializer.serializeToString(svgContainer);
    fabric.loadSVGFromString(svgStr, function (objects, options) {
      var obj = fabric.util.groupSVGElements(objects, options);
      obj.set({
        left: activeObject.left,
        top: activeObject.top,
        textBar: '123456789012',
        typeBar: 'barCode'
      });
      fabricCanvas.remove(activeObject);
      fabricCanvas.add(obj);
      fabricCanvas.setActiveObject(obj);
      fabricCanvas.renderAll()
    });
  };
  textInput.addEventListener("input", updateTextEvent);
}

fabricCanvas.on("selection:created", function (option) {
  activeObject = fabricCanvas.getActiveObject();
  console.log("select", activeObject);
  console.log("select - type", activeObject.type);
  if (activeObject.type === "text") {
    typeText();
    return;
  }

  if (activeObject?.typeBar === "barCode") {
    typeBar();
    return;
  }
});

function addText(event) {
  var text = new fabric.Textbox("hello world", {
    fontFamily: "Comic Sans",
    left: event.offsetX,
    top: event.offsetY,
  });
  fabricCanvas.add(text);
}

function addBar(event) {
  const svgDefaultString = document.querySelector("#barcode");
  var serializer = new XMLSerializer();
  var svgStr = serializer.serializeToString(svgDefaultString);
  fabric.loadSVGFromString(svgStr, function (objects, options) {
    var obj = fabric.util.groupSVGElements(objects, options);
    obj.set({
      left: event.offsetX,
      top: event.offsetY,
      textBar: '123456789012',
      typeBar: 'barCode'
    });
    fabricCanvas.add(obj);
  });
}

function onDropCanvas(event) {
  const type = event.dataTransfer.getData("type");
  if (type === "text") {
    addText(event);
    return;
  }

  if (type === "barCode") {
    addBar(event);
    return;
  }
}

function onDragover(event) {
  event.preventDefault();
}
canvasID.addEventListener("drop", onDropCanvas);
fabricCanvas.on("drop", function (option) {
  onDropCanvas(option.e);
});
canvasID.addEventListener("dragover", onDragover);

function onDragStart(event) {
  event.dataTransfer.setData("type", event.target.dataset.type);
}
allDragElements.forEach(function (elements) {
  elements.addEventListener("dragstart", onDragStart);
});
