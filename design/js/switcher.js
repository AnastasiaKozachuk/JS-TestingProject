function start() {
    $("#switch1").click(function () {
        $("#rowOne").show();
        $("#rowTwo").hide();
        $("#rowThree").hide();
        $("#switch1").css("background-color","#1d1a21");
        $("#switch2").css("background-color","#392d40");
        $("#switch3").css("background-color","#392d40");
        $("#switch1").removeClass("switcherStyle");
        $("#switch2").addClass("switcherStyle");
        $("#switch3").addClass("switcherStyle");
    });

    $("#switch2").click(function () {
        $("#rowOne").hide();
        $("#rowTwo").show();
        $("#rowThree").hide();
        $("#switch1").css("background-color","#392d40");
        $("#switch2").css("background-color","#1d1a21");
        $("#switch3").css("background-color","#392d40");
        $("#switch2").removeClass("switcherStyle");
        $("#switch1").addClass("switcherStyle");
        $("#switch3").addClass("switcherStyle");
    });


    $("#switch3").click(function () {
        $("#rowOne").hide();
        $("#rowTwo").hide();
        $("#rowThree").show();
        $("#switch1").css("background-color","#392d40");
        $("#switch2").css("background-color","#392d40");
        $("#switch3").css("background-color","#1d1a21");
        $("#switch3").removeClass("switcherStyle");
        $("#switch2").addClass("switcherStyle");
        $("#switch1").addClass("switcherStyle");
    });

    $("#nextStep").click(function(){
        location.href = "create-page.html";
    });

    $("#backToMain").click(function(){
        location.href = "index.html";
    });



};

exports.start = start;

