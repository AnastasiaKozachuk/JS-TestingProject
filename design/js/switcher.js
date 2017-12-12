


var main_page ="http://localhost:5050" ;
var order_page = "http://localhost:5050/create-page.html";

var nameQz="";
var info_IDChanged="";
var info_userName ="";
var info_IDPassed="";
var password="";


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



    $("#nameQzCreate").keyup(function () {
        nameQz=$("#nameQzCreate").val();
    });

    $("#passwordQz1").keyup(function () {
        password=$("#passwordQz1").val();
    });
    $("#idChange").keyup(function () {
        info_IDChanged=$("#idChange").val();
    });
    $("#passwordQz2").keyup(function () {
        password=$("#passwordQz2").val();
    });

    $("#nameUser").keyup(function () {
        info_userName=$("#nameUser").val();
    });

    $("#idPassed").keyup(function () {
        info_IDPassed=$("#idPassed").val();
    });



    $("#nextStep").click(function(){

        if($("#nameQzCreate").val()!=""&&$("#passwordQz1").val()!=""){
            localStorage.setItem("nameQuiz", nameQz);
            localStorage.setItem("password", password);
            location.href = order_page;
        }else if($("#idChange").val()!=""&&$("#passwordQz2").val()!=""){
            localStorage.setItem("IDchange", info_IDChanged);
            localStorage.setItem("password", password);
        }else if($("#nameUser").val()!=""&&$("#idPassed").val()!=""){
            localStorage.setItem("NameUser",  info_userName);
            localStorage.setItem("IDPassed", info_IDPassed);
        }

    });


    $("#backToMain").click(function(){
        location.href = main_page;
    });



};

exports.start = start;



