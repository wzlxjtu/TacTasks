
// Set the duration we're counting down
var duration = 0.3 * 60 * 1000; // 3 min

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
    
    // Redirecting to self report page
    window.location = "cat.html";
  }
}, 100);