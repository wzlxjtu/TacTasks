$( document ).ready(function(){
    var now = new Date();
	var timestamp = now.toISOString();
	localStorage.setItem('startTime',timestamp);
	
    $("#pre-quest").submit(function(e){
        var arousalChecked = $("input[name=arousalradio]:checked").val();
        var valenceChecked = $("input[name=valenceradio]:checked").val();
        var weeklyUsage = $("#entry-pc-usage-week").val();
        var lifeUsage = $("#entry-pc-usage-life").val();
        
        var response = {
            "arousal" : arousalChecked,
            "valence" : valenceChecked,
            "weeklyUsage" : weeklyUsage,
            "lifeUsage" : lifeUsage
        };
        
        localStorage.setItem("pre-questionnaire", JSON.stringify(response));
        
        var flip = Math.random();
        if (flip < 0.5) {
            localStorage.setItem("EasyFirst", true);
        } else {
            localStorage.setItem("EasyFirst", false);
        }
        
        localStorage.setItem("Round", 1);
    });
});