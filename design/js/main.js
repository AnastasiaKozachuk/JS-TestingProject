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
    create.initializeQuize();
    var saved_data = Storage.read("quizData");
    if(saved_data){
        show.startQuiz(saved_data);
    }

});
