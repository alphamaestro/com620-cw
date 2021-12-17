
import 'aframe';
// Reference: https://stackoverflow.com/questions/38960058/how-to-listen-to-cameras-world-position-in-a-frame
AFRAME.registerComponent('camera-logger', {

  schema: {
    timestamp: { type: 'int' },
    seconds: { type: 'int' }, // default 0
    score: { type: 'int' }
  },

  log: function () {
    var cameraEl = this.el.sceneEl.camera.el;
    var rotation = cameraEl.getAttribute('rotation');
    var worldPos = new THREE.Vector3();
    worldPos.setFromMatrixPosition(cameraEl.object3D.matrixWorld);
    console.log("Time: " + this.data.seconds
      + "; Camera Position: (" + worldPos.x.toFixed(2) + ", " + worldPos.y.toFixed(2) + ", " + worldPos.z.toFixed(2)
      + "); Camera Rotation: (" + rotation.x.toFixed(2) + ", " + rotation.y.toFixed(2) + ", " + rotation.z.toFixed(2) + ")");
  },

  play: function () {
    this.camera = document.querySelector("[camera]")
    this.treasure = document.querySelector("#treasure")

    this.data.timestamp = Date.now();
    this.data.score = 1000;
    this.gameFinished = false;
    document.getElementById("score").innerHTML = "Score: 1000";
    this.log();
  },

  tick: function () {
    let camPos = this.camera.object3D.position
    let treasurePos = this.treasure.object3D.position
    let treasureDistance = camPos.distanceTo(treasurePos)

    if (Date.now() - this.data.timestamp > 1000) {
      this.data.timestamp += 1000;
      this.data.seconds += 1;
      this.data.score -= 1;
      document.getElementById("score").innerHTML = "Score: " + this.data.score;
      this.log();
    }

    if (treasureDistance < 5 && !this.gameFinished) {
      document.querySelector("#winbox").style.display = "block";
      document.querySelector("#winbox").innerHTML = "You WIN! </br> Final Score: " + this.data.score;
      document.querySelector("#score").style.display = "none";

      this.gameFinished = true;
      setTimeout(function () {
        window.location.reload(1);
      }, 15000);
    }
  },
});

AFRAME.registerComponent('distance-detect', {

  init: function () {
    this.camera = document.querySelector("[camera]")
    this.clue2 = document.querySelector("#clue2")
    this.clue3 = document.querySelector("#clue3")
    this.treasure = document.querySelector("#treasure")
    this.logged = false;
  },
  tick: function () {
    let camPos = this.camera.object3D.position

    let clue2Pos = this.clue2.object3D.position
    let clue3Pos = this.clue3.object3D.position
    let treasurePos = this.treasure.object3D.position

    let clue2Distance = camPos.distanceTo(clue2Pos)
    let clue3Distance = camPos.distanceTo(clue3Pos)
    let treasureDistance = camPos.distanceTo(treasurePos)

    console.log("Clue 2 Distance: ", clue2Distance,
      "\nClue 3 Distance: ", clue3Distance,
      "\nTreasure Distance: ", treasureDistance);

    if (clue2Distance < 15) {
      this.clue2.object3D.visible = true;
    }

    if (clue3Distance < 15 && this.clue2.object3D.visible) {
      this.clue3.object3D.visible = true;
    }

    if (treasureDistance < 15 && this.clue3.object3D.visible) {
      this.treasure.object3D.visible = true;

    }


  }
})

AFRAME.registerComponent('compass', {
  init: function () {
    this.pointer = document.getElementById('pointer');
  },

  tick: function () {
    var yRotation = this.el.getAttribute('rotation').y;
    this.pointer.style.transform = 'rotate(' + yRotation + 'deg)';
  }
});


AFRAME.registerComponent('help', {
  init: function () {
    this.helpbox = document.getElementById("helpbox")
    this.camera = document.querySelector("[camera]")
    this.clue2 = document.querySelector("#clue2")
    this.clue3 = document.querySelector("#clue3")
    this.treasure = document.querySelector("#treasure")
    this.logged = false;
  },
  tick: function () {
    let camPos = this.camera.object3D.position

    let clue2Pos = this.clue2.object3D.position
    let clue3Pos = this.clue3.object3D.position
    let treasurePos = this.treasure.object3D.position

    let clue2Distance = camPos.distanceTo(clue2Pos)
    let clue3Distance = camPos.distanceTo(clue3Pos)
    let treasureDistance = camPos.distanceTo(treasurePos)

    this.helpbox.innerHTML = "<b>Clue 2 Distance:</b> " + clue2Distance.toFixed(2) +
      "<br /><b>Clue 3 Distance:</b> " + clue3Distance.toFixed(2) +
      "<br /><b>Treasure Distance:</b> " + treasureDistance.toFixed(2);
  }
});
