var questions = document.questions;
var answers = document.answers;
var paintings = document.paintings;

$(document).ready(function(){
	var timePassedSinceMATPopup = 0;
  var start;
  var end;
  
  var buffer = "";
  var bufferMAT = "";
  
  var taskDuration = 0;
  var timeDistraction = 5000;
  var initialDuration = 10000;
  var minNumWords = 200;
  var numPictures = 3;
  var numWrongConsecutive = 0;
  var pressedWhileMatWasUp = false;
  var current = randomQuestion();
  var currentPicture = 1;
  var compositions = [];
  var previous = current;
  
  // Set the duration we're counting down
  var durationAbsolute;
  
  var fail = new Audio('resources/fail.wav'); 
  var success = new Audio('resources/success.wav'); 
  var alert = new Audio('resources/alert.wav'); 
  
  var pauses = [28,22,20,28,30,26,30,34,46,32,38,32,28,38,28,34,20,28,26,24,28,22,20,28,30,26,30,34,46,32,38,32,28,38,28,34,20,28,26,24];
  //var pauses = [5,5,5,5,5,5,5,5,5,5,5,5,5,5,2,3,2,3,15,10,15,10,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,28,34,20,28,26,24];
  var currentPauseIndex = 0;
  
  // Loading data from memory
  var session = localStorage.getItem("Session");
  var round = localStorage.getItem("Round");
  var easyFirst = localStorage.getItem("EasyFirst") == 'true';
  
  // Determining if this session is within the relaxed or stressed block
  var relaxedOrStressed = ( (easyFirst && round == 2) || (!easyFirst && round == 4) ) ? "relaxed" : "stressed";
	
	localStorage.setItem("numRight_" + relaxedOrStressed, 0);
	
	// Function to laod timer.js. This is needed because this scripts is only loaded after the user presses X
	$.loadScript = function (url, callback) {
	    $.ajax({
	        url: url,
	        dataType: 'script',
	        success: callback,
	        async: true
	    });
	};
	
	var imagePath = paintings[session + "_" + relaxedOrStressed + "1"];
	$(".typing-img-container img").attr("src", imagePath);
	
	// Depending on whether is the relaxed or stressed block, different settings will be laoded
	if (relaxedOrStressed == "stressed"){
	    $("#myModal").css("display", "block");
	    
	    // Pop up instructions
 	    $(".close").click(function(){
 	    	$('#sessionDing').trigger('play');
 	    	var sessionmarker = (new Date).getTime();
			localStorage.setItem("sessionmarker",localStorage.getItem("sessionmarker") + ',' + sessionmarker);
 	        $("#myModal").css("display", "none");
 	        // set pseudointerval for showing the circles
 	        $.loadScript('scripts/timer.js', function(){
 	        	initialDuration = duration;
 	        	var timeInterval = pauses[currentPauseIndex] * 1000;
 	        	currentPauseIndex += 1;
	        	setTimeout(popupMAT, timeInterval);	
	        	setListenerImageChangeAndComposition();
	        	
	        	durationAbsolute = duration;
	        	// Update the count down every 0.1 second
				var w = setInterval(function() {
				  durationAbsolute -= 100;
				}, 100);
 	        });
 	    });
	}
	else {
		$('#sessionDing').trigger('play');
		var sessionmarker = (new Date).getTime();
		localStorage.setItem("sessionmarker",localStorage.getItem("sessionmarker") + ',' + sessionmarker);
	    $.loadScript('scripts/timer.js', function(){
	    	initialDuration = duration;
	    	setListenerImageChangeAndComposition();
	    });
	}
	
	// Check if shortcut is pressed. If it is, increment numRight and paint the circle green
	$(".mat-option").click(function(){
		end = new Date();
		$(".mat-modal").css("display","none");
		$(".timer").css("visibility","visible");
		
		enableKeyboard();
		timePassedSinceMATPopup = end - start;
		duration += timePassedSinceMATPopup;
		setTimer();
		
	    var answer = $(this).text();
	    pressedWhileMatWasUp = true;
	    if (answer == answers[previous][0]){
	    	bufferMAT += (initialDuration-durationAbsolute) + ", correct\n";
	    	success.play();
	    	numWrongConsecutive = 0;
		    
		    var numRightLocalStorage = parseInt(localStorage.getItem("numRight_" + relaxedOrStressed)) + 1;
		    localStorage.setItem("numRight_" + relaxedOrStressed, numRightLocalStorage);
		    localStorage.setItem("timeMats", bufferMAT);
	    } else {
	    	bufferMAT += (initialDuration-durationAbsolute) + ", wrong\n";
	    	localStorage.setItem("timeMats", bufferMAT);
	    	fail.play();	
	    }
	});
	
	$("#btn_submit").click(function() {
	    compositions[currentPicture-1] = $(".typing-text-container textarea").val();
	    currentPicture += 1;
	    $("#btn_submit").prop("disabled", true);
	    if (currentPicture <= numPictures) {
	    	$(".typing-text-container textarea").val("");
		    var imagePath = paintings[session + "_" + relaxedOrStressed + currentPicture];
				$(".typing-img-container img").attr("src", imagePath);
				$("#num_words_left").text("200 words left");
	    }
	    else {
	    	duration = 500;
	    	//console.log("You reached the last picture. Please, spend the rest of the time describing this picture");
	    }
	});
	
	$(".typing-text-container textarea").on("change keyup", function(){
		var currentText = $(this).val();
		var numWordsLeft = minNumWords - wordCount(currentText).words;
		if (numWordsLeft > 0){
			$("#num_words_left").text((numWordsLeft) + " words left");
			$("#btn_submit").prop("disabled", true);
		}else{
			$("#num_words_left").text("0 words left");
			$("#btn_submit").prop("disabled", false);
		}
	});
	
	function setListenerImageChangeAndComposition(){
		var z = setInterval(function() {
			if (duration < 200){
				compositions[currentPicture-1] = $(".typing-text-container textarea").val();
				var textSep = "--------TEXT--------\n";
				
				var allCompositions = textSep.concat(compositions[0]).concat("\n" + textSep + compositions[1]).concat("\n" + textSep + compositions[2]);
				localStorage.setItem("composition_" + relaxedOrStressed, allCompositions);
			}
		}, 100);
	}
	
	function setTimer(){
		var timeInterval = pauses[currentPauseIndex] * 1000;
		setTimeout(popupMAT, timeInterval);
	    currentPauseIndex += 1;
	}
	
	function popupMAT(){
		bufferMAT += (initialDuration-durationAbsolute) + ", ";
	    loadQuestionAndAnswers();
	    setProgressBar();
	    pressedWhileMatWasUp = false;
	    disableKeyboard();
	    $(".timer").css("visibility","hidden");
	    
	    start = new Date();
	    $(".mat-modal").css("display","block").delay(timeDistraction).queue(function(next){
	    	$(".mat-modal").css("display","none");
	    	$(".timer").css("visibility","visible");
	    	
	    	if (!pressedWhileMatWasUp){
	    		bufferMAT += (initialDuration-durationAbsolute) + ", timeout\n";
	    		localStorage.setItem("timeMats", bufferMAT);
	    		setTimer();
	    		enableKeyboard();
	    		fail.play();
	    		current = randomQuestion();
	    		duration += timeDistraction;
	    		numWrongConsecutive += 1;
	    		if (numWrongConsecutive >= 2){
	    			//alert("Please, pay attention to the circle. You MUST press ESC whenever the circle is red. Please make sure you follow this rule to ensure that you will be compensated at the end of the experiment.")
	    		}
			}
	    	next();
	    });
	}
	
	// Starts progress bar animation
	function setProgressBar(){
		var elem = $(".mat-bar");
		var width = 1;
		var id = setInterval(frame, 25);
		
		function frame() {
			if (width >= 100) {
			  clearInterval(id);
			} else {
			  width = width + 0.5; 
			  elem.width(width + '%'); 
			}
		}
	}
	
	function loadQuestionAndAnswers(){
		alert.play();
		$(".mat-question").html(questions[current]);
	    
    var shuffled = shuffle(answers[current].slice());
    $("#mat1").text(shuffled[0]);
  	$("#mat2").text(shuffled[1]);
  	$("#mat3").text(shuffled[2]);
  	$("#mat4").text(shuffled[3]);
  	
  	previous = current;
  	current = randomQuestion();
	}
	
	document.addEventListener('keydown', (event) => {
	  handleTypingEvent(event, '0');
	});
	
	document.addEventListener('keyup', (event) => {
	  handleTypingEvent(event, '1');
	});
	
	function handleTypingEvent(e, keyUpDown){
		var now = new Date();
		var timestamp = now.toISOString();
		var stroke = timestamp + ',' + keyUpDown + ',' + e.code;
		buffer += stroke + '\n';
		localStorage.setItem('keylog_' + relaxedOrStressed, buffer);
	}
	
	function wordCount(val){
    var wom = val.match(/\S+/g);
    return {
        charactersNoSpaces : val.replace(/\s+/g, '').length,
        characters         : val.length,
        words              : wom ? wom.length : 0,
        lines              : val.split(/\r*\n/).length
    };
	}

	function shuffle(array) {
    var copy = [], n = array.length, i;
    
    while (n) {
      i = Math.floor(Math.random() * n--);
      copy.push(array.splice(i, 1)[0]);
    }
    
    return copy;
  }
    
  function randomQuestion() {
  	return Math.floor(Math.random() * questions.length);
  }
  
  function disableKeyboard(){
  	$("#composition").focus();
  	$("#composition").prop('disabled', true);
  }
  
  function enableKeyboard(){
  	$("#composition").prop('disabled', false);
  	$("#composition").focus();
  }
});