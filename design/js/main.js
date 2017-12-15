$(function() {

    var switcher = require("./switcher");
    switcher.start();





    var resizeTextarea = require("./resizeTextarea");


    $("#nameNewQuiz").keydown(function () {
        resizeTextarea.textAreaHeight(this);
    });

    $("#variantAns1").keydown(function () {
        resizeTextarea.textAreaHeight(this);
    });

    $("#textVariantAns").keydown(function () {
        resizeTextarea.textAreaHeight(this);
    });

});

var show = require("./showQuize");
var create = require("./createQuiz");
var Storage = require('./Storage');

$(document).ready(function() {
    if("http://localhost:5050/create-page.html"==window.location.href){
        create.initializeQuize();
    }
   if("http://localhost:5050/showQuize.html"==window.location.href&&(Storage.read("started")==false)&&(Storage.read("finished")==false)){
       var saved_data = Storage.read("quizData");
       Storage.write("started",true);
       if(saved_data){
           show.startQuiz(saved_data);
       }
   }else if("http://localhost:5050/showQuize.html"==window.location.href&&(Storage.read("started")==true)&&(Storage.read("finished")==false)){
       var saved_data = Storage.read("quizData");
       show.recoverQuiz(saved_data);
   }else if("http://localhost:5050/showQuize.html"==window.location.href&&(Storage.read("finished")==true)){
       console.log("-");
       show.quizEnded();
   }




});



