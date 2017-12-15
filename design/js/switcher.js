
var Storage = require('./Storage');
var API = require('../API');
var main_page ="http://localhost:5050" ;
var order_page = "http://localhost:5050/create-page.html";
var showQuize = "http://localhost:5050/showQuize.html";

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
        $("#rowOne").attr("pressed","yes");
        $("#rowTwo").attr("pressed","no");
        $("#rowThree").attr("pressed","no");
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
        $("#rowOne").attr("pressed","no");
        $("#rowTwo").attr("pressed","yes");
        $("#rowThree").attr("pressed","no");
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
        $("#rowOne").attr("pressed","no");
        $("#rowTwo").attr("pressed","no");
        $("#rowThree").attr("pressed","yes");
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



        if($("#nameQzCreate").val()!=""&&$("#passwordQz1").val()!=""&& ($("#rowOne").attr("pressed")=="yes")){
            localStorage.setItem("nameQuiz", nameQz);
            localStorage.setItem("password", password);
            location.href = order_page;
        }else if($("#idChange").val()!=""&&$("#passwordQz2").val()!="" && ($("#rowTwo").attr("pressed")=="yes")){
            localStorage.setItem("IDchange", info_IDChanged);
            localStorage.setItem("password", password);
        }else if($("#nameUser").val()!=""&&$("#idPassed").val()!="" && ($("#rowThree").attr("pressed")=="yes")){
            localStorage.setItem("NameUser",  info_userName);
            localStorage.setItem("IDPassed", info_IDPassed);

            getQuiz(function (err,result) {
                if(err){
                    alert("Can't find quiz.");
                }else{

                    var quizData ={
                        nameQuiz:result.nameQuiz ,
                        quiz:result.quiz,
                        time:result.time
                    }
                    console.log(quizData);
                    if(quizData.nameQuiz!=""||quizData.quiz!=""||quizData.time!=""){
                        Storage.write("started",false);
                        Storage.write("finished",false);
                        Storage.write("quizData",quizData);
                        location.href = showQuize;
                    }else{
                        alert("Can't find quiz.");
                    }

                }
            });


        }

    });


    $("#backToMain").click(function(){
        location.href = main_page;
    });



};


function getQuiz(callback) {
    API.getQuiz({
        id:info_IDPassed
    }, function (err,result) {
        if(err){
            return callback(err);
        }
        callback(null,result);
    });
}

exports.start = start;



