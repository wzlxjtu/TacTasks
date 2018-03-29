$( document ).ready(function(){
    var now = new Date();
	var timestamp = now.toISOString();
	localStorage.setItem('startTime',timestamp);
	
	var session = localStorage.getItem("Session");
	
	if (session != "session1"){
	    $("#entry-pc-usage-week").prop("required", false);
	    $("#entry-pc-usage-life").prop("required", false);    
	    $(".survey_computer_usage").css("display", "none");
	}
	
    $("#pre-quest").submit(function(e){
        var arousalChecked = $("input[name=arousalradio]:checked").val();
        var valenceChecked = $("input[name=valenceradio]:checked").val();
        var weeklyUsage = $("#entry-pc-usage-week").val();
        var lifeUsage = $("#entry-pc-usage-life").val();
        if (weeklyUsage == "") weeklyUsage = "-1";
        if (lifeUsage == "") lifeUsage = "-1";
        var response = {
            "arousal" : arousalChecked,
            "valence" : valenceChecked,
            "weeklyUsage" : weeklyUsage,
            "lifeUsage" : lifeUsage
        };
        
        localStorage.setItem("pre-questionnaire", JSON.stringify(response));
        localStorage.setItem("Round", 1);
    });
});