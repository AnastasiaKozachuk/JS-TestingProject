(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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



},{}]},{},[1]);
