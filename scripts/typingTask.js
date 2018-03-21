$(document).ready(function(){
    var buffer = "";
    var matIsUp = false;
    var timeDistraction = 5000;
    var numDistractions = 0;
    var numRight = 0;
    var numWrongConsecutive = 0;
    var pressedWhileMatWasUp = false;
    var current = 0;
    
    var fail = new Audio('resources/fail.wav'); 
    var success = new Audio('resources/success.wav'); 
    var alert = new Audio('resources/alert.wav'); 
    
    var questions = [
        "20 + 36",
         "25 + 17",
         "75 + ?? = 82",
         "12 + 6 + 8",
		 "36 + 5 + ?? = 45",
		 "-8 + 4 - 8",
		 "51 - 27", "3",
		 "83 - ?? = 67",
		 "15 - ?? = 9 + ??",
		 "20 + ?? = 38 - ??",
		 "04 x 13",
		 "09 x 16",
		 "27 + 6 x 3",
		 "3 x 4 + 154",
		 "200 - 20 x 2",
		 "60 ÷ 5",
		 "30 ÷ 6 + 3 x 2",
		 "96 ÷ 12",
		 "36 ÷ 18 x 5"
    ];
    				
    var answers = {
		0:["56","46","48","64"],
		1:["42","37","32","45"],
		2:["07","157","-07","5"],
		3:["26","24","20","28"],
		4:["4","5","2","3"],
		5:["-12","8","-4","12"],
		6:["24","27","17","21"],
		7:["6-3","12-3","11-1","7-6"],
		8:["16","12","-8","18"],
		9:["3","2"," 5","4"],
		10:["9","10","3","8"],
		11:["52","39","48","46"],
		12:["144","152","136","128"],
		13:["45","43","53","38"],
		14:["166","168","172","184"],
		15:["160","360","380","180"],
		16:["12","15","8","16"],
		17:["11","12","13","8"],
		18:["8","6","12","14"],
		19:["10","8","15","12"]
	};
    
    //var pauses = [28,22,20,28,30,26,30,34,46,32,38,32,28,38,28,34,20,28,26,24,28,22,20,28,30,26,30,34,46,32,38,32,28,38,28,34,20,28,26,24];
    var pauses = [2,20,20,28,30,26,30,34,46,32,38,32,28,38,28,34,20,28,26,24,28,22,20,28,30,26,30,34,46,32,38,32,28,38,28,34,20,28,26,24];
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
	    paintCircle();
	    setTimeout(setTimer, timeInterval);
	}
	
	function paintCircle(){
	    matIsUp = true;
	    loadQuestionAndAnswers();
	    setProgressBar();
	    numDistractions += 1;
	    pressedWhileMatWasUp = false;
	    
	    $(".mat-modal").css("display","block").delay(timeDistraction).queue(function(next){
	    	$(".mat-modal").css("display","none");
	    	matIsUp = false;
	    	
	    	if (!pressedWhileMatWasUp){
	    		fail.play();
	    		current += 1;
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
		$(".mat-modal").css("display","none");
	    var answer = $(this).text();
	    pressedWhileMatWasUp = true;
	    if (answer == answers[current-1][0]){
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
    	current += 1;
	}
	
	function shuffle(array) {
      var copy = [], n = array.length, i;
      
      while (n) {
        i = Math.floor(Math.random() * n--);
        copy.push(array.splice(i, 1)[0]);
      }
      
      return copy;
    }
});