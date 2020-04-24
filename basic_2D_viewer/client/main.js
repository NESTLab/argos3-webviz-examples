/* Connect to Webviz and get only broadcast messages */
var socket = new WebSocket("ws://localhost:3000?broadcasts");

var statusDom = document.getElementById("status");
var stateDom = document.getElementById("state");
var stepDom = document.getElementById("step");
// var logsDom = document.getElementById("logs");

socket.onopen = function (e) {
  statusDom.innerHTML = "<span class='green'>[open] Connection established</span>";
};

var send = function (json_object) {
  socket.send(JSON.stringify(json_object));
}

/* Any new message from Argos */
socket.onmessage = function (event) {
  var json = JSON.parse(event.data)

  stateDom.innerHTML = json.state
  stepDom.innerHTML = json.steps

  var robotCount = 0, boxCount = 0, cylinderCount = 0

  for (var i = 0; i < json.entities.length; i++) {
    const entity = json.entities[i];
    if (entity.type == "foot-bot") {
      robots[robotCount].left = entity.position.x * SCALE + OFFSET
      robots[robotCount].top = entity.position.y * SCALE + OFFSET
      robotCount++;

    } else if (entity.type == "cylinder") {
      cylinders[cylinderCount].left = entity.position.x * SCALE + OFFSET
      cylinders[cylinderCount].top = entity.position.y * SCALE + OFFSET
      cylinderCount++;

    } else if (entity.type == "box") {
      /* if box is not wall */
      if (entity.id.indexOf('wall') == -1) {
        /* Apply rotation */
        boxes[boxCount].rotate(2 * Math.acos(entity.orientation.w) * 180 / Math.PI)

        boxes[boxCount].left = entity.position.x * SCALE + OFFSET
        boxes[boxCount].top = entity.position.y * SCALE + OFFSET
        boxCount++;
      }
    }
  }
  canvas.renderAll()
};

socket.onclose = function (event) {
  if (event.wasClean) {
    statusDom.innerHTML = `<span class='red'>[close] Connection closed cleanly, code=${event.code} reason=${event.reason} </span>`;
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    statusDom.innerHTML = `<span class='red'>[close] Connection died</span>`;
  }
};

socket.onerror = function (error) {
  statusDom.innerHTML = `<span class='red'>[error] ${error.message}</span>`;
};



/* Responsive canvas */
function resize() {
  var canvasSizer = document.getElementById("graph_container");
  // var canvasScaleFactor = canvasSizer.offsetWidth / canvas_size;
  var width = canvasSizer.offsetWidth;
  var height = canvasSizer.offsetHeight;
  var ratio = canvas.getWidth() / canvas.getHeight();
  if ((width / height) > ratio) {
    width = height * ratio;
  } else {
    height = width / ratio;
  }
  var scale = width / canvas.getWidth();
  var zoom = canvas.getZoom();
  zoom *= scale;
  canvas.setDimensions({ width: width, height: height });
  canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0])
}

window.addEventListener('load', resize, false);
window.addEventListener('resize', resize, false);
