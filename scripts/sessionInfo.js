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
	
	$("#btn_start").click(function(){
		var easyFirst = $(".checkboxContainer input[type=checkbox]:checked").length == 1;
		localStorage.setItem("EasyFirst", easyFirst);	
	});
});