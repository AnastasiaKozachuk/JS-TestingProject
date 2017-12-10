$(function() {

    $("#switch1").click(function () {
        $("#rowOne").css("display","block");
        $("#rowTwo").css("display","none");
        $("#rowThree").css("display","none");
        $("#switch1").css("background-color","#1d1a21");
        $("#switch2").css("background-color","#392d40");
        $("#switch3").css("background-color","#392d40");
        $("#switch1").removeClass("switcherStyle");
        $("#switch2").addClass("switcherStyle");
        $("#switch3").addClass("switcherStyle");
    });

    $("#switch2").click(function () {
        $("#rowOne").css("display","none");
        $("#rowTwo").css("display","block");
        $("#rowThree").css("display","none");
        $("#switch1").css("background-color","#392d40");
        $("#switch2").css("background-color","#1d1a21");
        $("#switch3").css("background-color","#392d40");
        $("#switch2").removeClass("switcherStyle");
        $("#switch1").addClass("switcherStyle");
        $("#switch3").addClass("switcherStyle");
    });


    $("#switch3").click(function () {
        $("#rowOne").css("display","none");
        $("#rowTwo").css("display","none");
        $("#rowThree").css("display","block");
        $("#switch1").css("background-color","#392d40");
        $("#switch2").css("background-color","#392d40");
        $("#switch3").css("background-color","#1d1a21");
        $("#switch3").removeClass("switcherStyle");
        $("#switch2").addClass("switcherStyle");
        $("#switch1").addClass("switcherStyle");
    });



});


