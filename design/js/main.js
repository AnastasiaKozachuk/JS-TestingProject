$(function() {

    var switcher = require("./switcher");
    switcher.start();





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

var create = require("./createQuiz");
$(document).ready(function() {
    create.initializeQuize();
});
