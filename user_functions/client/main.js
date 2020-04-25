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

  // // Create a new instance of the Image class
  // var img = new Image();

  // // When the image loads, set it as background image
  // img.onload = function () {
  //   var f_img = new fabric.Image(img);

  //   canvas.setBackgroundImage(f_img, canvas.renderAll.bind(canvas), {
  //     width: canvas_size / 2,
  //     height: canvas_size / 2,
  //     // Needed to position backgroundImage at 0/0
  //     originX: 'left',
  //     originY: 'top'
  //   });

  //   canvas.renderAll();
  // };


  for (var i = 0; i < json.entities.length; i++) {
    const entity = json.entities[i];
    if (entity.type == "foot-bot") {
      robots[robotCount].left = entity.position.y * SCALE + OFFSET
      robots[robotCount].top = canvas_size - entity.position.x * SCALE - OFFSET
      var color = "#" + ("" + entity.leds[0]).substr(2);

      if (robots[robotCount].fill != color) { // only on change
        robots[robotCount].fill = color;
        robots[robotCount].dirty = true;
      }

      robotCount++;
    } else if (entity.type == 'floor') {
      // img.src = entity.floor_image;
      fabric.Image.fromURL(entity.floor_image, function (img) {
        img.set({
          width: canvas_size,
          height: canvas_size,
          centeredRotation: true,
          centeredScaling: true,
          left: canvas_size / 2,
          top: canvas_size / 2,
          flipY: true,
          originX: 'center',
          originY: 'center'
        });
        img.rotate(-90);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      });
    }
  }
  // canvas.renderAll()
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
