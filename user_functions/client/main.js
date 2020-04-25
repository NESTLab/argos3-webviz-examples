//
var ctx = document.getElementById('chart');
var myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    datasets: [{
      label: "Walking Footbots",
      borderWidth: 1,
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75,192,192,1)",
      data: [],
      hoverBackgroundColor: "rgba(75,192,192,0.7)",
    },
    {
      label: "Resting Footbots",
      borderWidth: 1,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      data: [],
      hoverBackgroundColor: 'rgba(255, 99, 132, 0.6)',
    }]
  },
  options: {
    tooltips: {
      mode: 'index',
      axis: 'y'
    },
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      xAxes: [{
        stacked: true,
        scaleLabel: {
          display: true,
          labelString: 'steps'
        }
      }],
      yAxes: [{
        stacked: true,
        ticks: {
          suggestedMax: 20,
          suggestedMin: 0,
          stepSize: 1
        },
        scaleLabel: {
          display: true,
          labelString: 'no. of footbots'
        },
        position: 'left'
      }, {
        stacked: true,
        ticks: {
          suggestedMax: 20,
          suggestedMin: 0,
          stepSize: 1,
          reverse: true
        },
        scaleLabel: {
          display: true,
          labelString: 'no. of footbots'
        },
        position: 'right'
      }]
    },
    animation: {
      duration: 0 // general animation time
    },
    hover: {
      animationDuration: 0 // duration of animations when hovering an item
    },
    responsiveAnimationDuration: 0 // animation duration after a resize
  }
});


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

var oldGraphStep = 0;

/* Any new message from Argos */
socket.onmessage = function (event) {
  var json = JSON.parse(event.data)

  if (json.extra_data) {

    /* Only draw graph if step changes */

    if (oldGraphStep != json.extra_data.step) {
      /* Only keep 15 recent entries */
      if (myChart.data.labels.length > 15) {
        myChart.data.labels.shift();
        myChart.data.datasets[0].data.shift();

        myChart.data.datasets[1].data.shift();
      }
      myChart.data.labels.push(json.extra_data.step);
      myChart.data.datasets[0].data.push(json.extra_data.walking_fb);
      myChart.data.datasets[1].data.push(json.extra_data.resting_fb);
      myChart.update();

      oldGraphStep = json.extra_data.step
    }
  }
  stateDom.innerHTML = json.state
  stepDom.innerHTML = json.steps

  var robotCount = 0

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
  var canvasSizer = document.getElementById("ui_2d_canvas_container");
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
