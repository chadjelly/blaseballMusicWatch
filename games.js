document.getElementById("body").style.margin = "0px 0px 0px 0px";


// Customizable Settings
var gameBoxHeight = 150;
var infoBoxWidth = 250;
var scoreBoxWidth = 300;
var updateBoxWidth = 300;
var distBetweenBoxes = 10;
var distBetweenGames = 50;
var mainBoxesCornerRoundness = 10;
var mainBoxesBgColor = (20,20,20);

var headerMargin = 50;



// Global Variable Setup
var centerWidth = 500;
var centerHeight = 500;
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
  createCanvas(windowWidth, windowHeight);
  centerWidth = windowWidth/2;
  centerHeight = windowHeight/2;
  setBoxProperties();
  
  rectMode(CORNERS);
  textWrap(WORD);
  noStroke();
}

function windowResized() {
  createCanvas(windowWidth, windowHeight);
  centerWidth = windowWidth/2;
  centerHeight = windowHeight/2;
  setBoxProperties();
}

function draw() {
  background(0);
  fill(255);
  
  
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
      console.log(gamesOrder[i]);
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

