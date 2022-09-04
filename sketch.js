/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


*/

// Game character 
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

// Terrain and interactacbles
var clouds;
var mountain;
var trees_x;
var collectable;
var canyon;
var flagpole;
var lives;
var platforms;
var onPlatform = false;
var enemies;
var minPos_x;
// var emit;

// Trackers
var game_score;
var timer;

// Sounds
var jumpSound;
var runSound;
var collectSound;
var plummetSound;
var enemySound;



function preload() {
	soundFormats('mp3', 'wav');

	jumpSound = loadSound('assets/jump.wav');
	jumpSound.setVolume(0.8);

	runSound = loadSound('assets/Running.mp3');
	runSound.setVolume(1);

	collectSound = loadSound('assets/collect.wav');
	collectSound.setVolume(1);

	plummetSound = loadSound('assets/Oop.mp3');
	plummetSound.setVolume(0.5);

	enemySound = loadSound('assets/Oop.mp3');
	enemySound.setVolume(0.5);

}


function setup() {
	createCanvas(1024, 576);

	floorPos_y = height * 3 / 4;
	gameChar_x = width / 3;
	gameChar_y = floorPos_y;

	// Background scrolling.
	scrollPos = 0;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialize scenery
	trees_x = [-420, -220, 30, 250, 450, 1050, 1250, 1450];

	clouds = [
		{ pos_x: 100, pos_y: 80 },
		{ pos_x: 270, pos_y: 130 },
		{ pos_x: 450, pos_y: 100 },
		{ pos_x: 700, pos_y: 50 },
		{ pos_x: 800, pos_y: 180 },
	];


	mountain = [
		{ pos_x: 730 },
		{ pos_x: -650 }
	];

	collectable = [
		{ pos_x: -200, pos_y: floorPos_y - 23, isFound: false },
		{ pos_x: -140, pos_y: floorPos_y - 120, isFound: false },
		{ pos_x: -110, pos_y: floorPos_y - 120, isFound: false },
		{ pos_x: -80, pos_y: floorPos_y - 120, isFound: false },
		{ pos_x: 175, pos_y: floorPos_y - 120, isFound: false },
		{ pos_x: 200, pos_y: floorPos_y - 23, isFound: false },
		{ pos_x: 380, pos_y: floorPos_y - 23, isFound: false },
		{ pos_x: 420, pos_y: floorPos_y - 23, isFound: false },
		{ pos_x: 460, pos_y: floorPos_y - 23, isFound: false },
		{ pos_x: 545, pos_y: floorPos_y - 150, isFound: false },
		{ pos_x: 660, pos_y: floorPos_y - 120, isFound: false },
		{ pos_x: 730, pos_y: floorPos_y - 190, isFound: false },
		{ pos_x: 830, pos_y: floorPos_y - 300, isFound: false },
		{ pos_x: 920, pos_y: floorPos_y - 150, isFound: false },
		{ pos_x: 980, pos_y: floorPos_y - 85, isFound: false },
		{ pos_x: 1200, pos_y: floorPos_y - 150, isFound: false },
		{ pos_x: 1230, pos_y: floorPos_y - 150, isFound: false },
		{ pos_x: 1260, pos_y: floorPos_y - 150, isFound: false },
		{ pos_x: 1290, pos_y: floorPos_y - 150, isFound: false },
		{ pos_x: 1320, pos_y: floorPos_y - 150, isFound: false },

	];

	canyon = [
		{ pos_x: 400, width: 55 },
		{ pos_x: 1500, width: 55 },
	];

	// Enemies
	enemies = [];
	enemies.push(new Enemy(100, floorPos_y, 100));
	enemies.push(new Enemy(-200, floorPos_y, 100));
	enemies.push(new Enemy(700, floorPos_y, 200));
	enemies.push(new Enemy(1100, floorPos_y, 350));
	enemies.push(new Enemy(1750, floorPos_y, 150));

	// emit = new emitter(100, floorPos_y, 0, -1, 10, color(255, 0, 0, 100));
	// emit.startEmitter(100, floorPos_y);

	// Platforms
	platforms = [];

	// Before canyon
	platforms.push(createPlatforms(150, floorPos_y - 100, 50));
	platforms.push(createPlatforms(-150, floorPos_y - 100, 100));


	// Over canyon
	platforms.push(createPlatforms(630, floorPos_y - 100, 60));
	platforms.push(createPlatforms(700, floorPos_y - 170, 60));
	platforms.push(createPlatforms(950, floorPos_y - 70, 60));
	platforms.push(createPlatforms(1100, floorPos_y - 130, 275));

	// Towards end
	platforms.push(createPlatforms(1730, floorPos_y - 100, 60));
	platforms.push(createPlatforms(1800, floorPos_y - 170, 60));
	platforms.push(createPlatforms(1870, floorPos_y - 240, 60));
	


	flagpole = {isReached: false, 
				x_pos: 2000,
				y_pos: floorPos_y - 250
				}; // Flagpole

	// Stats
	game_score = 0;
	lives = 3;
	timer = 30;

	// Lets character stay within the game world
	minPos_x = -300;
	maxPos_x = flagpole.pos_x;
}

function draw() {
	console.log(gameChar_world_x)

	background(100, 155, 255); // Sky

	stroke(0, 100, 0);
	strokeWeight(5);
	fill(0, 155, 0);
	rect(0, floorPos_y, width, height / 4); // Ground

	push();

	translate(scrollPos, 0);

	// Render objects
	noStroke();
	drawClouds();
	drawMountains()
	drawTrees();
	renderFlagpole();

	for (var i = 0; i < platforms.length; i++) {
		platforms[i].draw();
	}

	for (var i = 0; i < canyon.length; i++) {
		drawCanyon(canyon[i]);
		checkCanyon(canyon[i]);

		if(checkCanyon(canyon[i])) { // Code refactored to accomodate multiple canyons
			break;
		}

		else {
			continue
		}
	}

	for (var i = 0; i < collectable.length; i++) {
		if (collectable[i].isFound == false) {
			drawCollectable(collectable[i]);
			checkCollectable(collectable[i]);
		}

		if (collectable[i].isFound == true) {
			continue;
		}
	}



	//Draw enemies

	for (var i = 0; i < enemies.length; i++) {
		noStroke();
		enemies[i].draw();
		var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);

		if (isContact) {
			if (lives > 0) {
				lives -= 1;
				enemySound.play();
				continueGame();
				break; // Only iterate to the enemy the character contacts with
			}
		}
	};

	// emit.updateParticles();

	pop();

	drawGameChar(); // Game character

	// Scoreboard
	fill(255);
	textSize(15);
	stroke(0);
	strokeWeight(1);
	text("Score: " + game_score, 20, 20);

	// Timer
	text("Time remaining: " + timer, 120, 20);
	if (frameCount % 60 == 0 && timer > 0 && !flagpole.isReached && lives > 0) {
		timer--;
		return timer
	}

	// Game over scenarios
	if (lives < 1) { // No more lives
		fill(255);
		stroke(0)
		text("Game over. Press space to try again.", 400, 200);
		return;
	}

	else if (timer == 0 && !flagpole.isReached) { // Ran out of time
		text("You ran out of time. Press space to try again.", 400, 200);
		startGame(); //Bug fix, restarting game while character plummets makes it continue to plummet
		return;
	}

	// Level complete scenarios
	if (flagpole.isReached) {
		fill(255);
		stroke(0);
		text("Level complete. Press space to continue.", 400, 200);
	}

	// Logic to make the game character move or the background scroll.
	if (isLeft && (gameChar_world_x > minPos_x)) { //Prevent going too far back
		if (gameChar_x > width * 0.7) {
			gameChar_x -= 5;
		}
		else {
			scrollPos += 5;
		}
	}

	if (isRight) {
		if (gameChar_x < width * 0.7) {
			gameChar_x += 5;
		}
		else {
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
	if (gameChar_y < floorPos_y) {

		var isContact = false; // not touching by default

		for (var i = 0; i < platforms.length; i++) {

			if (platforms[i].checkContact(gameChar_world_x, gameChar_y)) {
				isContact = true;
				onPlatform = true;
				break; // stop when checked with correct platform
			}

		}

		if (!isContact) {
			isFalling = true;
			gameChar_y += 5;
		}
	}

	else {
		isFalling = false;
	}

	// Plummet 
	if (isPlumetting == true || gameChar_y > floorPos_y) {
		gameChar_y += 5;
	}

	if (isPlumetting == true && gameChar_y > floorPos_y) {  //Avoid running through the canyon while falling
		isLeft = false;
		isRight = false;
	}


	// Check flagpole

	if (flagpole.isReached == false) {
		checkFlagpole();
	}

	checkPlayerDie(); // Update character lives

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Visual for lives
	lifeCounter();
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed() {

	if ((keyCode == 37 || key == 'A' || key == 'a') && lives > 0 && !flagpole.isReached) {
		isLeft = true;
		runSound.play();
	}

	else if ((keyCode == 39 || key == 'D' || key == 'd') && lives > 0 && !flagpole.isReached) {
		isRight = true;
		runSound.play();
	}

	if ((keyCode == 32 || key == 'W' || key == 'w') && 
		(gameChar_y == floorPos_y || onPlatform) && // Either on floor on platform
		lives > 0 && !flagpole.isReached && timer > 0) { // Has not lost 

		gameChar_y -= 180;
		onPlatform = false;
		isFalling = true;
		runSound.stop();
		jumpSound.play();
		
	}

	// Game scenarios
	
	if ((keyCode == 32) && lives == 0 && !flagpole.isReached && timer > 0) { // Restart when 0 life
		startGame(); // New game
	}

	if ((keyCode == 32) && lives > 0 && flagpole.isReached && timer > 0) { // Restart after win
		startGame();
	}

	if ((keyCode == 32) && timer == 0) { // Restart when no more time 
		startGame();
	}

}

function keyReleased() {

	if (keyCode == 37 || key == "A" || key == "a") {
		isLeft = false;
		runSound.stop();
	}

	else if (keyCode == 39 || key == "D" || key == 'd') {
		isRight = false;
		runSound.stop();
	}
}



// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar() {
	// the game character
	if (isLeft && isFalling) {
		// add your jumping-left code
		// head	
		noStroke();
		fill(244, 169, 153);
		ellipse(gameChar_x, gameChar_y - 50, 25, 25);

		//Body
		fill(23, 80, 172);
		rect(gameChar_x - 13, gameChar_y - 38, 26, 30);

		//Feet
		fill(0);
		rect(gameChar_x - 15, gameChar_y - 8, 10, 10);

		fill(0);
		rect(gameChar_x + 5, gameChar_y - 8, 10, 10);

		//Hat
		fill(182, 120, 70);
		rect(gameChar_x - 15, gameChar_y - 63, 30, 7);

		fill(182, 120, 70);
		rect(gameChar_x - 7, gameChar_y - 67, 15, 6);

		//Face
		fill(0),
			ellipse(gameChar_x - 10, gameChar_y - 50, 5);
		rect(gameChar_x - 9, gameChar_y - 43, 7, 1);

	}
	else if (isRight && isFalling) {
		// add your jumping-right code
		noStroke();
		fill(244, 169, 153, 200);
		ellipse(gameChar_x, gameChar_y - 50, 25, 25);

		// Body
		fill(23, 80, 172);
		rect(gameChar_x - 13, gameChar_y - 38, 26, 30);

		// Feet
		fill(0);
		rect(gameChar_x - 15, gameChar_y - 8, 10, 10);

		fill(0);
		rect(gameChar_x + 5, gameChar_y - 8, 10, 10);

		// Hat
		fill(182, 120, 70);
		rect(gameChar_x - 15, gameChar_y - 63, 30, 7);

		fill(182, 120, 70);
		rect(gameChar_x - 7, gameChar_y - 67, 15, 6);

		// Face
		fill(0),
			ellipse(gameChar_x + 10, gameChar_y - 50, 5);
		rect(gameChar_x + 3, gameChar_y - 43, 7, 1);

	}
	else if (isLeft && lives > 0) {
		// add your walking left code
		// Head	
		noStroke();
		fill(244, 169, 153);
		ellipse(gameChar_x, gameChar_y - 50, 25, 25);

		// Body
		fill(23, 80, 172);
		rect(gameChar_x - 13, gameChar_y - 38, 26, 30);

		// Feet
		fill(0);
		rect(gameChar_x - 15, gameChar_y - 8, 10, 10);

		fill(0);
		rect(gameChar_x + 5, gameChar_y - 8, 10, 10);

		// Hat
		fill(182, 120, 70);
		rect(gameChar_x - 15, gameChar_y - 63, 30, 7);

		fill(182, 120, 70);
		rect(gameChar_x - 7, gameChar_y - 67, 15, 6);

		// Face
		fill(0),
			ellipse(gameChar_x - 9, gameChar_y - 50, 5);
		fill(0);
		rect(gameChar_x - 10, gameChar_y - 43, 7, 1);

		//Arms
		fill(23, 80, 172);
		rect(gameChar_x - 25, gameChar_y - 38, 12, 7);
	}
	else if (isRight && lives > 0) {
		// add your walking right code
		// Head	
		noStroke();
		fill(244, 169, 153);
		ellipse(gameChar_x, gameChar_y - 50, 25, 25);

		// Body
		fill(23, 80, 172);
		rect(gameChar_x - 13, gameChar_y - 38, 26, 30);

		// Feet
		fill(0);
		rect(gameChar_x - 15, gameChar_y - 8, 10, 10);

		fill(0);
		rect(gameChar_x + 5, gameChar_y - 8, 10, 10);

		// Hat
		fill(182, 120, 70);
		rect(gameChar_x - 15, gameChar_y - 63, 30, 7);

		fill(182, 120, 70);
		rect(gameChar_x - 7, gameChar_y - 67, 15, 6);

		// Arms
		fill(23, 80, 172);
		rect(gameChar_x + 13, gameChar_y - 38, 12, 7);

		// Face
		fill(0),
			ellipse(gameChar_x + 10, gameChar_y - 50, 5);
		fill(0);
		rect(gameChar_x + 3, gameChar_y - 43, 7, 1);
	}
	else if (isFalling || isPlummeting) {
		// add your jumping facing forwards code
		// Head	
		noStroke();
		fill(244, 169, 153);
		ellipse(gameChar_x, gameChar_y - 50, 25, 25);

		// Body
		fill(23, 80, 172);
		rect(gameChar_x - 13, gameChar_y - 38, 26, 30);

		// Feet
		fill(0);
		rect(gameChar_x - 15, gameChar_y - 8, 10, 10);

		fill(0);
		rect(gameChar_x + 5, gameChar_y - 8, 10, 10);

		// Hat
		fill(182, 120, 70);
		rect(gameChar_x - 15, gameChar_y - 63, 30, 7);

		fill(182, 120, 70);
		rect(gameChar_x - 7, gameChar_y - 67, 15, 6);

		// Arms
		fill(23, 80, 172);
		rect(gameChar_x - 17, gameChar_y - 38, 5, 20);
		fill(23, 80, 172);
		rect(gameChar_x + 12, gameChar_y - 38, 5, 20);

		// Face
		fill(0),
			ellipse(gameChar_x - 6, gameChar_y - 50, 5);
		fill(0),
			ellipse(gameChar_x + 6, gameChar_y - 50, 5);
		fill(0);
		rect(gameChar_x - 5, gameChar_y - 43, 10, 1);
	}
	else {
		// add your standing front facing code
		// Head
		noStroke();
		fill(244, 169, 153);
		ellipse(gameChar_x, gameChar_y - 50, 25, 25);

		// Body
		fill(23, 80, 172);
		rect(gameChar_x - 13, gameChar_y - 38, 26, 30);

		// Feet
		fill(0);
		rect(gameChar_x - 15, gameChar_y - 8, 10, 10);

		fill(0);
		rect(gameChar_x + 5, gameChar_y - 8, 10, 10);

		// Hat
		fill(182, 120, 70);
		rect(gameChar_x - 15, gameChar_y - 63, 30, 7);

		fill(182, 120, 70);
		rect(gameChar_x - 7, gameChar_y - 67, 15, 6);

		// Arms
		fill(23, 80, 172);
		rect(gameChar_x - 17, gameChar_y - 38, 5, 20);
		fill(23, 80, 172);
		rect(gameChar_x + 12, gameChar_y - 38, 5, 20);

		// Face
		fill(0),
			ellipse(gameChar_x - 6, gameChar_y - 50, 5);
		fill(0),
			ellipse(gameChar_x + 6, gameChar_y - 50, 5);
		fill(0);
		rect(gameChar_x - 5, gameChar_y - 43, 10, 1);
	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds() {
	for (var i = 0; i < clouds.length; i++) {
		fill(255);
		ellipse(clouds[i].pos_x, clouds[i].pos_y, 80, 80);
		ellipse(clouds[i].pos_x - 40, clouds[i].pos_y, 60, 65);
		ellipse(clouds[i].pos_x + 40, clouds[i].pos_y, 60, 65);

		// Repeating clouds beyond the original frame
		ellipse(clouds[i].pos_x + width, clouds[i].pos_y, 80, 80);
		ellipse(clouds[i].pos_x - 40 + width, clouds[i].pos_y, 60, 65);
		ellipse(clouds[i].pos_x + 40 + width, clouds[i].pos_y, 60, 65);

		ellipse(clouds[i].pos_x - width, clouds[i].pos_y, 80, 80);
		ellipse(clouds[i].pos_x - width - 40, clouds[i].pos_y, 60, 65);
		ellipse(clouds[i].pos_x - width + 40, clouds[i].pos_y, 60, 65);
	}
}


// Function to draw mountains objects.
function drawMountains() {
	for (var i = 0; i < mountain.length; i++) {
		strokeWeight(3)
		fill(65, 65, 65);
		stroke(51, 51, 51);
		triangle(
			mountain[i].pos_x, 430, // Anchor point
			120 + mountain[i].pos_x, 430,
			50 + mountain[i].pos_x, 300);

		fill(65, 65, 65);
		stroke(51, 51, 51);
		triangle(
			120 + mountain[i].pos_x, 430,
			200 + mountain[i].pos_x, 430,
			150 + mountain[i].pos_x, 300);

		fill(65, 65, 65);
		stroke(51, 51, 51);
		triangle(
			50 + mountain[i].pos_x, 430,
			150 + mountain[i].pos_x, 430,
			100 + mountain[i].pos_x, 200);
	}
}

// Function to draw trees objects.
function drawTrees() {
	for (var i = 0; i < trees_x.length; i++) {

		noStroke();

		fill(66, 40, 14);
		rect(trees_x[i] - 25, floorPos_y + -200 / 2, 50, 200 / 2);

		fill(0, 70, 0);
		triangle(
			trees_x[i] - 75, floorPos_y + -200 / 2,
			trees_x[i], floorPos_y + -200,
			trees_x[i] + 75, floorPos_y + -200 / 2);
		triangle(
			trees_x[i] - 95, floorPos_y + -200 / 4,
			trees_x[i], floorPos_y + -200 * 3 / 4,
			trees_x[i] + 95, floorPos_y + -200 / 4);

		// Trees in between the initially drawn trees
		for (var j = 0; j < trees_x.length; j++) {

			if (j == 4) { // Skip the area between canyon
				continue;
			}


			treeDis = (trees_x[j] + trees_x[j + 1]) / 2;

			noStroke();

			fill(85, 40, 14);
			rect(treeDis - 25, floorPos_y + -200 / 2, 50, 200 / 2);

			fill(0, 100, 0);
			triangle(
				treeDis - 75, floorPos_y + -200 / 2,
				treeDis, floorPos_y + -250,
				treeDis + 75, floorPos_y + -200 / 2);

			triangle(
				treeDis - 85, floorPos_y + -200 / 4,
				treeDis, floorPos_y + -250 * 3 / 4,
				treeDis + 85, floorPos_y + -200 / 4);
		}
	}
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon) {

	// Water between canyon
	noStroke();
	fill(28, 135, 255);
	rect(t_canyon.pos_x - t_canyon.width, 430, 270 + t_canyon.width, 150) // - 100


	// Left Canyon
	fill(128, 64, 0);
	stroke(54, 34, 4);
	strokeWeight(10);
	beginShape();

	vertex(t_canyon.pos_x - 50 - t_canyon.width, 576);
	vertex(t_canyon.pos_x + 120, 576);
	vertex(t_canyon.pos_x + 120, 435);
	vertex(t_canyon.pos_x - t_canyon.width, 435);
	vertex(t_canyon.pos_x - 10 - t_canyon.width, 550);
	endShape(CLOSE)

	// Right Canyon
	fill(128, 64, 0);
	stroke(54, 34, 4);

	beginShape();

	vertex(t_canyon.pos_x + 170, 576);
	vertex(t_canyon.pos_x + 330 + t_canyon.width, 576);
	vertex(t_canyon.pos_x + 300 + t_canyon.width, 500);
	vertex(t_canyon.pos_x + 270 + t_canyon.width, 480);
	vertex(t_canyon.pos_x + 240 + t_canyon.width, 435);
	vertex(t_canyon.pos_x + 170, 435);

	endShape(CLOSE)
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon) {

	if (gameChar_world_x > t_canyon.pos_x + 125 && gameChar_world_x < t_canyon.pos_x + 165) {
		isPlumetting = true;
		return true; //refactored to accomodate multiple canyons
	}

	else {
		isPlumetting = false;
		return false;
	}
}

function renderFlagpole() {
	push();

	strokeWeight(5);
	stroke(180);
	line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);

	fill(255, 0, 0);
	noStroke();

	if (flagpole.isReached && gameChar_y - 50 >= flagpole.y_pos) {
		flagpole.y_pos += 5;
		rect(flagpole.x_pos, flagpole.y_pos, 50, 50);
	}

	else {
		rect(flagpole.x_pos, flagpole.y_pos, 50, 50);
	}

	pop();
}

function checkFlagpole() {

	var d = abs(gameChar_world_x - flagpole.x_pos);

	if (d < 15) {
		flagpole.isReached = true;
		isRight = false; //Prevents character from running past flag
	}
}


//Enemmies
function Enemy(x, y, range) {
	this.x = x;
	this.y = y;
	this.range = range;

	this.currentX = x;
	this.inc = 1; //update enemy

	this.update = function () {
		this.currentX += this.inc;

		if (this.currentX >= this.x + this.range) {
			this.inc = random(-1, -1.5);
		}

		else if (this.currentX < this.x) {
			this.inc = random(1, 1.5);
		}
	}

	this.draw = function () {
		this.update();

		//Enemy(target dummy)

		fill(107, 50, 49);//feet
		rect(this.currentX - 2, this.y - 15, 5, 17);

		fill(193, 146, 61); //body
		strokeWeight(2);
		stroke(93, 67, 44);
		rect(this.currentX, this.y - 47, 20, 8);
		rect(this.currentX - 20, this.y - 47, 20, 8);
		ellipse(this.currentX, this.y - 35, 18, 45);
		ellipse(this.currentX, this.y - 55, 20, 20);


		stroke(0); //face
		strokeWeight(0.7);
		line(this.currentX - 5.5, this.y - 56, this.currentX - 1, this.y - 53);
		line(this.currentX + 1, this.y - 56, this.currentX + 5.5, this.y - 53);

		line(this.currentX - 5.5, this.y - 53, this.currentX - 1, this.y - 56);
		line(this.currentX + 1, this.y - 53, this.currentX + 5.5, this.y - 56);



	}

	this.checkContact = function (gc_x, gc_y) {
		var d = dist(gc_x, gc_y, this.currentX, this.y);
		if (d < 40) {
			return true;
		}

		return false;
	}
}


// Resets character position after it falls out of the screen


function checkPlayerDie() {
	if (gameChar_y > height) {
		lives -= 1;
		if (lives > 0) {
			plummetSound.play();
			continueGame();
		}
		else {
			// Return to original position without resetting the number of lives.
			gameChar_x = width / 3;
			gameChar_y = floorPos_y;
			lives = 0;
		}
	}
}

function startGame() { // Completely new game
	flagpole.isReached = false;
	
	floorPos_y = height * 3 / 4;
	gameChar_x = width / 3;
	gameChar_y = floorPos_y;
	gameChar_world_x = gameChar_x - scrollPos;

	// Background scrolling.
	scrollPos = 0;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Stats
	game_score = 0;
	lives = 3;
	timer = 30;

	// Restore collectables and flag position

	collectable = [
		{ pos_x: -200, pos_y: floorPos_y - 23, isFound: false },
		{ pos_x: -140, pos_y: floorPos_y - 120, isFound: false },
		{ pos_x: -110, pos_y: floorPos_y - 120, isFound: false },
		{ pos_x: -80, pos_y: floorPos_y - 120, isFound: false },
		{ pos_x: 175, pos_y: floorPos_y - 120, isFound: false },
		{ pos_x: 200, pos_y: floorPos_y - 23, isFound: false },
		{ pos_x: 380, pos_y: floorPos_y - 23, isFound: false },
		{ pos_x: 420, pos_y: floorPos_y - 23, isFound: false },
		{ pos_x: 460, pos_y: floorPos_y - 23, isFound: false },
		{ pos_x: 545, pos_y: floorPos_y - 150, isFound: false },
		{ pos_x: 660, pos_y: floorPos_y - 120, isFound: false },
		{ pos_x: 730, pos_y: floorPos_y - 190, isFound: false },
		{ pos_x: 830, pos_y: floorPos_y - 300, isFound: false },
		{ pos_x: 920, pos_y: floorPos_y - 150, isFound: false },
		{ pos_x: 980, pos_y: floorPos_y - 85, isFound: false },
		{ pos_x: 1200, pos_y: floorPos_y - 150, isFound: false },
		{ pos_x: 1230, pos_y: floorPos_y - 150, isFound: false },
		{ pos_x: 1260, pos_y: floorPos_y - 150, isFound: false },
		{ pos_x: 1290, pos_y: floorPos_y - 150, isFound: false },
		{ pos_x: 1320, pos_y: floorPos_y - 150, isFound: false },
	];

	flagpole = {isReached: false, 
		x_pos: 2000,
		y_pos: floorPos_y - 250
		}; // Flagpole

		
}

function continueGame() { // Restores character position, game state is retained

	floorPos_y = height * 3 / 4;
	gameChar_x = width / 3;
	gameChar_y = floorPos_y;

	// Background scrolling.
	scrollPos = 0;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

}




// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable) {
	fill(255, 223, 0);
	stroke(207, 181, 100);
	strokeWeight(2);
	ellipse(t_collectable.pos_x, t_collectable.pos_y, 20, 20);
}

// Function to check character has collected an item.

function checkCollectable(t_collectable) {
	if (dist(gameChar_world_x, gameChar_y, t_collectable.pos_x, t_collectable.pos_y) < 35) {
		t_collectable.isFound = true;
		game_score += 1;
		collectSound.play();
	}

	else {
		t_collectable.isFound = false;
	}
}

function lifeCounter() {
	//Draw lives as hearts
	for (i = lives; i >= 1; i--) {
		fill(255, 105, 97);
		noStroke();
		ellipse(850 + i * 40, 30, 15, 15); //left circle
		ellipse(864 + i * 40, 30, 15, 15); //right circle

		xLeft = 850.65 + (i * 40) - (15 / 2); //triangle in between
		xRight = 863.35 + (i * 40) + (15 / 2);
		xCenter = (xLeft + xRight) / 2
		triangle(xLeft, 33.6, xRight, 33.6, xCenter, 49)
	}
}

function createPlatforms(x, y, length) {
	var p = {
		x: x,
		y: y,
		length: length,
		draw: function () {
			stroke(138, 102, 66);
			fill(169, 149, 123);
			rect(this.x, this.y, this.length, 20);
		}

		,
		checkContact: function (gc_x, gc_y) {

			if (gc_x > this.x && gc_x < this.x + this.length) {
				var d = this.y - gc_y;
				if (d >= 0 && d <= 5) {
					return true;
				}
			}

			return false
		},
	}

	return p;
}


