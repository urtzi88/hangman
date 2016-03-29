//GLOBAL VARIABLES
function Player(name){
	this.name = name;
	this.guesses = [];
}

function Game(word){
	this.word = word;
	this.opportunities = 6;
	this.multiP = true;
	this.wordCount = [];
	this.win = false;
	this.hangCounter = 1;
}

var Animal = function(){

}

game.prototype.play = function (guess){
	if(this.opportunities > 0 && !this.win){
		if(this.word.toString().includes(guess)){
			game1.guess_right(guess);
		} else {
			game1.guess_wrong(guess);
		}
	}
}

game.prototype.guess_right = function(guess){
	document.getElementById(guess).classList.remove("disabled");
	document.getElementById(guess).classList.add("right");
	for(var i = 0; i < game1.word.length; i++){
		if(this.word[i] === guess){
			display(guess, i);
			displayScore();
			this.wordCount.pop();
			if(this.wordCount.length === 1){
				win = true;
				displayWin();
				removeCookieData();
			}
		}
	}
}

game.prototype.guess_wrong = function(guess){
	this.opportunities -= 1;
	if(this.opportunities === 0){
		displaySolution();
	}
	displayScore();
	var image = "hang" + this.hangCounter;
	document.getElementById(image).classList.remove("invisible");
	this.hangCounter += 1;
	document.getElementById(guess).classList.remove("disabled");
	document.getElementById(guess).classList.add("wrong");
}

//GET RANDOM WORD FROM TEXT FILE
function FileHelper()
{}
{
    FileHelper.readStringFromFileAtPath = function(pathOfFileToReadFrom)
    {
        var request = new XMLHttpRequest();
        request.open("GET", pathOfFileToReadFrom, false);
        request.send(null);
        var returnValue = request.responseText;

        return returnValue;
    }
}

var text = FileHelper.readStringFromFileAtPath( "dictionary.txt" );
var words = text.split("\n");
var random = Math.floor((Math.random() * words.length) + 1);
var secretword = words[random].toUpperCase();

//SAVE AND LOAD GAME
function saveGame(){
	document.cookie = "player1=" + player1.name;
	document.cookie = "word=" + game1.word;
	document.cookie = "opportunities=" + game1.opportunities;
	document.cookie = "guesses=" + player1.guesses;
	document.cookie = "wordCount=" + game1.wordCount;
	document.cookie = "hangCounter=" + game1.hangCounter;
	document.cookie = "multiP =" + game1.multiP;
	document.cookie = "player2=" + player2.name;
}

function loadGameData(){
	var cookie = document.cookie;
	var cookieArray = cookie.split(";");
	var cP1Name = cookieArray[0].substring(8,100);
	var cWord = cookieArray[1].substring(6,100);
	var cOpportunities = cookieArray[2].substring(15,100);
	var cGuesses = cookieArray[3].substring(9,100);
	var cWordCount = cookieArray[4].substring(11,100);
	var cHangCounter = cookieArray[5].substring(13,100);
	var cMultiP = cookieArray[6].substring(9,100);
	var cP2Name = cookieArray[7].substring(9,100);
	if(cP1Name === "" || cWord === "" || cOpportunities === "" || cGuesses ==="" || cWordCount === "" || cHangCounter === ""){
		alert("No previous game found :(");
	}else{
		loadGame(cP1Name,cP2Name,cWord,cOpportunities,cGuesses,cWordCount,cHangCounter,cMultiP);
	}
}

function loadGame(cP1Name,cP2Name,cWord,cOpportunities,cGuesses,cWordCount,cHangCounter,cMultiP){
	player1 = new player(cP1Name);
	player2 = new player(cP2Name);
	game1 = new game(cWord.split(','));
	game1.opportunities = parseInt(cOpportunities);
	player1.guesses = cGuesses.split(',');
	game1.wordCount = cWordCount.split(',');
	game1.hangCounter = parseInt(cHangCounter);
	game1.multiP = cMultiP;
	loadDisplay();
}

function removeCookieData(){
	document.cookie = "player1=";
	document.cookie = "word=";
	document.cookie = "opportunities=";
	document.cookie = "guesses=";
	document.cookie = "wordCount=";
	document.cookie = "hangCounter=";
	document.cookie = "multiP=";
	document.cookie = "player2=";
}

//DISPLAY FUNCTIONS
function initializeDisplay(){
	hydeInitialScreen();
	document.getElementById("keyboard").classList.remove("invisible");
	game1.wordCount = game1.word.toString();
	game1.wordCount = game1.wordCount.split(',');
	game1.wordCount.push("Win");
	showWord();
	wordSize();
	var score = player1.name + ', you have ' + game1.opportunities + ' opportunities to guess the word.';
	document.querySelector('#score p').innerHTML = score;
}

function display(guess, index){
	var selector = '#word li:nth-child('+ (index + 1) +')'
	var letter = document.querySelector(selector);
	letter.innerHTML = guess;
}

function displayScore(){
	if(game1.opportunities > 0){
		var score = player1.name + ', you have ' + game1.opportunities + ' opportunities left.';
		document.querySelector('#score p').innerHTML = score;
	} else {
		var score = player1.name + ', you have lost against ' + player2.name;
		document.getElementById("scoreText").innerHTML = score;
		document.getElementById("startAgain").classList.remove("invisible");
		document.getElementById("startAgain").classList.add("visible");
	}
}

function displayWin(){
	var score = 'Congratulations ' + player1.name + '! You have won against ' + player2.name + '!!!';
	document.getElementById("scoreText").innerHTML = score;
	document.getElementById("startAgain").classList.remove("invisible");
	document.getElementById("startAgain").classList.add("visible");
	hydeLoadSave();
}

function displaySolution(){
	showWord();
	hydeLoadSave();
}

function loadDisplay(){
	hydeInitialScreen();
	disableKeyboard();
	keyClassesLoad();
	removeWord();
	showWord();
	wordSize();
	hydeHangman();
	restoreHangman();
	var score = player1.name + ', you have ' + game1.opportunities + ' opportunities left to guess the word.';
	document.querySelector('#score p').innerHTML = score;
}

//INITIAL SCREEN FUNCTIONS
function hydeInitialScreen(){
	document.getElementById("startForm").classList.add("invisible");
	document.getElementById("startFormSingle").classList.add("invisible");
	document.getElementById("container").classList.remove("invisible");
}

//SECRETWORD FUNCTIONS
function showWord(){
	if(player1.guesses === []){
		showWord_newGame();
	}else if(game1.opportunities > 0){
		showWord_loadGame();
	}else{
		showWord_lostGame();
	}
}

function showWord_newGame(){
	for(var i = 0; i < game1.word.length; i++){
		var hiddenWordP = document.createElement("LI");
		var hiddenWordSpaces = document.createTextNode('_');
		hiddenWordP.appendChild(hiddenWordSpaces);
		document.getElementById('word').appendChild(hiddenWordP);
	}
}

function showWord_loadGame(){
	for(var i = 0; i < game1.word.length; i++){
		var hiddenWordP = document.createElement("LI");
		if(player1.guesses.toString().includes(game1.word[i])){
			var hiddenWordSpaces = document.createTextNode(game1.word[i]);
		}else{ 
			var hiddenWordSpaces = document.createTextNode('_');
		}
		hiddenWordP.appendChild(hiddenWordSpaces);
		document.getElementById('word').appendChild(hiddenWordP);
	}
}

function showWord_lostGame(){
	for(var i = 0; i < game1.word.length; i++){
		if(player1.guesses.toString().includes(game1.word[i]) === false){
			var selector = '#word li:nth-child('+ (i + 1) +')';
			var letter = document.querySelector(selector);
			letter.innerHTML = game1.word[i];
			letter.classList.add("notGuessed");
		}
	}
}

function removeWord(){
	if(document.querySelector("#word li") != null){
		var amountOfLI = document.getElementById("word").children.length
		for(var i = 0; i <= amountOfLI; i++){
			if(document.getElementById("word").firstChild != null){
				document.getElementById("word").firstChild.remove();
			}
		}
	}
}

function wordSize(){
	var amountOfLetters = game1.word.length;
	if(amountOfLetters > 14){
		wordSize_classes("xxsmall", "xsmall", "small", "big", 25, amountOfLetters);
	}else if(amountOfLetters > 10){
		wordSize_classes("xsmall", "xxsmall", "small", "big", 35, amountOfLetters);
	}else if(amountOfLetters > 6){
		wordSize_classes("small", "xxsmall", "xsmall", "big", 50, amountOfLetters);
	}else{
		wordSize_classes("big", "xxsmall", "xsmall", "small", 90, amountOfLetters);
	}
	var styleWidth = divWidth + "px";
	document.getElementById("wordWrapper").style.width = styleWidth;
	document.getElementById("hang").classList.remove("invisible");
}

function wordSize_classes(classAdd, rm1, rm2, rm3, width, amountOfLetters){
	for(var i = 1; i <= amountOfLetters; i++){
		document.querySelector("#word li:nth-child(" + i + ")").classList.add(classAdd);
		document.querySelector("#word li:nth-child(" + i + ")").classList.remove(rm1);
		document.querySelector("#word li:nth-child(" + i + ")").classList.remove(rm2);
		document.querySelector("#word li:nth-child(" + i + ")").classList.remove(rm3);
		divWidth = width*amountOfLetters;
	}
}

//KEYBOARD FUNCTIONS
function disableKeyboard(){
	for(var i = 65; i < 91; i++){
		var id = String.fromCharCode(i);
		document.getElementById(id).classList.remove("wrong");
		document.getElementById(id).classList.remove("right");
		document.getElementById(id).classList.add("disabled");
	}
}

function keyClassesLoad(){
	document.getElementById("keyboard").classList.remove("invisible");
	for(var i = 0; i < player1.guesses.length; i++){
		if(game1.word.toString().includes(player1.guesses[i]) === true){
			document.getElementById(player1.guesses[i]).classList.add("right");
		}else{
			document.getElementById(player1.guesses[i]).classList.add("wrong");
		}
	}
}

//HANGMAN FUNCTIONS
function hydeHangman(){
	for(var i = 1; i <= 6; i++){
		var image = "hang" + i;
		document.getElementById(image).classList.add("invisible");
	}
}

function restoreHangman(){
	document.getElementById("hang").classList.remove("invisible");
	var restoreHang = game1.hangCounter - 1;
	for(var i = restoreHang; i > 0; i--){
		var image = "hang" + i;
		document.getElementById(image).classList.remove("invisible");
	}
}

//BUTTONS FUNCTIONS
function hydeLoadSave(){
	document.getElementById("load").style.display = "none";
	document.getElementById("save").style.display = "none";
}

///////////////////////////////////////////////////////
/////////////////EVENT LISTENERS///////////////////////
///////////////////////////////////////////////////////
//CHOOSE SINGLE OR MULTI PLAYER
document.getElementById("multiPlayer").addEventListener("click", function(){
	multip = true;
	document.getElementById("startForm").classList.remove("invisible");
	document.getElementById("choosePlayers").classList.add("invisible");
});

document.getElementById("singlePlayer").addEventListener("click", function(){
	multip = false;
	document.getElementById("startFormSingle").classList.remove("invisible");
	document.getElementById("choosePlayers").classList.add("invisible");
	var word = secretword.split("");
	game1 = new game(word);
	player2 = new player("Computer");
});

//PLAY
document.getElementById("submit").addEventListener("click", function(){
	if(document.getElementById("player1").value === "" || document.getElementById("player2").value === "" || document.getElementById("secretWord").value === ""){
		if(document.getElementById("player1").value === ""){
			document.getElementById("player1").classList.add("required");
		}else{
			document.getElementById("player1").classList.remove("required");
		}
		if(document.getElementById("player2").value === ""){
			document.getElementById("player2").classList.add("required");
		}else{
			document.getElementById("player2").classList.remove("required");
		}
		if(document.getElementById("secretWord").value === ""){
			document.getElementById("secretWord").classList.add("required");
		}else{
			document.getElementById("secretWord").classList.remove("required");
		}
	} else {
		player1 = new player(document.getElementById("player1").value);
		player2 = new player(document.getElementById("player2").value);
		game1 = new game(document.getElementById("secretWord").value.toUpperCase().split(''));
		initializeDisplay();
	}
});

document.getElementById("submitS").addEventListener("click", function(){
	if(document.getElementById("playerS").value === ""){
		document.getElementById("playerS").classList.add("required");
	}else{
		document.getElementById("playerS").classList.remove("required");
		player1 = new player(document.getElementById("playerS").value);
		initializeDisplay();
	}
});

//SAVE AND LOAD
document.getElementById("save").addEventListener("click", function(){
	saveGame();
});

document.getElementById("load").addEventListener("click", function(){
	loadGameData();
});

document.getElementById("loadFromStart").addEventListener("click", function(){
	loadGameData();
});

document.getElementById("loadFromStartS").addEventListener("click", function(){
	loadGameData();
});

//KEYBOARD
var keyboardListener = document.getElementsByClassName("key");
for(var i = 0; i < keyboardListener.length; i++){
	keyboardListener[i].addEventListener("click", function(){
		var pressedKey = this.id;
		if(player1.guesses.toString().includes(pressedKey) === false){
			player1.guesses.push(pressedKey);
			game1.play(pressedKey);
		}
	});
}