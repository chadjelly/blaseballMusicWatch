let polySynth;


// Customizable Settings
var gameBoxHeight = 150;
var infoBoxWidth = 250;
var scoreBoxWidth = 300;
var updateBoxWidth = 300;
var distBetweenBoxes = 10;
var distBetweenGames = 50;
var mainBoxesCornerRoundness = 10;
var mainBoxesBgColor = (20,20,20);

var headerMargin = 100;
var footerMargin = 100;

var beatTrigger = 0;
var beatsPerSecond = 2;
var frame_rate = 30;



// Global Variable Setup
var centerWidth;
var centerHeight;
var scoreBoxProperties = new Object;
var infoBoxProperties = new Object;
var updateBoxProperties = new Object;
var games = new Object;
var gamesOrder = [];


// Essential Initial Loads
function preload() {
  stream = new EventSource(`https://api.sibr.dev/replay/v1/replay?from=2021-05-17T16:00:08.17Z`);
  stream.addEventListener(
    "message",
    (event) => {
      games = setGameOrder( JSON.parse(event.data).value.games.schedule );
    }
  );
}

// Setup Canvas & Set Global Variables Values
function setup() {
  createCanvas(windowWidth, headerMargin + footerMargin + (distBetweenGames*11)+(gameBoxHeight*12) );
  centerWidth = windowWidth/2;
  centerHeight = height/2;
  setBoxProperties();
  
  rectMode(CORNERS);
  textWrap(WORD);
  noStroke();
  
  frameRate(30);
  
  // Music Stuff
  polySynth = new p5.PolySynth();
}

function windowResized() {
  createCanvas(windowWidth, headerMargin + footerMargin + (distBetweenGames*11)+(gameBoxHeight*12) );
  centerWidth = windowWidth/2;
  centerHeight = height/2;
  setBoxProperties();
}

function draw() {
  background(0);
  
  for (let x=0; x < width; x++) {
    let noiseVal = noise(((cos(frameCount/beatsPerSecond/60)+1)+x+frameCount/2)*0.008, (sin(frameCount/beatsPerSecond/15)+1)*0.2);
    stroke( noiseVal*200 - 75, (cos(frameCount/60)+1)*25 - 50, (cos(frameCount/120)+1)*100*noiseVal - 50);
    //line(x, 10+noiseVal*80, x, height);
    line(x, 0, x, height);
  }
  noStroke();
  
  var seconds = ((frameCount+frame_rate)/frame_rate) - 1;
  beatTrigger++;
  if( beatTrigger >= frame_rate/beatsPerSecond ) {
    playBeats();
    beatTrigger = 0;
  }
  
  for( var i = 0; i < 12; i++ ) {
  fill(mainBoxesBgColor);
    rect(infoBoxProperties.leftBorderX,infoBoxProperties.upperBorderY + ((distBetweenGames+gameBoxHeight)*i),infoBoxProperties.rightBorderX,infoBoxProperties.bottomBorderY + ((distBetweenGames+gameBoxHeight)*i), mainBoxesCornerRoundness);
    rect(scoreBoxProperties.leftBorderX,scoreBoxProperties.upperBorderY + ((distBetweenGames+gameBoxHeight)*i),scoreBoxProperties.rightBorderX,scoreBoxProperties.bottomBorderY + ((distBetweenGames+gameBoxHeight)*i), mainBoxesCornerRoundness);
    rect(updateBoxProperties.leftBorderX,updateBoxProperties.upperBorderY + ((distBetweenGames+gameBoxHeight)*i),updateBoxProperties.rightBorderX,updateBoxProperties.bottomBorderY + ((distBetweenGames+gameBoxHeight)*i), mainBoxesCornerRoundness);
    
    fill(30); 
    rect(updateBoxProperties.leftBorderX,updateBoxProperties.upperBorderY + ((distBetweenGames+gameBoxHeight)*i),updateBoxProperties.rightBorderX,updateBoxProperties.upperBorderY + 30 + ((distBetweenGames+gameBoxHeight)*i), mainBoxesCornerRoundness, mainBoxesCornerRoundness, 0, 0);
    
    
    fill(255);
    
    textSize(12);
    textAlign(CENTER,CENTER);
    text("GAME LOG", updateBoxProperties.leftBorderX + (updateBoxProperties.width/2), updateBoxProperties.upperBorderY + 15 + ((gameBoxHeight+distBetweenGames)*i));
    
    textAlign(LEFT,TOP);
    if(games[0] != null) {
      textSize(15);
      text(games[i].lastUpdate + " " +String.fromCodePoint(games[i].homeTeamEmoji), updateBoxProperties.leftBorderX + 10, updateBoxProperties.upperBorderY + 40 + ((gameBoxHeight+distBetweenGames)*i), updateBoxProperties.width-20);
    }
  }
}

function setBoxProperties() {
  infoBoxProperties = {
    "width" : infoBoxWidth,
    "height" : gameBoxHeight,
    "leftBorderX" : centerWidth - infoBoxWidth/2,
    "rightBorderX" : centerWidth + infoBoxWidth/2,
    "upperBorderY" : headerMargin,
    "bottomBorderY" : headerMargin + gameBoxHeight
  };
  scoreBoxProperties = {
    "width" : scoreBoxWidth,
    "height" : gameBoxHeight,
    "leftBorderX" : centerWidth - infoBoxWidth/2 - distBetweenBoxes - scoreBoxWidth,
    "rightBorderX" : centerWidth - infoBoxWidth/2 - distBetweenBoxes,
    "upperBorderY" : headerMargin,
    "bottomBorderY" : headerMargin + gameBoxHeight
  };
  updateBoxProperties = {
    "width" : updateBoxWidth,
    "height" : gameBoxHeight,
    "leftBorderX" : centerWidth + infoBoxWidth/2 + distBetweenBoxes,
    "rightBorderX" : centerWidth + infoBoxWidth/2 + distBetweenBoxes + updateBoxWidth,
    "upperBorderY" : headerMargin,
    "bottomBorderY" : headerMargin + gameBoxHeight
  };
}

function setGameOrder(gameUpdate) {
  var gamesReset = gameUpdate;
  
  if( gameUpdate[0] != null && gameUpdate[0].lastUpdate == "Play ball!" ) {
    for(var i = 0; i < 12; i++ ) {
      gamesOrder[i] = gameUpdate[i].awayTeam;
    }
  }
  else if( gameUpdate[0] != null ) {
    for(var i = 0; i < 12; i++ ) {
      for(var a = 0; a < 12; a++) {
        if( gameUpdate[a].awayTeam == gamesOrder[i] ) {
          gamesReset.splice( i, 1, gameUpdate[a] );
          a = 12;
        }
      }
    }
  }
  
  return gamesReset;
}


function playBeats() {
  
}







