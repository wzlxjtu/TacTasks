$( document ).ready(function(){
    $("#code-quest").submit(function(e){
        var workerID = $("#workerID").val();
        localStorage.setItem("workerID", workerID);
    });
});