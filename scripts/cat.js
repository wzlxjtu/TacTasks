
// game duration
var duration = 5 * 60; // 5 min
// time for per answer
var RT = 3, adaptiveRT = 3; // response time in seconds
var earning = 1;

// Loading data from memory
var round = localStorage.getItem("Round");
var easyFirst = localStorage.getItem("EasyFirst") == 'true';
// Determining if this session is within the relaxed or stressed block
var relaxedOrStressed = ( (easyFirst && round == 1) || (!easyFirst && round == 3) ) ? "relaxed" : "stressed";
var congruent = ( (easyFirst && round == 1) || (!easyFirst && round == 3) ) ? true : false;
localStorage.setItem('catlog_' + relaxedOrStressed, [correct,wrong]);
if (congruent)
	checkBox1.checked = true; // congruent
else {
	checkBox1.checked = false;
	checkBox2.checked = false; // adaptive
}

var lambda = 0.7; // the rate to update the adaptive response time
var currTime, currResponse;
var score;
var timing;
var colors = ["Blue", "Orange", "Yellow","Purple","Red","Green"];
var i_color = [0,1,2,3,4,5]; // color index
var i_button = [0,1,2,3]; // button index

var startTime = Date.parse(localStorage.getItem("startTime"));
var mousedata = "";
var mousePos = { x: -1, y: -1 };
var lastDropTime = -1;
var answerdata = "";
var correct = 0, wrong = 0;

getGUI();
hideGUI();

function startGame() {
	$('#sessionDing').trigger('play');
	var sessionmarker = (new Date).getTime();
	localStorage.setItem("sessionmarker",localStorage.getItem("sessionmarker") + ',' + sessionmarker);
	localStorage.setItem("timeStamps",localStorage.getItem("timeStamps") + ((new Date).getTime() - startTime) + ",");
	score = 0;
	currTime = 0;
	currResponse = 0;
	durationUpdate();
	setup();
}
function setup() {
	var perc = 100 - Math.round((currTime/(duration*1000))*100);
	if (perc <= 50) {
		changeButtonPosition();
	}
	clearTimeout(timing);
	adaptiveRT = adaptiveRT < 2 ? 2 : adaptiveRT;
	adaptiveRT = adaptiveRT > 5 ? 5 : adaptiveRT;
	if (checkBox2.checked == true)
		timing = window.setTimeout(failed, adaptiveRT * 1000);
	else
		timing = window.setTimeout(failed, RT * 1000);
	if (score < 0) score = 0;
	document.getElementById("score2").innerHTML = score;
	start.style.visibility = "hidden";
	showGUI();
	// Shuffle the random numbers
	// Let i_color[0] be the right anwer
	i_color = shuffle(i_color);
	i_button = shuffle(i_button);
	right_anwer = colors[i_color[0]];
	// hint: choose color (0) or word (1)?
	var hint = Math.floor(Math.random() * 2);
	if (hint == 0) {
		document.getElementById("choose2").innerHTML = "COLOR";
		target.innerHTML = colors[Math.floor(Math.random() * colors.length)];
		target.style.color = right_anwer;
	}
	else {
		document.getElementById("choose2").innerHTML = "WORD";
		target.innerHTML = right_anwer;
		target.style.color = colors[Math.floor(Math.random() * colors.length)];
	}
	button0.innerHTML = colors[i_color[i_button[0]]];
	button1.innerHTML = colors[i_color[i_button[1]]];
	button2.innerHTML = colors[i_color[i_button[2]]];
	button3.innerHTML = colors[i_color[i_button[3]]];
	// When the checkbox is on, the game runs in congruent mode
	if (checkBox1.checked == true) {
		// random mode
		// button0.style.color = colors[Math.floor(Math.random() * colors.length)];
		// button1.style.color = colors[Math.floor(Math.random() * colors.length)];
		// button2.style.color = colors[Math.floor(Math.random() * colors.length)];
		// button3.style.color = colors[Math.floor(Math.random() * colors.length)];
		// congruent mode
		document.getElementById("choose2").innerHTML = "WORD";
		target.innerHTML = right_anwer;
		target.style.color = right_anwer;
		score1.style.visibility="hidden";
		
		button0.style.color = colors[i_color[i_button[0]]];
		button1.style.color = colors[i_color[i_button[1]]];
		button2.style.color = colors[i_color[i_button[2]]];
		button3.style.color = colors[i_color[i_button[3]]];
	}
	else {
		button0.style.color = "white";
		button1.style.color = "white";
		button2.style.color = "white";
		button3.style.color = "white";
	}
	if (perc <= 50) {
		changeButtonPosition();
	}
}
function durationUpdate() {
    var perc = 100 - Math.round((currTime/(duration*1000))*100);
      if (perc >= 0) {
		  //if (checkBox1.checked == false)
		  currTime += 20;
		  currResponse += 20;
		  if (checkBox3.checked == false) {
			  counter.style.visibility="visible";
			  if (checkBox2.checked == true)
				  counter.innerHTML = parseFloat(adaptiveRT - currResponse / 1000).toFixed(1);
			  else
				  counter.innerHTML = parseFloat(RT  - currResponse / 1000).toFixed(1);
		  }
		  else
			  counter.style.visibility="hidden";
		  document.getElementById("progress-bar-fill").style.width = perc + "%";
		  setTimeout(durationUpdate, 20);
      }
	  else {
		  // When GAME OVER
		  setTimeout(clearTimeout(timing), 100);
		  hideGUI();
		  if (checkBox1.checked == false)
			score1.style.visibility = "visible";
		  adaptiveRT = 5;
		  localStorage.setItem("timeStamps",localStorage.getItem("timeStamps") + ((new Date).getTime() - startTime) + ",");
		  // Incrementing Round
		  localStorage.setItem("Round",parseInt(localStorage.getItem("Round"))+1);
		  // Redirecting to self report page
		  window.location = "affectTaskLoad.html";
	  }
}
function failed() {
		currResponse = 0;
		adaptiveRT = lambda*adaptiveRT + (1-lambda)*5;
		score-=1;
		wrong++;
		localStorage.setItem('catlog_' + relaxedOrStressed, [correct,wrong]);
		if (checkBox1.checked == false) {
			sound.play();
			cat2.style.visibility="visible";
		}
		setup();
}
// get element id on GUI
function getGUI() {
	counter = document.getElementById("counter");
	choose1 = document.getElementById("choose1");
	score1 = document.getElementById("score1");
	start = document.getElementById("start");
	target = document.getElementById("target");
	sound = document.getElementById('sound');
	cat = document.getElementById("cat");
	cat2 = document.getElementById("cat2");
	button0 = document.getElementById("button0");
	button1 = document.getElementById("button1");
	button2 = document.getElementById("button2");
	button3 = document.getElementById("button3");
	settings = document.getElementById("settings_img");
}
function hideGUI() {
	counter.style.visibility="hidden";
	target.style.visibility="hidden";
	cat.style.visibility="hidden";
	cat2.style.visibility="hidden";
	choose1.style.visibility="hidden";
	score1.style.visibility="hidden";
	button0.style.visibility="hidden";
	button1.style.visibility="hidden";
	button2.style.visibility="hidden";
	button3.style.visibility="hidden";
	settings.style.visibility="hidden";
}
function showGUI() {
	counter.style.visibility="visible";
	target.style.visibility = "visible";
	choose1.style.visibility = "visible";
	score1.style.visibility = "visible";
	button0.style.visibility="visible";
	button1.style.visibility="visible";
	button2.style.visibility="visible";
	button3.style.visibility="visible";
}
function changeButtonPosition() {
	button0.style.left = '26%';button0.style.top = '80%';
	button1.style.left = '39%';button1.style.top = '80%';
	button2.style.left = '52%';button2.style.top = '80%';
	button3.style.left = '65%';button3.style.top = '80%';
}
function updateOnClick(answer) {
	cat2.style.visibility="hidden";
	var dropTime = lastDropTime;
	if (answer == true) {
		score+=earning;
		cat.style.visibility="hidden";
		correct++;
		// increase duration if answer is correct
		// currTime = Math.max(currTime - 4000, 0);
		adaptiveRT = lambda*adaptiveRT + (1-lambda)*currResponse/1000;
		answerdata += dropTime+","+'correct\n';
	}
	else {
		score-=earning;
		if (checkBox1.checked == false) {
			sound.play();
			cat.style.visibility="visible";
		}
		answerdata += dropTime+","+'wrong\n';
		wrong++;
	}
	localStorage.setItem('answerCatLog_' + relaxedOrStressed, answerdata);
	localStorage.setItem('catlog_' + relaxedOrStressed, [correct,wrong]);
	currResponse = 0;
	setup();
}
function b0_click() {
	updateOnClick(button0.innerHTML === right_anwer);
}
function b1_click() {
	updateOnClick(button1.innerHTML === right_anwer);
}
function b2_click() {
	updateOnClick(button2.innerHTML === right_anwer);
}
function b3_click() {
	updateOnClick(button3.innerHTML === right_anwer);
}
//Function To Display Popup
function popup_show() {
	document.getElementById('popup').style.display = "block";
	var buttons = document.getElementsByClassName("button");
    for (i = 0; i < buttons.length; i += 1)
		buttons[i].style.position = "static";
}
//Function to Hide Popup
function popup_hide(){
	document.getElementById('popup').style.display = "none";
	var buttons = document.getElementsByClassName("button");
    for (i = 0; i < buttons.length; i += 1)
		buttons[i].style.position = "absolute";
}
// shuffle the numbers
function shuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};


// log mouse events
$(this).mousemove(function(event) {
	mousePos.x = event.pageX;
	mousePos.y = event.pageY;
	var milliseconds = (new Date).getTime() - startTime;
	//$('#mouseInfo').html(milliseconds+","+mousePos.x+","+mousePos.y+',move');
	mousedata += milliseconds+","+mousePos.x+","+mousePos.y+',0\n';
	localStorage.setItem('mouseCatLog_' + relaxedOrStressed, mousedata);
})
.mousedown(function() {
	var milliseconds = (new Date).getTime() - startTime;
	// event.which == 1 indicates the left click
	if (event.which == 1) {
		//$('#mouseInfo').html(milliseconds+","+mousePos.x+","+mousePos.y+',down');
		mousedata += milliseconds+","+mousePos.x+","+mousePos.y+',2\n';
		localStorage.setItem('mouseCatLog_' + relaxedOrStressed, mousedata);
	}
	
})
.mouseup(function() {
	var milliseconds = (new Date).getTime() - startTime;
	if (event.which == 1) {
		//$('#mouseInfo').html(milliseconds+","+mousePos.x+","+mousePos.y+',up');
		mousedata += milliseconds+","+mousePos.x+","+mousePos.y+',1\n';
		localStorage.setItem('mouseCatLog_' + relaxedOrStressed, mousedata);
		lastDropTime = milliseconds;
	}
});
