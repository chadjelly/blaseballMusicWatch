var games = new Object;

function preload() {
  stream = new EventSource(`https://api.sibr.dev/replay/v1/replay?from=2021-05-17T16:00:08.17Z`);
  stream.addEventListener(
    "message",
    (event) => {
      games = JSON.parse(event.data).value.games.schedule;
    }
  );
}


function setup() {
  createCanvas(windowWidth, windowHeight);
}


function draw() {
  background(0);
  fill(255);
  
  if(games[0] != null) {  
    text(games[0].lastUpdate + String.fromCodePoint(games[0].homeTeamEmoji), 10, 30);
  }
}
