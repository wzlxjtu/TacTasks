
// Set the duration we're counting down
var duration = 10 * 60 * 1000; // 10 min

// Update the count down every 0.1 second
var x = setInterval(function() {
    
  // Time calculations for minutes and seconds
  var minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((duration % (1000 * 60)) / 1000);

  // Display the result in the element with id="timer"
  $(".timer").html(minutes + ":" + ('00'+seconds).slice(-2));
  
  duration -= 100;
  
  // If the count down is finished, write some text 
  if (duration < 0) {
    clearInterval(x);
    $(".timer").html(""); // Expired
    
    // Incrementing Round
    var round = parseInt(localStorage.getItem("Round"));
    round += 1;
    localStorage.setItem("Round", round);
    
    // Redirecting to self report page
    window.location = "affectTaskLoad.html";
    
  }
}, 100);