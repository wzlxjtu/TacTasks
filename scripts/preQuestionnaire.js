$( document ).ready(function(){
    var now = new Date();
	var timestamp = now.toISOString();
	localStorage.setItem('startTime',timestamp);
	
	var gender = "Female";
	$('#gender').change(function () {
		gender = $(this).find("option:selected").text().replace(/\s/g,'');
	});
	
	var session = localStorage.getItem("Session");
	if (session != "session1"){
	    $("#entry-pc-usage-week").prop("required", false);
	    $("#entry-pc-usage-life").prop("required", false);
	    $("#entry-age").prop("required", false);    
	    $(".survey_computer_usage").css("display", "none");
	}
	
    $("#pre-quest").submit(function(e){
        var arousalChecked = $("input[name=arousalradio]:checked").val();
        var valenceChecked = $("input[name=valenceradio]:checked").val();
        var weeklyUsage = $("#entry-pc-usage-week").val();
        var lifeUsage = $("#entry-pc-usage-life").val();
        var age = $("#entry-age").val();
        
        if (weeklyUsage == "") weeklyUsage = "-1";
        if (lifeUsage == "")   lifeUsage = "-1";
        if (age == "")          age = "-1";
        
        var response = {
            "arousal"     : arousalChecked,
            "valence"     : valenceChecked,
            "weeklyUsage" : weeklyUsage,
            "lifeUsage"   : lifeUsage,
            "age"         : age,
            "gender"      : gender, 
        };
        
        localStorage.setItem("pre-questionnaire", JSON.stringify(response));
        localStorage.setItem("Round", 1);
    });
});