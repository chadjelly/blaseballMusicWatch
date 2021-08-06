let polySynth;
let mySound;


// Customizable Settings
var gameBoxHeight = 150;
var infoBoxWidth = 250;
var scoreBoxWidth = 325;
var updateBoxWidth = 300;
var distBetweenBoxes = 10;
var distBetweenGames = 50;
var mainBoxesCornerRoundness = 5;
var mainBoxesBgColor = (20,20,20);

var headerMargin = 150;
var footerMargin = 100;

var beatTrigger = 0;
var beatsPerSecond = 2;
var frame_rate = 30;

var scoreBounciness = 8;


// Global Variable Setup
var centerWidth;
var centerHeight;
var scoreBoxProperties = new Object;
var infoBoxProperties = new Object;
var updateBoxProperties = new Object;
var games = new Object;
var gamesOrder = [];
let amp1;
var soundOn = false;
var soundToggleButton;


// Essential Initial Loads
function preload() {
  stream = new EventSource(`https://api.sibr.dev/replay/v1/replay?from=2021-05-17T16:00:08.17Z`);
  stream.addEventListener(
    "message",
    (event) => {
      games = setGameOrder( JSON.parse(event.data).value.games.schedule );
    }
  );
  
  soundFormats( 'wav' );
  mySound = loadSound('https://chadjelly.github.io/blaseballMusicWatch/22.%20Overflow.wav');
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
  getAudioContext().suspend();
  polySynth = new p5.PolySynth();
  mySound.setVolume(0.6);
  mySound.play();
  mySound.setLoop(true);
  amp1 = new p5.Amplitude(0.3);
  amp1.setInput(mySound);
  amp1.smooth(true);
  
  soundToggleButton = createButton('Sound: OFF');
  soundToggleButton.position(centerWidth,headerMargin-60);
  soundToggleButton.mousePressed(toggleAudio);
  soundToggleButton.center("horizontal");
}

function windowResized() {
  resizeCanvas(windowWidth, headerMargin + footerMargin + (distBetweenGames*11)+(gameBoxHeight*12) );
  centerWidth = windowWidth/2;
  centerHeight = height/2;
  setBoxProperties();
  soundToggleButton.center("horizontal");
}

function draw() {
  background(0);
  
  for (let x=0; x < width; x++) {
    let noiseVal = noise(((cos(frameCount/beatsPerSecond/60)+1)+x+frameCount/2)*0.008, (sin(frameCount/beatsPerSecond/15)+1)*0.2);
    //noiseVal = Math.round(noiseVal*20)/20;
    stroke( noiseVal*200 - 75, (cos(frameCount/60)+1)*25 - 50, (cos(frameCount/120)+1)*100*noiseVal - 50);
    //line(x, 10+noiseVal*80, x, height);
    line(x, 0, x, height);
    //line(centerWidth, centerHeight, centerWidth+(cos((6.28*x/width)+frameCount/100)*width), centerHeight+(sin((6.28*x/width)+frameCount/100)*height));
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
    rect(infoBoxProperties.leftBorderX,infoBoxProperties.upperBorderY+((distBetweenGames+gameBoxHeight)*i),infoBoxProperties.rightBorderX,infoBoxProperties.bottomBorderY+((distBetweenGames+gameBoxHeight)*i),mainBoxesCornerRoundness);
    rect(scoreBoxProperties.leftBorderX,scoreBoxProperties.upperBorderY+((distBetweenGames+gameBoxHeight)*i),scoreBoxProperties.rightBorderX,scoreBoxProperties.bottomBorderY+((distBetweenGames+gameBoxHeight)*i),mainBoxesCornerRoundness);
    rect(updateBoxProperties.leftBorderX,updateBoxProperties.upperBorderY+((distBetweenGames+gameBoxHeight)*i),updateBoxProperties.rightBorderX,updateBoxProperties.bottomBorderY+((distBetweenGames+gameBoxHeight)*i),mainBoxesCornerRoundness);
    
    fill(30); 
    rect(updateBoxProperties.leftBorderX,updateBoxProperties.upperBorderY + ((distBetweenGames+gameBoxHeight)*i),updateBoxProperties.rightBorderX,updateBoxProperties.upperBorderY + 30 + ((distBetweenGames+gameBoxHeight)*i), mainBoxesCornerRoundness, mainBoxesCornerRoundness, 0, 0);
    rect(scoreBoxProperties.leftBorderX,scoreBoxProperties.upperBorderY + ((distBetweenGames+gameBoxHeight)*i),scoreBoxProperties.rightBorderX,scoreBoxProperties.upperBorderY + 30 + ((distBetweenGames+gameBoxHeight)*i), mainBoxesCornerRoundness, mainBoxesCornerRoundness, 0, 0);
    fill( 0, 150, 0 );
    rect(scoreBoxProperties.leftBorderX,scoreBoxProperties.upperBorderY + ((distBetweenGames+gameBoxHeight)*i),scoreBoxProperties.leftBorderX+80,scoreBoxProperties.upperBorderY + 30 + ((distBetweenGames+gameBoxHeight)*i), mainBoxesCornerRoundness, mainBoxesCornerRoundness, mainBoxesCornerRoundness, mainBoxesCornerRoundness );
    
    
    fill(255);
    
    textSize(13);
    textAlign(CENTER,CENTER);
    text( "GAME LOG", updateBoxProperties.leftBorderX + (updateBoxProperties.width/2), updateBoxProperties.upperBorderY + 15 + ((gameBoxHeight+distBetweenGames)*i) );
    
    if(games[0] != null) {
      textAlign(LEFT,CENTER);
      var inningArrow = " ▲";
      if(!games[i].topOfInning){
        inningArrow = " ▼";
      }
      text( "Live - " + (games[i].inning+1) + inningArrow, scoreBoxProperties.leftBorderX + 10, scoreBoxProperties.upperBorderY + 15 + ((gameBoxHeight+distBetweenGames)*i) );
      
      textAlign(RIGHT,CENTER);
      text( "Game " + games[i].seriesIndex + " of " + games[i].seriesLength, scoreBoxProperties.rightBorderX - 10, scoreBoxProperties.upperBorderY + 15 + ((gameBoxHeight+distBetweenGames)*i) );
      
      textAlign(LEFT,TOP);
      textSize(15);
      text( games[i].lastUpdate, updateBoxProperties.leftBorderX+10, updateBoxProperties.upperBorderY+40+((gameBoxHeight+distBetweenGames)*i), updateBoxProperties.width-20);
      
      textAlign(CENTER,CENTER);
      textSize( (amp1.getLevel() * scoreBounciness * games[i].awayScore) + 20);
      text (games[i].awayScore, scoreBoxProperties.rightBorderX-30, scoreBoxProperties.upperBorderY+63+((gameBoxHeight+distBetweenGames)*i) );
      textSize( (amp1.getLevel() * scoreBounciness * games[i].homeScore) + 20);
      text( games[i].homeScore, scoreBoxProperties.rightBorderX-30, scoreBoxProperties.upperBorderY+117+((gameBoxHeight+distBetweenGames)*i) );
      
      fill(games[i].awayTeamColor);
      circle( scoreBoxProperties.leftBorderX+40, scoreBoxProperties.upperBorderY+63+((gameBoxHeight+distBetweenGames)*i), 45 );
      fill(games[i].homeTeamColor);
      circle( scoreBoxProperties.leftBorderX+40, scoreBoxProperties.upperBorderY+117+((gameBoxHeight+distBetweenGames)*i), 45 );
      textSize( 30 );
      if(games[i].awayTeamName == "Tokyo Lift") {
        text( "🏋️‍♂️", scoreBoxProperties.leftBorderX+40, scoreBoxProperties.upperBorderY+65+((gameBoxHeight+distBetweenGames)*i) );
      } else {
        text( String.fromCodePoint(games[i].awayTeamEmoji), scoreBoxProperties.leftBorderX+40, scoreBoxProperties.upperBorderY+65+((gameBoxHeight+distBetweenGames)*i) );
      }
      if(games[i].homeTeamName == "Tokyo Lift") {
        text( "🏋️‍♂️", scoreBoxProperties.leftBorderX+40, scoreBoxProperties.upperBorderY+120+((gameBoxHeight+distBetweenGames)*i) );
      } else {
        text( String.fromCodePoint(games[i].homeTeamEmoji), scoreBoxProperties.leftBorderX+40, scoreBoxProperties.upperBorderY+120+((gameBoxHeight+distBetweenGames)*i) );
      }
      
      textAlign(LEFT,TOP);
      textSize( 20 );
      fill(games[i].awayTeamColor)
      text( games[i].awayTeamNickname, scoreBoxProperties.leftBorderX+80, scoreBoxProperties.upperBorderY+43+((gameBoxHeight+distBetweenGames)*i), scoreBoxProperties.width-150 );
      fill(games[i].homeTeamColor)
      text( games[i].homeTeamNickname, scoreBoxProperties.leftBorderX+80, scoreBoxProperties.upperBorderY+98+((gameBoxHeight+distBetweenGames)*i), scoreBoxProperties.width-130 );
      
      
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
  var gamesReset = [];
  
  if( gameUpdate[0] != null && gameUpdate[0].lastUpdate == "Play ball!" ) {
    for(var i = 0; i < 12; i++ ) {
      gamesOrder[i] = gameUpdate[i].id;
    }
    gamesReset = gameUpdate;
  }
  else if( gameUpdate[0] != null ) {
    for(var i = 0; i < 12; i++ ) {
      for(var a = 0; a < 12; a++) {
        if( gameUpdate[a].id == gamesOrder[i] ) {
          gamesReset[i] = gameUpdate[a];
        }
      }
    }
  }
  
  return gamesReset;
}

function toggleAudio() {
  if(soundOn) {
    getAudioContext().suspend();
    soundOn = false;
    soundToggleButton.html("Sound: OFF");
  } else {
    getAudioContext().resume();
    soundOn = true;
    soundToggleButton.html("Sound: ON");
  }
}

function playBeats() {
  
}







