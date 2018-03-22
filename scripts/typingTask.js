var questions = document.questions;
var answers = document.answers;

$(document).ready(function(){
    var timePassedSinceMATPopup = 0;
    var start;
    var end;
    
    var buffer = "";
    var matIsUp = false;
    var timeDistraction = 5000;
    var numDistractions = 0;
    var numRight = 0;
    var numWrongConsecutive = 0;
    var pressedWhileMatWasUp = false;
    var current = randomQuestion();
    var previous = current;
    
    var fail = new Audio('resources/fail.wav'); 
    var success = new Audio('resources/success.wav'); 
    var alert = new Audio('resources/alert.wav'); 
    
    var pauses = [28,22,20,28,30,26,30,34,46,32,38,32,28,38,28,34,20,28,26,24,28,22,20,28,30,26,30,34,46,32,38,32,28,38,28,34,20,28,26,24];
    //var pauses = [2,10,10,10,10,20,30,34,46,32,38,32,28,38,28,34,20,28,26,24,28,22,20,28,30,26,30,34,46,32,38,32,28,38,28,34,20,28,26,24];
    var currentPauseIndex = 0;
    
    // Loading data from memory
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
	}
	
	// Depending on whether is the relaxed or stressed block, different settings will be laoded
	if (relaxedOrStressed == "stressed"){
	    $(".typing-img-container img").attr("src", "resources/image3.jpg");
	    $("#myModal").css("display", "block");
	    
	    // Pop up instructions
 	    $(".close").click(function(){
 	        $("#myModal").css("display", "none");
 	        // set pseudointerval for showing the circles
 	        $.loadScript('scripts/timer.js', function(){
 	        	var timeInterval = pauses[currentPauseIndex] * 1000;
 	        	currentPauseIndex += 1;
	        	setTimeout(setTimer, timeInterval);	
	        	
	        	var z = setInterval(function() {
					if (duration < 100){
						localStorage.setItem("composition_" + relaxedOrStressed, $("#composition").val());
					}
				}, 100);
 	        });
 	    });
	}
	else {
	    $(".typing-img-container img").attr("src", "resources/image4.jpg");
	    $.loadScript('scripts/timer.js', function(){
	    	var y = setInterval(function() {
				if (duration < 100){
					localStorage.setItem("composition_" + relaxedOrStressed, $("#composition").val());
				}
			}, 100);
	    });
	}
	
	function setTimer(){
	    var timeInterval = pauses[currentPauseIndex] * 1000;
 	    currentPauseIndex += 1;
	    popupMAT();
	    setTimeout(setTimer, timeInterval);
	}
	
	function popupMAT(){
	    matIsUp = true;
	    loadQuestionAndAnswers();
	    setProgressBar();
	    numDistractions += 1;
	    pressedWhileMatWasUp = false;
	    disableKeyboard();
	    $(".timer").css("visibility","hidden");
	    
	    start = new Date();
	    $(".mat-modal").css("display","block").delay(timeDistraction).queue(function(next){
	    	$(".mat-modal").css("display","none");
	    	$(".timer").css("visibility","visible");
	    	matIsUp = false;
	    	
	    	if (!pressedWhileMatWasUp){
	    		enableKeyboard();
	    		//fail.play();
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
	
	// Check if shortcut is pressed. If it is, increment numRight and paint the circle green
	$(".mat-option").click(function(){
		end = new Date();
		$(".mat-modal").css("display","none");
		$(".timer").css("visibility","visible");
		
		enableKeyboard();
		timePassedSinceMATPopup = end - start;
		duration += timePassedSinceMATPopup;
		
	    var answer = $(this).text();
	    pressedWhileMatWasUp = true;
	    if (answer == answers[previous][0]){
	    	success.play();
	    	numWrongConsecutive = 0;
	        
            numRight += 1;
            matIsUp = false;
            
            var numRightLocalStorage = parseInt(localStorage.getItem("numRight_" + relaxedOrStressed));
            numRightLocalStorage += 1;
            localStorage.setItem("numRight_" + relaxedOrStressed, numRightLocalStorage);
        }else {
        	fail.play();	
        }
	});
	
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