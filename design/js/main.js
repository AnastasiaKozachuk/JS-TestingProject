$(function() {

    var switcher = require("./switcher");
    switcher.start();

    var createQuiz = require("./createQuiz");


    createQuiz.initializeQuize();
    $("#addQuestion").click(function () {
        createQuiz.addQuestion();
    });

    var resizeTextarea = require("./resizeTextarea");

    $("#nameNewQs").keydown(function () {
        resizeTextarea.textAreaHeight(this);
    });

    $("#nameNewQuiz").keydown(function () {
        resizeTextarea.textAreaHeight(this);
    });

    $("#variantAns1").keydown(function () {
        resizeTextarea.textAreaHeight(this);
    });

});


