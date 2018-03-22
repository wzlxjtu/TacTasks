$(document).ready(function(){
	localStorage.clear();
	localStorage.setItem("Session", "session1");
	$('#selsession').change(function () {
		var selectedText = $(this).find("option:selected").text().replace(/\s/g,'');
		localStorage.setItem("Session", selectedText);
	});
	
	$('#txtparticipant').change(function () {
		var participantID = $(this).val();
		localStorage.setItem("ParticipantID", participantID);
	});
});