(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var API_URL = "http://localhost:5050";

function backendGet(url, callback) {
    $.ajax({
        url: API_URL + url,
        type: 'GET',
        success: function(data){
            callback(null, data);
        },
        error: function() {
            callback(new Error("Ajax Failed"));
        }
    })
}

function backendPost(url, data, callback) {
    $.ajax({
        url: API_URL + url,
        type: 'POST',
        contentType : 'application/json',
        data: JSON.stringify(data),
        success: function(data){
            callback(null, data);
        },
        error: function() {
            callback(new Error("Ajax Failed"));
        }
    })
}

exports.getQuiz = function(ID_info, callback) {
    backendPost("/api/get-Quiz/", ID_info,callback);
};

exports.getID = function(quiz_info, callback) {
    backendPost("/api/get-ID/", quiz_info, callback);
};

},{}],2:[function(require,module,exports){
var basil = require('basil.js');
basil = new basil();
exports.write = function(key,value){
    return  basil.set(key,value);
};

exports.read = function(key){
    return basil.get(key);
};
},{"basil.js":9}],3:[function(require,module,exports){
var Templates = require('./templates');
var resizeTextarea = require("./resizeTextarea");
var API = require('../API');
var Storage = require('./Storage');

var myQuestion=[];



var time =0;


function initializeQuize(){
    $("#nameNewQuiz").val(localStorage.getItem("nameQuiz"));
    addQuestion();
};

var countID=0;
function addQuestion(){
    var $node = $(Templates.Question_Template());
    var numberVariants = 0;

    var questionStructure={
        id:countID,
        question: $node ,
        questionName: "",
        answers:{},
        questionType: "",
        correctAnswers:{},
        mark: 0
    };
    countID++;
    myQuestion.push(questionStructure);

    //додавання першого варіанту
    addvariant($node,questionStructure,numberVariants);

    //ініціалізація дефолтного варіанту
    $($node.find("#firstType")).css("background-color","#1d1a21");
    $($node.find("#firstType")).removeClass("typeQuestion");
    setTypeQs("radio",questionStructure);


    //додавання нового запитання до тесту
    $("#questionsArea").append($node);


    //метод для додавання нового варінту відповіді
    $node.find("#addVariant").click(function () {
        numberVariants++;
        addvariant($node,questionStructure,numberVariants);
        resizeLeftside($($node.find(".right-side")[0]));
    });

    //метод для видалення запитання
    $node.find("#removeQuestion").click(function () {
        myQuestion.splice(getNumOfElem(questionStructure),1);
        $node.remove();
    });



    //тип запитання один зі списку
    $node.find("#firstType").click(function () {
        $($node.find("#firstType")).css("background-color","#1d1a21");
        $($node.find("#secondType")).css("background-color","#392d40");
        $($node.find("#thirdType")).css("background-color","#392d40");
        $($node.find("#firstType")).removeClass("typeQuestion");
        $($node.find("#secondType")).addClass("typeQuestion");
        $($node.find("#thirdType")).addClass("typeQuestion");
        questionStructure.answers={};
        questionStructure.correctAnswers={};
        $node.find("#varianstArea").html("");
        setTypeQs("radio",questionStructure);
        numberVariants=0;
        addvariant($node,questionStructure,numberVariants);
        resizeLeftside($($node.find(".right-side")[0]));
    });

    //тип запитання декілька зі списку
    $node.find("#secondType").click(function () {
        $($node.find("#firstType")).css("background-color","#392d40");
        $($node.find("#secondType")).css("background-color","#1d1a21");
        $($node.find("#thirdType")).css("background-color","#392d40");
        $($node.find("#firstType")).addClass("typeQuestion");
        $($node.find("#secondType")).removeClass("typeQuestion");
        $($node.find("#thirdType")).addClass("typeQuestion");
        questionStructure.answers={};
        questionStructure.correctAnswers={};
        $node.find("#varianstArea").html("");
        setTypeQs("checkbox",questionStructure);
        numberVariants=0;
        addvariant($node,questionStructure,numberVariants);
        resizeLeftside($($node.find(".right-side")[0]));
    });

    //тип запитання текст
    $node.find("#thirdType").click(function () {
        $($node.find("#firstType")).css("background-color","#392d40");
        $($node.find("#secondType")).css("background-color","#392d40");
        $($node.find("#thirdType")).css("background-color","#1d1a21");
        $($node.find("#firstType")).addClass("typeQuestion");
        $($node.find("#secondType")).addClass("typeQuestion");
        $($node.find("#thirdType")).removeClass("typeQuestion");
        questionStructure.answers={};
        questionStructure.correctAnswers={};
        $node.find("#varianstArea").html("");
        setTypeQs("textField",questionStructure);
        numberVariants=0;
        addvariant($node,questionStructure,numberVariants);
        resizeLeftside($($node.find(".right-side")[0]));

    });

    //оцінка за запитання
    $node.find("#mark").keyup(function () {
        setmarkQs( $($node.find("#mark")).val(),questionStructure);
    });

    //назва запитання
    $node.find("#nameNewQs").keyup(function () {
        setNameQs( $($node.find("#nameNewQs")).val(),questionStructure);
        resizeLeftside($($node.find(".right-side")[0]));
    });

    $node.find("#nameNewQs").keydown(function () {
        resizeTextarea.textAreaHeight(this);
        resizeLeftside($($node.find(".right-side")[0]));
    });

};


function getNumOfElem(element){
    var answer=-1;
    myQuestion.forEach(function (t, number) {
        if(t.id == element.id){
            answer= number;
        }
    })
    return answer;
}

function setTypeQs(type,element){
    element.questionType=type;
}

function setmarkQs(mark,element){
    element.mark=mark;
}

function setNameQs(name,element){
    element.questionName=name;
}

function setVariantQs(variant,element,num){
    element.answers[num]= variant;

}

function setRightVariantQs(variant,element,num){
    element.correctAnswers[num]= variant;

}

function resizeLeftside($nodeRight){
    if($nodeRight.height()>180){
        $nodeRight.css( "border-bottom-left-radius", "9px");
    }else{
        $nodeRight.css( "border-bottom-left-radius", "0px");
    }
};



function addvariant($node,questionStructure,counts){
    var $variant =$(Templates.Variant_Template());

    if(questionStructure.questionType=="textField"){
        $variant.find("#checkbox").hide();
        $node.find("#varianstArea").append($variant);
        var num ="a"+counts;

        $variant.find("#textVariantQuest").keydown(function () {
            resizeTextarea.textAreaHeight($variant.find("#textVariantQuest")[0]);
            resizeLeftside($($node.find(".right-side")[0]));
        });

        $variant.find("#textVariantQuest").keyup(function () {
            setRightVariantQs($variant.find("#textVariantQuest").val().toLowerCase(),questionStructure,num);
            resizeLeftside($($node.find(".right-side")[0]));
        });

    }else{
        $variant.find("#checkbox").show();

        $node.find("#varianstArea").append($variant);
        var num ="a"+counts;

        setVariantQs($variant.find("#textVariantQuest").val(),questionStructure,num);

        $variant.find("#textVariantQuest").keydown(function () {
            resizeTextarea.textAreaHeight($variant.find("#textVariantQuest")[0]);
            resizeLeftside($($node.find(".right-side")[0]));
        });

        $variant.find("#textVariantQuest").keyup(function () {
            setVariantQs($variant.find("#textVariantQuest").val(),questionStructure,num);
            resizeLeftside($($node.find(".right-side")[0]));
            if($variant.find("#checkbox")[0].checked){
                setRightVariantQs($variant.find("#textVariantQuest").val(),questionStructure,num);
            }
        });

        $variant.find("#checkbox").change(function(){
            if(this.checked){
                setRightVariantQs($variant.find("#textVariantQuest").val(),questionStructure,num);
            }
            else{
                delete questionStructure.correctAnswers[num];
            }

        });
    }

    $variant.find("#removeVar").click(function () {
        $variant.remove();
        delete questionStructure.answers[num];
        delete questionStructure.correctAnswers[num];
        resizeLeftside($($node.find(".right-side")[0]));
    });



}
$("#addQuestion").click(function () {
    addQuestion();
});


$("#timeinput").keyup(function () {
   time = $("#timeinput").val();
});

var ID="";


$("#getID").click(function () {
    var window= $(Templates.Window_ID());
    getID(function (err, data) {
        if(err){
            alert("Can't create quiz.");
        }else{
            console.log(data);

            if(data=="-1"){
                window.find("#setID").text("Немає вільного ID");
                $("body").append(window);
            }else{
                ID=data;
                window.find("#setID").text(data);
                $("body").append(window);
            }



        }
    });
        window.find("button").click(function () {

            window.hide();
        });

});



function getID(callback) {
    var nameQuiz=$("#nameNewQuiz").val();
    var password=localStorage.getItem("password");
    API.getID({
        id:ID,
        nameQuiz:nameQuiz ,
        password: password,
        quiz:myQuestion,
        time:time
    }, function (err,result) {
        if(err){
            return callback(err);
        }
        callback(null,result);
    });
};


exports.addQuestion=addQuestion;
exports.initializeQuize=initializeQuize;

},{"../API":1,"./Storage":2,"./resizeTextarea":5,"./templates":8}],4:[function(require,module,exports){
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




},{"./Storage":2,"./createQuiz":3,"./resizeTextarea":5,"./showQuize":6,"./switcher":7}],5:[function(require,module,exports){
function textAreaHeight(textarea) {
    if (!textarea._tester) {
        var ta = textarea.cloneNode();
        ta.style.position = 'absolute';
        ta.style.zIndex = -2000000;
        ta.style.visibility = 'hidden';
        ta.style.height = '1px';
        ta.id = '';
        ta.name = '';
        textarea.parentNode.appendChild(ta);
        textarea._tester = ta;
        textarea._offset = ta.clientHeight - 1;
    }
    if (textarea._timer) clearTimeout(textarea._timer);
    textarea._timer = setTimeout(function () {
        textarea._tester.style.width = textarea.clientWidth + 'px';
        textarea._tester.value = textarea.value;
        textarea.style.height = (textarea._tester.scrollHeight - textarea._offset) + 'px';
        textarea._timer = false;
    }, 1);
};

exports.textAreaHeight=textAreaHeight;
},{}],6:[function(require,module,exports){
var Templates = require('./templates');
var Storage = require('./Storage');
var main_page ="http://localhost:5050" ;
var markOfUser=0;
var  intervalID;

var hour=0;
var minute=0;
var second =60;
var timerExisting=false;
function startQuiz(data){

    console.log(data);
    setQuizName(data.nameQuiz);
    setQuestion(data.quiz);
    if(parseInt(data.time)!=0&&(data.time.trim()!="")){
        hour = Math.floor(parseInt(data.time)/60);
        minute =(parseInt( data.time)-(hour*60))-1;
        $("#timer").css("display","block");
        $("#timer").draggable();
        timerExisting=true;
        setStartTime(parseInt( data.time));
        intervalID = setTimeout(timer, 1000);
    }
}


function recoverQuiz(data){
    console.log(data);
    setQuizName(data.nameQuiz);
    setQuestion(data.quiz);
    if(parseInt(data.time)!=0&&(data.time.trim()!="")){
        hour= Storage.read("hour");
        minute= Storage.read("minute");
        second= Storage.read("second");
        $("#timer").css("display","block");
        $("#timer").draggable();
        timerExisting=true;
        setTime();
        intervalID = setTimeout(timer, 1000);
    }
}

function quizEnded() {
    window.find("#nameUserWindow").text(localStorage.getItem("NameUser"));
    window.find("#markUserWindow").text("Опитування завершено: "+Storage.read("markOfUser")+" б.");
    $("body").append(window);
}

function setQuizName(name){
    $("#endName").text(name);
}

function  setQuestion(questionArray){
    var count=0;
    questionArray.forEach(function (oneQuestion, number) {

        if(oneQuestion.questionType=="checkbox"){
            setCheckboxQuest(oneQuestion,count);
        }else if(oneQuestion.questionType=="radio"){
            setRadioQuest(oneQuestion,count);
        }else if(oneQuestion.questionType=="textField"){
            setTextQuest(oneQuestion,count);
        }
        count++;
    });
}





function setCheckboxQuest(objQuest,count){
    var $answer = $(Templates.Answers_Template());

    $answer.find("#answersName").text(objQuest.questionName);
    $answer.find("#answerMark").text(objQuest.mark+" б.");

    var arrayRightAns={};

    var counter=0;
    for(var key in  objQuest.answers){
        addVariantCheckBox(key,counter);
        counter++;
    }



    function addVariantCheckBox(key,counter){
        var $checkQs =$(Templates.Checkbox_Template());
        var nameAttrib = String($checkQs.find("#checkboxAns").attr("name"))+count;
        $checkQs.find("#checkboxAns").attr("name",nameAttrib);
        $checkQs.find("#variantCheckBox").text(objQuest.answers[key]);
        $answer.find("#answersArea").append($checkQs);

        var keyRight =nameAttrib+counter;

        $checkQs.find("#checkboxAns").change(function () {
            if(this.checked){
                arrayRightAns[keyRight]=String($checkQs.find("#variantCheckBox").text());

                if (allrightanswers( arrayRightAns,objQuest.correctAnswers)&&$answer.find("#answersArea").attr("answer")=="no") {
                    markOfUser+= parseInt(objQuest.mark);
                    $answer.find("#answersArea").attr("answer","yes");
                }

                if (!(allrightanswers( arrayRightAns,objQuest.correctAnswers))&&$answer.find("#answersArea").attr("answer")=="yes") {
                    markOfUser-= parseInt(objQuest.mark);
                    $answer.find("#answersArea").attr("answer","no");
                }

            }
            else{

                delete  arrayRightAns[keyRight];

                if ( allrightanswers( arrayRightAns,objQuest.correctAnswers)&&($answer.find("#answersArea").attr("answer")=="no")) {
                    markOfUser+= parseInt(objQuest.mark);
                    $answer.find("#answersArea").attr("answer","yes");
                }

                if (!(allrightanswers( arrayRightAns,objQuest.correctAnswers))&&$answer.find("#answersArea").attr("answer")=="yes") {
                    markOfUser-= parseInt(objQuest.mark);
                    $answer.find("#answersArea").attr("answer","no");
                }

            }
            console.log(markOfUser);
        });
    }



    function allrightanswers(arrayRightAns,rightAns){
        var lenPossible=getLenght(arrayRightAns);
        var lenRighr=getLenght(rightAns);
        var equal=false;
        var number=0;
        if(lenPossible!=lenRighr){
            equal=false;
        }else{
            for(var i in rightAns){
                for(var j in arrayRightAns){
                    if(rightAns[i]==arrayRightAns[j]){
                        number++;
                    }
                }
            }

            if(number==lenRighr){
                equal=true;
            }

        }
        return equal;
    }


    $("#main-show").append($answer);
}






function getLenght(object){
    var i=0;
    for(var key in  object){
        i++;
    }
    return i;
}




function setRadioQuest(objQuest,count){
    var $answer = $(Templates.Answers_Template());


    $answer.find("#answersName").text(objQuest.questionName);
    $answer.find("#answerMark").text(objQuest.mark+" б.");



    for(var key in  objQuest.answers){
        addVariantRadio(key, $answer,count,objQuest);

    }

    $("#main-show").append($answer);
}


function addVariantRadio(key, $answer,count,objQuest){
    var $radioQs =$(Templates.Radio_Template());
    var nameAttrib = String($radioQs.find("#radioAns").attr("name"))+count;
    $radioQs.find("#radioAns").attr("name",nameAttrib);

    $radioQs.find("#variantRadio").text(objQuest.answers[key]);



    $radioQs.find("#radioAns").change(function () {
        if(this.checked&&($answer.find("#answersArea").attr("answer")=="no")){
            if (   existInObject($radioQs.find("#variantRadio").text(),objQuest.correctAnswers) ) {
                markOfUser+= parseInt(objQuest.mark);
                $answer.find("#answersArea").attr("answer","yes");
            }
        }
        else{

            if (  !existInObject($radioQs.find("#variantRadio").text(),objQuest.correctAnswers) ) {
                markOfUser-= parseInt(objQuest.mark);
                $answer.find("#answersArea").attr("answer","no");
            }


        }

        console.log(markOfUser);
    });

    $answer.find("#answersArea").append($radioQs);
}


function existInObject(element,object){
    var exist=false;

    for( var key in  object){

        if(object[key]==element){
            exist=true;
        }

    }

    return exist;
}




function  setTextQuest(objQuest,count){
    var $answer = $(Templates.Answers_Template());
    var $textQs =$(Templates.Text_Template());

    $answer.find("#answersName").text(objQuest.questionName);
    $answer.find("#answerMark").text(objQuest.mark+" б.");

    var nameAttrib = String($textQs.find("#textVariantAns").attr("name"))+count;
    $textQs.find("#textVariantAns").attr("name",nameAttrib);


    $textQs.find("#textVariantAns").focusout(function () {

        if(existInObject($textQs.find("#textVariantAns").val().toLowerCase(),objQuest.correctAnswers)&&$answer.find("#answersArea").attr("answer")=="no"){
            markOfUser+= parseInt(objQuest.mark);
            $answer.find("#answersArea").attr("answer","yes");
        }else if(!existInObject($textQs.find("#textVariantAns").val().toLowerCase(),objQuest.correctAnswers)&&$answer.find("#answersArea").attr("answer")=="yes"){
            markOfUser-= parseInt(objQuest.mark);
            $answer.find("#answersArea").attr("answer","no");
        }


        console.log(markOfUser);

    });


    $answer.find("#answersArea").append($textQs);



    $("#main-show").append($answer);
}


var end = false;

$("#endQuize").click(function () {
    if(timerExisting){
        end=true;
    }else{
        window.find("#nameUserWindow").text(localStorage.getItem("NameUser"));
        window.find("#markUserWindow").text(markOfUser + " б.");
        $("body").append(window);
    }
});
var window= $(Templates.Window_Mark());
$("#backToMainFromShow").click(function(){
    if(timerExisting){
        end=true;
    }else{
        window.find("#nameUserWindow").text(localStorage.getItem("NameUser"));
        window.find("#markUserWindow").text(markOfUser + " б.");
        $("body").append(window);
    }

});


function timer(){



        if( second > 0 ) second--;
        else{
            second = 59;

            if( minute > 0 ) minute--;
            else{
                second = 59;

                if( hour > 0 ) hour--;
                else end = true;
            }
        }

        if(end){
            clearInterval(intervalID);
            window.find("#nameUserWindow").text(localStorage.getItem("NameUser"));
            window.find("#markUserWindow").text(markOfUser + " б.");
            $("body").append(window);

        }else{
            Storage.write("hour",hour);
            Storage.write("minute",minute);
            Storage.write("second",second);
            setTime();
            setTimeout(timer, 1000);
        }
    }

window.find("button").click(function () {
    Storage.write("markOfUser",markOfUser);
    Storage.write("finished",true);
    window.hide();
    location.href = main_page;
});

function setTime(){
    if(hour>=10&&minute>=10&&second>=10){
        $("#timer").text(hour+" : "+minute+" : "+second);
    }else if(hour>=10&&minute>=10&&(second>=0&&second<10)){
        $("#timer").text(hour+" : "+minute+" : 0"+second);
    }else if(hour>=10&&(minute>=0&&minute<10)&&second>=10){
        $("#timer").text(hour+" : 0"+minute+" : "+second);
    } else if(hour>=10&&(minute>=0&&minute<10)&&(second>=0&&second<10)){
        $("#timer").text(hour+" : 0"+minute+" : 0"+second);
    }else if((hour>=0&&hour<10)&&minute>=10&&second>=10){
        $("#timer").text("0"+hour+" : "+minute+" : "+second);
    }else if((hour>=0&&hour<10)&&minute>=10&&(second>=0&&second<10)){
        $("#timer").text("0"+hour+" : "+minute+" : 0"+second);
    }else if((hour>=0&&hour<10)&&(minute>=0&&minute<10)&&second>=10){
        $("#timer").text("0"+hour+" : 0"+minute+" : "+second);
    }else if((hour>=0&&hour<10)&&(minute>=0&&minute<10)&&(second>=0&&second<10)){
        $("#timer").text("0"+hour+" : 0"+minute+" : 0"+second);
    }
}

function  setStartTime(time){
    var hours = Math.floor(time/60);
    var minutes =(time-(hours*60));
    if(hours>=10&&minutes>=10){
        $("#timer").text(hours+" : "+minutes+" : 00");
    }else if(hours>=10&&(minutes>=0&&minutes<10)){
        $("#timer").text(hours+" : 0"+minutes+" : 00");
    } else if((hours>=0&&hours<10)&&minutes>=10){
        $("#timer").text("0"+hours+" : "+minutes+" : 00");
    }else if((hours>=0&&hours<10)&&(minutes>=0&&minutes<10)){
        $("#timer").text("0"+hours+" : 0"+minutes+" : 00");
    }
}

exports.startQuiz = startQuiz;
exports.recoverQuiz = recoverQuiz;
exports.quizEnded=quizEnded;
},{"./Storage":2,"./templates":8}],7:[function(require,module,exports){

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
                      $("#windowCheck").css("display","block");
                    }

                }
            });


        }

    });


    $("#windowCheck").find("button").click(function () {
        $("#windowCheck").css("display","none");
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




},{"../API":1,"./Storage":2}],8:[function(require,module,exports){

var ejs = require('ejs');


exports.Question_Template = ejs.compile("<div id=\"question\" class=\"container\" style=\"margin-top: 30px;margin-bottom: 30px;\">\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-4\">\r\n            <div class=\"row left-side\" style=\"border-bottom-left-radius: 9px; border-top-left-radius: 9px; min-width: 180px;\">\r\n                <div class=\"col-xs-12 typeQuestion\" id=\"firstType\" style=\"background-color: #392d40 ; height: 60px; cursor:pointer; border-top-left-radius: 9px; padding-top: 18px;\">Один зі списку</div>\r\n                <div class=\"col-xs-12 typeQuestion\" id=\"secondType\" style=\"background-color: #392d40 ; height: 60px; cursor:pointer; padding-top: 18px;\">Декілька зі списку</div>\r\n                <div class=\"col-xs-12 typeQuestion\" id=\"thirdType\" style=\"background-color: #392d40 ; height: 60px; cursor:pointer; border-bottom-left-radius: 9px; padding-top: 18px;\">Рядок тексту</div>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-8\">\r\n            <div class=\"row right-side\" style=\"border: 2px solid #392d40; border-bottom-right-radius: 9px; border-top-right-radius: 9px; min-height:180px;\">\r\n                <div class=\"col-xs-12\">\r\n                    <div class=\"row\">\r\n                        <div class=\"col-xs-8\" style=\"padding-top: 10px; padding-bottom: 10px;\"><textarea id=\"nameNewQs\" style=\" overflow-y :hidden;outline: none; border:0;width: 100%; resize: none; font-size: 23px;\" placeholder=\"Заголовок запитання\" rows=\"1\" wrap=\"hard\"></textarea></div>\r\n                        <div  class=\"col-xs-1 hidden-sm hidden-xs\"></div>\r\n                        <div class=\"col-xs-3\" style=\"padding-top: 10px; padding-bottom: 10px;  text-align: right;\"><input id=\"mark\" style=\" outline: none; border:1px solid #b2b2b2; text-align: center; border-radius: 3px; width: 70px;\" maxlength=\"4\" placeholder=\"Бал\"></div>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class=\"col-xs-12\" id=\"varianstArea\">\r\n\r\n\r\n                </div>\r\n                <div style=\"text-align: center;\">\r\n                    <button type=\"button\" id=\"addVariant\">Додати варіант</button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <div>\r\n        <button id=\"removeQuestion\" class=\"glyphicon glyphicon-remove\" ></button>\r\n    </div>\r\n</div>");
exports.Variant_Template = ejs.compile("\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-1\"><input type=\"checkbox\"  id =\"checkbox\" name=\"variant1\" style=\"width:25px; height: 25px;\"> </div>\r\n        <div class=\"col-xs-8\"><textarea id=\"textVariantQuest\"  style=\" overflow-y :hidden;outline: none;border:0; width: 100%; resize: none; \" placeholder=\"Варіант відповіді\" rows=\"1\" wrap=\"hard\" ></textarea></div>\r\n        <div class=\"col-xs-2\"><button id=\"removeVar\" class=\"glyphicon glyphicon-remove\" style=\"outline: none; border:1px solid #cacaca; text-align: center; border-radius: 3px; width: 50px; height: 25px;\"></button> </div>\r\n    </div>\r\n\r\n");
exports.Answers_Template = ejs.compile("<div class=\"container variantAns\" style=\"min-width: 525px; width:55%;\">\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-9\" id=\"answersName\" style=\"padding-top: 20px;padding-left: 20px;  padding-bottom: 15px;font-size: 23px;\">Назва запитання</div>\r\n        <div class=\"col-xs-3\" id=\"answerMark\" style=\"padding-top: 20px;padding-left: 20px; padding-bottom: 15px;font-size: 23px;\">Бал</div>\r\n    </div>\r\n    <div id=\"answersArea\" answer=\"no\" style=\"margin-bottom: 15px;\">\r\n\r\n\r\n\r\n    </div>\r\n\r\n</div>");
exports.Checkbox_Template = ejs.compile("<div class=\"row\" style=\"margin-top: 5px;margin-bottom: 5px;\">\r\n    <div class=\"col-xs-1\" ></div>\r\n    <div class=\"col-xs-1\" style=\"text-align: right; \" >  <input type=\"checkbox\"  id =\"checkboxAns\" name=\"variantcheckbox\" style=\"width:25px; height: 25px;   \"> </div>\r\n    <div class=\"col-xs-10\" style=\"padding-top: 3px;\" id=\"variantCheckBox\">Варіант відповіді 1</div>\r\n</div>\r\n");
exports.Radio_Template = ejs.compile("<div class=\"row\" style=\"margin-top: 5px;margin-bottom: 5px;\">\r\n    <div class=\"col-xs-1\" ></div>\r\n    <div class=\"col-xs-1\" style=\"text-align: right; \" >  <input type=\"radio\"  id =\"radioAns\" name=\"variantradio\" style=\"width:25px; height: 25px;   \"> </div>\r\n    <div class=\"col-xs-10\" id=\"variantRadio\" style=\"padding-top: 3px;\">Варіант відповіді 1</div>\r\n</div>");
exports.Text_Template = ejs.compile("<div class=\"row\" style=\"margin-bottom: 20px;margin-top: 10px;\" >\r\n    <div class=\"col-xs-1\"></div>\r\n    <div class=\"col-xs-10\"><textarea id=\"textVariantAns\" name=\"textAnswer\" style=\" overflow-y :hidden;outline: none;border:0; width: 100%; resize: none; \" placeholder=\"Введіть відповідь\" rows=\"1\" wrap=\"hard\" ></textarea></div>\r\n</div>");
exports.Window_ID = ejs.compile("<div id=\"windowID\">\r\n    <div class=\"windowGetID\">\r\n        <div style=\"font-size: 23px;font-family: Arial; padding-top: 15px; padding-bottom: 10px; \">ID вашого опитування</div>\r\n        <div id=\"setID\" style=\"font-size: 20px;font-family: Arial; padding-top: 25px; padding-bottom: 25px; background-color: rgba(166,166,166,0.46);\">67777789</div>\r\n        <div  style=\"padding-top: 15px;\">\r\n            <button type=\"button\" >Добре</button>\r\n        </div>\r\n    </div> </div>");
exports.Window_Mark = ejs.compile("<div id=\"windowMark\">\r\n    <div class=\"windowGetMark\">\r\n        <div id=\"nameUserWindow\" style=\"font-size: 23px;font-family: Arial; padding-top: 15px; padding-bottom: 10px; \">Ім'я</div>\r\n        <div  id=\"markUserWindow\"style=\"font-size: 20px;font-family: Arial; padding-top: 25px; padding-bottom: 25px; background-color: rgba(166,166,166,0.46);\">Кількість балів</div>\r\n        <div  style=\"padding-top: 15px;\">\r\n            <button type=\"button\" >Добре</button>\r\n        </div>\r\n    </div> </div>");


},{"ejs":11}],9:[function(require,module,exports){
(function () {
	// Basil
	var Basil = function (options) {
		return Basil.utils.extend({}, Basil.plugins, new Basil.Storage().init(options));
	};

	// Version
	Basil.version = '0.4.4';

	// Utils
	Basil.utils = {
		extend: function () {
			var destination = typeof arguments[0] === 'object' ? arguments[0] : {};
			for (var i = 1; i < arguments.length; i++) {
				if (arguments[i] && typeof arguments[i] === 'object')
					for (var property in arguments[i])
						destination[property] = arguments[i][property];
			}
			return destination;
		},
		each: function (obj, fnIterator, context) {
			if (this.isArray(obj)) {
				for (var i = 0; i < obj.length; i++)
					if (fnIterator.call(context, obj[i], i) === false) return;
			} else if (obj) {
				for (var key in obj)
					if (fnIterator.call(context, obj[key], key) === false) return;
			}
		},
		tryEach: function (obj, fnIterator, fnError, context) {
			this.each(obj, function (value, key) {
				try {
					return fnIterator.call(context, value, key);
				} catch (error) {
					if (this.isFunction(fnError)) {
						try {
							fnError.call(context, value, key, error);
						} catch (error) {}
					}
				}
			}, this);
		},
		registerPlugin: function (methods) {
			Basil.plugins = this.extend(methods, Basil.plugins);
		},
		getTypeOf: function (obj) {
			if (typeof obj === 'undefined' || obj === null)
				return '' + obj;
			return Object.prototype.toString.call(obj).replace(/^\[object\s(.*)\]$/, function ($0, $1) { return $1.toLowerCase(); });
		}
	};
  	// Add some isType methods: isArguments, isBoolean, isFunction, isString, isArray, isNumber, isDate, isRegExp, isUndefined, isNull.
	var types = ['Arguments', 'Boolean', 'Function', 'String', 'Array', 'Number', 'Date', 'RegExp', 'Undefined', 'Null'];
	for (var i = 0; i < types.length; i++) {
		Basil.utils['is' + types[i]] = (function (type) {
			return function (obj) {
				return Basil.utils.getTypeOf(obj) === type.toLowerCase();
			};
		})(types[i]);
	}

	// Plugins
	Basil.plugins = {};

	// Options
	Basil.options = Basil.utils.extend({
		namespace: 'b45i1',
		storages: ['local', 'cookie', 'session', 'memory'],
		expireDays: 365
	}, window.Basil ? window.Basil.options : {});

	// Storage
	Basil.Storage = function () {
		var _salt = 'b45i1' + (Math.random() + 1)
				.toString(36)
				.substring(7),
			_storages = {},
			_isValidKey = function (key) {
				var type = Basil.utils.getTypeOf(key);
				return (type === 'string' && key) || type === 'number' || type === 'boolean';
			},
			_toStoragesArray = function (storages) {
				if (Basil.utils.isArray(storages))
					return storages;
				return Basil.utils.isString(storages) ? [storages] : [];
			},
			_toStoredKey = function (namespace, path) {
				var key = '';
				if (_isValidKey(path)) {
					key += path;
				} else if (Basil.utils.isArray(path)) {
					path = Basil.utils.isFunction(path.filter) ? path.filter(_isValidKey) : path;
					key = path.join('.');
				}
				return key && _isValidKey(namespace) ? namespace + '.' + key : key;
 			},
			_toKeyName = function (namespace, key) {
				if (!_isValidKey(namespace))
					return key;
				return key.replace(new RegExp('^' + namespace + '.'), '');
			},
			_toStoredValue = function (value) {
				return JSON.stringify(value);
			},
			_fromStoredValue = function (value) {
				return value ? JSON.parse(value) : null;
			};

		// HTML5 web storage interface
		var webStorageInterface = {
			engine: null,
			check: function () {
				try {
					window[this.engine].setItem(_salt, true);
					window[this.engine].removeItem(_salt);
				} catch (e) {
					return false;
				}
				return true;
			},
			set: function (key, value, options) {
				if (!key)
					throw Error('invalid key');
				window[this.engine].setItem(key, value);
			},
			get: function (key) {
				return window[this.engine].getItem(key);
			},
			remove: function (key) {
				window[this.engine].removeItem(key);
			},
			reset: function (namespace) {
				for (var i = 0, key; i < window[this.engine].length; i++) {
					key = window[this.engine].key(i);
					if (!namespace || key.indexOf(namespace) === 0) {
						this.remove(key);
						i--;
					}
				}
			},
			keys: function (namespace) {
				var keys = [];
				for (var i = 0, key; i < window[this.engine].length; i++) {
					key = window[this.engine].key(i);
					if (!namespace || key.indexOf(namespace) === 0)
						keys.push(_toKeyName(namespace, key));
				}
				return keys;
			}
		};

		// local storage
		_storages.local = Basil.utils.extend({}, webStorageInterface, {
			engine: 'localStorage'
		});
		// session storage
		_storages.session = Basil.utils.extend({}, webStorageInterface, {
			engine: 'sessionStorage'
		});

		// memory storage
		_storages.memory = {
			_hash: {},
			check: function () {
				return true;
			},
			set: function (key, value, options) {
				if (!key)
					throw Error('invalid key');
				this._hash[key] = value;
			},
			get: function (key) {
				return this._hash[key] || null;
			},
			remove: function (key) {
				delete this._hash[key];
			},
			reset: function (namespace) {
				for (var key in this._hash) {
					if (!namespace || key.indexOf(namespace) === 0)
						this.remove(key);
				}
			},
			keys: function (namespace) {
				var keys = [];
				for (var key in this._hash)
					if (!namespace || key.indexOf(namespace) === 0)
						keys.push(_toKeyName(namespace, key));
				return keys;
			}
		};

		// cookie storage
		_storages.cookie = {
			check: function () {
				if (!navigator.cookieEnabled)
					return false;
				if (window.self !== window.top) {
					// we need to check third-party cookies;
					var cookie = 'thirdparty.check=' + Math.round(Math.random() * 1000);
					document.cookie = cookie + '; path=/';
					return document.cookie.indexOf(cookie) !== -1;
				}
				return true;
			},
			set: function (key, value, options) {
				if (!this.check())
					throw Error('cookies are disabled');
				options = options || {};
				if (!key)
					throw Error('invalid key');
				var cookie = encodeURIComponent(key) + '=' + encodeURIComponent(value);
				// handle expiration days
				if (options.expireDays) {
					var date = new Date();
					date.setTime(date.getTime() + (options.expireDays * 24 * 60 * 60 * 1000));
					cookie += '; expires=' + date.toGMTString();
				}
				// handle domain
				if (options.domain && options.domain !== document.domain) {
					var _domain = options.domain.replace(/^\./, '');
					if (document.domain.indexOf(_domain) === -1 || _domain.split('.').length <= 1)
						throw Error('invalid domain');
					cookie += '; domain=' + options.domain;
				}
				// handle secure
				if (options.secure === true) {
					cookie += '; secure';
				}
				document.cookie = cookie + '; path=/';
			},
			get: function (key) {
				if (!this.check())
					throw Error('cookies are disabled');
				var encodedKey = encodeURIComponent(key);
				var cookies = document.cookie ? document.cookie.split(';') : [];
				// retrieve last updated cookie first
				for (var i = cookies.length - 1, cookie; i >= 0; i--) {
					cookie = cookies[i].replace(/^\s*/, '');
					if (cookie.indexOf(encodedKey + '=') === 0)
						return decodeURIComponent(cookie.substring(encodedKey.length + 1, cookie.length));
				}
				return null;
			},
			remove: function (key) {
				// remove cookie from main domain
				this.set(key, '', { expireDays: -1 });
				// remove cookie from upper domains
				var domainParts = document.domain.split('.');
				for (var i = domainParts.length; i >= 0; i--) {
					this.set(key, '', { expireDays: -1, domain: '.' + domainParts.slice(- i).join('.') });
				}
			},
			reset: function (namespace) {
				var cookies = document.cookie ? document.cookie.split(';') : [];
				for (var i = 0, cookie, key; i < cookies.length; i++) {
					cookie = cookies[i].replace(/^\s*/, '');
					key = cookie.substr(0, cookie.indexOf('='));
					if (!namespace || key.indexOf(namespace) === 0)
						this.remove(key);
				}
			},
			keys: function (namespace) {
				if (!this.check())
					throw Error('cookies are disabled');
				var keys = [],
					cookies = document.cookie ? document.cookie.split(';') : [];
				for (var i = 0, cookie, key; i < cookies.length; i++) {
					cookie = cookies[i].replace(/^\s*/, '');
					key = decodeURIComponent(cookie.substr(0, cookie.indexOf('=')));
					if (!namespace || key.indexOf(namespace) === 0)
						keys.push(_toKeyName(namespace, key));
				}
				return keys;
			}
		};

		return {
			init: function (options) {
				this.setOptions(options);
				return this;
			},
			setOptions: function (options) {
				this.options = Basil.utils.extend({}, this.options || Basil.options, options);
			},
			support: function (storage) {
				return _storages.hasOwnProperty(storage);
			},
			check: function (storage) {
				if (this.support(storage))
					return _storages[storage].check();
				return false;
			},
			set: function (key, value, options) {
				options = Basil.utils.extend({}, this.options, options);
				if (!(key = _toStoredKey(options.namespace, key)))
					return false;
				value = options.raw === true ? value : _toStoredValue(value);
				var where = null;
				// try to set key/value in first available storage
				Basil.utils.tryEach(_toStoragesArray(options.storages), function (storage, index) {
					_storages[storage].set(key, value, options);
					where = storage;
					return false; // break;
				}, null, this);
				if (!where) {
					// key has not been set anywhere
					return false;
				}
				// remove key from all other storages
				Basil.utils.tryEach(_toStoragesArray(options.storages), function (storage, index) {
					if (storage !== where)
						_storages[storage].remove(key);
				}, null, this);
				return true;
			},
			get: function (key, options) {
				options = Basil.utils.extend({}, this.options, options);
				if (!(key = _toStoredKey(options.namespace, key)))
					return null;
				var value = null;
				Basil.utils.tryEach(_toStoragesArray(options.storages), function (storage, index) {
					if (value !== null)
						return false; // break if a value has already been found.
					value = _storages[storage].get(key, options) || null;
					value = options.raw === true ? value : _fromStoredValue(value);
				}, function (storage, index, error) {
					value = null;
				}, this);
				return value;
			},
			remove: function (key, options) {
				options = Basil.utils.extend({}, this.options, options);
				if (!(key = _toStoredKey(options.namespace, key)))
					return;
				Basil.utils.tryEach(_toStoragesArray(options.storages), function (storage) {
					_storages[storage].remove(key);
				}, null, this);
			},
			reset: function (options) {
				options = Basil.utils.extend({}, this.options, options);
				Basil.utils.tryEach(_toStoragesArray(options.storages), function (storage) {
					_storages[storage].reset(options.namespace);
				}, null, this);
			},
			keys: function (options) {
				options = options || {};
				var keys = [];
				for (var key in this.keysMap(options))
					keys.push(key);
				return keys;
			},
			keysMap: function (options) {
				options = Basil.utils.extend({}, this.options, options);
				var map = {};
				Basil.utils.tryEach(_toStoragesArray(options.storages), function (storage) {
					Basil.utils.each(_storages[storage].keys(options.namespace), function (key) {
						map[key] = Basil.utils.isArray(map[key]) ? map[key] : [];
						map[key].push(storage);
					}, this);
				}, null, this);
				return map;
			}
		};
	};

	// Access to native storages, without namespace or basil value decoration
	Basil.memory = new Basil.Storage().init({ storages: 'memory', namespace: null, raw: true });
	Basil.cookie = new Basil.Storage().init({ storages: 'cookie', namespace: null, raw: true });
	Basil.localStorage = new Basil.Storage().init({ storages: 'local', namespace: null, raw: true });
	Basil.sessionStorage = new Basil.Storage().init({ storages: 'session', namespace: null, raw: true });

	// browser export
	window.Basil = Basil;

	// AMD export
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return Basil;
		});
	// commonjs export
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = Basil;
	}

})();

},{}],10:[function(require,module,exports){

},{}],11:[function(require,module,exports){
/*
 * EJS Embedded JavaScript templates
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/

'use strict';

/**
 * @file Embedded JavaScript templating engine. {@link http://ejs.co}
 * @author Matthew Eernisse <mde@fleegix.org>
 * @author Tiancheng "Timothy" Gu <timothygu99@gmail.com>
 * @project EJS
 * @license {@link http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0}
 */

/**
 * EJS internal functions.
 *
 * Technically this "module" lies in the same file as {@link module:ejs}, for
 * the sake of organization all the private functions re grouped into this
 * module.
 *
 * @module ejs-internal
 * @private
 */

/**
 * Embedded JavaScript templating engine.
 *
 * @module ejs
 * @public
 */

var fs = require('fs');
var path = require('path');
var utils = require('./utils');

var scopeOptionWarned = false;
var _VERSION_STRING = require('../package.json').version;
var _DEFAULT_DELIMITER = '%';
var _DEFAULT_LOCALS_NAME = 'locals';
var _NAME = 'ejs';
var _REGEX_STRING = '(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)';
var _OPTS = ['delimiter', 'scope', 'context', 'debug', 'compileDebug',
  'client', '_with', 'rmWhitespace', 'strict', 'filename'];
// We don't allow 'cache' option to be passed in the data obj
// for the normal `render` call, but this is where Express puts it
// so we make an exception for `renderFile`
var _OPTS_EXPRESS = _OPTS.concat('cache');
var _BOM = /^\uFEFF/;

/**
 * EJS template function cache. This can be a LRU object from lru-cache NPM
 * module. By default, it is {@link module:utils.cache}, a simple in-process
 * cache that grows continuously.
 *
 * @type {Cache}
 */

exports.cache = utils.cache;

/**
 * Custom file loader. Useful for template preprocessing or restricting access
 * to a certain part of the filesystem.
 *
 * @type {fileLoader}
 */

exports.fileLoader = fs.readFileSync;

/**
 * Name of the object containing the locals.
 *
 * This variable is overridden by {@link Options}`.localsName` if it is not
 * `undefined`.
 *
 * @type {String}
 * @public
 */

exports.localsName = _DEFAULT_LOCALS_NAME;

/**
 * Get the path to the included file from the parent file path and the
 * specified path.
 *
 * @param {String}  name     specified path
 * @param {String}  filename parent file path
 * @param {Boolean} isDir    parent file path whether is directory
 * @return {String}
 */
exports.resolveInclude = function(name, filename, isDir) {
  var dirname = path.dirname;
  var extname = path.extname;
  var resolve = path.resolve;
  var includePath = resolve(isDir ? filename : dirname(filename), name);
  var ext = extname(name);
  if (!ext) {
    includePath += '.ejs';
  }
  return includePath;
};

/**
 * Get the path to the included file by Options
 *
 * @param  {String}  path    specified path
 * @param  {Options} options compilation options
 * @return {String}
 */
function getIncludePath(path, options) {
  var includePath;
  var filePath;
  var views = options.views;

  // Abs path
  if (path.charAt(0) == '/') {
    includePath = exports.resolveInclude(path.replace(/^\/*/,''), options.root || '/', true);
  }
  // Relative paths
  else {
    // Look relative to a passed filename first
    if (options.filename) {
      filePath = exports.resolveInclude(path, options.filename);
      if (fs.existsSync(filePath)) {
        includePath = filePath;
      }
    }
    // Then look in any views directories
    if (!includePath) {
      if (Array.isArray(views) && views.some(function (v) {
        filePath = exports.resolveInclude(path, v, true);
        return fs.existsSync(filePath);
      })) {
        includePath = filePath;
      }
    }
    if (!includePath) {
      throw new Error('Could not find include include file.');
    }
  }
  return includePath;
}

/**
 * Get the template from a string or a file, either compiled on-the-fly or
 * read from cache (if enabled), and cache the template if needed.
 *
 * If `template` is not set, the file specified in `options.filename` will be
 * read.
 *
 * If `options.cache` is true, this function reads the file from
 * `options.filename` so it must be set prior to calling this function.
 *
 * @memberof module:ejs-internal
 * @param {Options} options   compilation options
 * @param {String} [template] template source
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `options.client`, either type might be returned.
 * @static
 */

function handleCache(options, template) {
  var func;
  var filename = options.filename;
  var hasTemplate = arguments.length > 1;

  if (options.cache) {
    if (!filename) {
      throw new Error('cache option requires a filename');
    }
    func = exports.cache.get(filename);
    if (func) {
      return func;
    }
    if (!hasTemplate) {
      template = fileLoader(filename).toString().replace(_BOM, '');
    }
  }
  else if (!hasTemplate) {
    // istanbul ignore if: should not happen at all
    if (!filename) {
      throw new Error('Internal EJS error: no file name or template '
                    + 'provided');
    }
    template = fileLoader(filename).toString().replace(_BOM, '');
  }
  func = exports.compile(template, options);
  if (options.cache) {
    exports.cache.set(filename, func);
  }
  return func;
}

/**
 * Try calling handleCache with the given options and data and call the
 * callback with the result. If an error occurs, call the callback with
 * the error. Used by renderFile().
 *
 * @memberof module:ejs-internal
 * @param {Options} options    compilation options
 * @param {Object} data        template data
 * @param {RenderFileCallback} cb callback
 * @static
 */

function tryHandleCache(options, data, cb) {
  var result;
  try {
    result = handleCache(options)(data);
  }
  catch (err) {
    return cb(err);
  }
  return cb(null, result);
}

/**
 * fileLoader is independent
 *
 * @param {String} filePath ejs file path.
 * @return {String} The contents of the specified file.
 * @static
 */

function fileLoader(filePath){
  return exports.fileLoader(filePath);
}

/**
 * Get the template function.
 *
 * If `options.cache` is `true`, then the template is cached.
 *
 * @memberof module:ejs-internal
 * @param {String}  path    path for the specified file
 * @param {Options} options compilation options
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `options.client`, either type might be returned
 * @static
 */

function includeFile(path, options) {
  var opts = utils.shallowCopy({}, options);
  opts.filename = getIncludePath(path, opts);
  return handleCache(opts);
}

/**
 * Get the JavaScript source of an included file.
 *
 * @memberof module:ejs-internal
 * @param {String}  path    path for the specified file
 * @param {Options} options compilation options
 * @return {Object}
 * @static
 */

function includeSource(path, options) {
  var opts = utils.shallowCopy({}, options);
  var includePath;
  var template;
  includePath = getIncludePath(path, opts);
  template = fileLoader(includePath).toString().replace(_BOM, '');
  opts.filename = includePath;
  var templ = new Template(template, opts);
  templ.generateSource();
  return {
    source: templ.source,
    filename: includePath,
    template: template
  };
}

/**
 * Re-throw the given `err` in context to the `str` of ejs, `filename`, and
 * `lineno`.
 *
 * @implements RethrowCallback
 * @memberof module:ejs-internal
 * @param {Error}  err      Error object
 * @param {String} str      EJS source
 * @param {String} filename file name of the EJS file
 * @param {String} lineno   line number of the error
 * @static
 */

function rethrow(err, str, flnm, lineno, esc){
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm); // eslint-disable-line
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
}

function stripSemi(str){
  return str.replace(/;(\s*$)/, '$1');
}

/**
 * Compile the given `str` of ejs into a template function.
 *
 * @param {String}  template EJS template
 *
 * @param {Options} opts     compilation options
 *
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `opts.client`, either type might be returned.
 * @public
 */

exports.compile = function compile(template, opts) {
  var templ;

  // v1 compat
  // 'scope' is 'context'
  // FIXME: Remove this in a future version
  if (opts && opts.scope) {
    if (!scopeOptionWarned){
      console.warn('`scope` option is deprecated and will be removed in EJS 3');
      scopeOptionWarned = true;
    }
    if (!opts.context) {
      opts.context = opts.scope;
    }
    delete opts.scope;
  }
  templ = new Template(template, opts);
  return templ.compile();
};

/**
 * Render the given `template` of ejs.
 *
 * If you would like to include options but not data, you need to explicitly
 * call this function with `data` being an empty object or `null`.
 *
 * @param {String}   template EJS template
 * @param {Object}  [data={}] template data
 * @param {Options} [opts={}] compilation and rendering options
 * @return {String}
 * @public
 */

exports.render = function (template, d, o) {
  var data = d || {};
  var opts = o || {};

  // No options object -- if there are optiony names
  // in the data, copy them to options
  if (arguments.length == 2) {
    utils.shallowCopyFromList(opts, data, _OPTS);
  }

  return handleCache(opts, template)(data);
};

/**
 * Render an EJS file at the given `path` and callback `cb(err, str)`.
 *
 * If you would like to include options but not data, you need to explicitly
 * call this function with `data` being an empty object or `null`.
 *
 * @param {String}             path     path to the EJS file
 * @param {Object}            [data={}] template data
 * @param {Options}           [opts={}] compilation and rendering options
 * @param {RenderFileCallback} cb callback
 * @public
 */

exports.renderFile = function () {
  var filename = arguments[0];
  var cb = arguments[arguments.length - 1];
  var opts = {filename: filename};
  var data;

  if (arguments.length > 2) {
    data = arguments[1];

    // No options object -- if there are optiony names
    // in the data, copy them to options
    if (arguments.length === 3) {
      // Express 4
      if (data.settings) {
        if (data.settings['view options']) {
          utils.shallowCopyFromList(opts, data.settings['view options'], _OPTS_EXPRESS);
        }
        if (data.settings.views) {
          opts.views = data.settings.views;
        }
      }
      // Express 3 and lower
      else {
        utils.shallowCopyFromList(opts, data, _OPTS_EXPRESS);
      }
    }
    else {
      // Use shallowCopy so we don't pollute passed in opts obj with new vals
      utils.shallowCopy(opts, arguments[2]);
    }

    opts.filename = filename;
  }
  else {
    data = {};
  }

  return tryHandleCache(opts, data, cb);
};

/**
 * Clear intermediate JavaScript cache. Calls {@link Cache#reset}.
 * @public
 */

exports.clearCache = function () {
  exports.cache.reset();
};

function Template(text, opts) {
  opts = opts || {};
  var options = {};
  this.templateText = text;
  this.mode = null;
  this.truncate = false;
  this.currentLine = 1;
  this.source = '';
  this.dependencies = [];
  options.client = opts.client || false;
  options.escapeFunction = opts.escape || utils.escapeXML;
  options.compileDebug = opts.compileDebug !== false;
  options.debug = !!opts.debug;
  options.filename = opts.filename;
  options.delimiter = opts.delimiter || exports.delimiter || _DEFAULT_DELIMITER;
  options.strict = opts.strict || false;
  options.context = opts.context;
  options.cache = opts.cache || false;
  options.rmWhitespace = opts.rmWhitespace;
  options.root = opts.root;
  options.localsName = opts.localsName || exports.localsName || _DEFAULT_LOCALS_NAME;
  options.views = opts.views;

  if (options.strict) {
    options._with = false;
  }
  else {
    options._with = typeof opts._with != 'undefined' ? opts._with : true;
  }

  this.opts = options;

  this.regex = this.createRegex();
}

Template.modes = {
  EVAL: 'eval',
  ESCAPED: 'escaped',
  RAW: 'raw',
  COMMENT: 'comment',
  LITERAL: 'literal'
};

Template.prototype = {
  createRegex: function () {
    var str = _REGEX_STRING;
    var delim = utils.escapeRegExpChars(this.opts.delimiter);
    str = str.replace(/%/g, delim);
    return new RegExp(str);
  },

  compile: function () {
    var src;
    var fn;
    var opts = this.opts;
    var prepended = '';
    var appended = '';
    var escapeFn = opts.escapeFunction;

    if (!this.source) {
      this.generateSource();
      prepended += '  var __output = [], __append = __output.push.bind(__output);' + '\n';
      if (opts._with !== false) {
        prepended +=  '  with (' + opts.localsName + ' || {}) {' + '\n';
        appended += '  }' + '\n';
      }
      appended += '  return __output.join("");' + '\n';
      this.source = prepended + this.source + appended;
    }

    if (opts.compileDebug) {
      src = 'var __line = 1' + '\n'
          + '  , __lines = ' + JSON.stringify(this.templateText) + '\n'
          + '  , __filename = ' + (opts.filename ?
                JSON.stringify(opts.filename) : 'undefined') + ';' + '\n'
          + 'try {' + '\n'
          + this.source
          + '} catch (e) {' + '\n'
          + '  rethrow(e, __lines, __filename, __line, escapeFn);' + '\n'
          + '}' + '\n';
    }
    else {
      src = this.source;
    }

    if (opts.client) {
      src = 'escapeFn = escapeFn || ' + escapeFn.toString() + ';' + '\n' + src;
      if (opts.compileDebug) {
        src = 'rethrow = rethrow || ' + rethrow.toString() + ';' + '\n' + src;
      }
    }

    if (opts.strict) {
      src = '"use strict";\n' + src;
    }
    if (opts.debug) {
      console.log(src);
    }

    try {
      fn = new Function(opts.localsName + ', escapeFn, include, rethrow', src);
    }
    catch(e) {
      // istanbul ignore else
      if (e instanceof SyntaxError) {
        if (opts.filename) {
          e.message += ' in ' + opts.filename;
        }
        e.message += ' while compiling ejs\n\n';
        e.message += 'If the above error is not helpful, you may want to try EJS-Lint:\n';
        e.message += 'https://github.com/RyanZim/EJS-Lint';
      }
      throw e;
    }

    if (opts.client) {
      fn.dependencies = this.dependencies;
      return fn;
    }

    // Return a callable function which will execute the function
    // created by the source-code, with the passed data as locals
    // Adds a local `include` function which allows full recursive include
    var returnedFn = function (data) {
      var include = function (path, includeData) {
        var d = utils.shallowCopy({}, data);
        if (includeData) {
          d = utils.shallowCopy(d, includeData);
        }
        return includeFile(path, opts)(d);
      };
      return fn.apply(opts.context, [data || {}, escapeFn, include, rethrow]);
    };
    returnedFn.dependencies = this.dependencies;
    return returnedFn;
  },

  generateSource: function () {
    var opts = this.opts;

    if (opts.rmWhitespace) {
      // Have to use two separate replace here as `^` and `$` operators don't
      // work well with `\r`.
      this.templateText =
        this.templateText.replace(/\r/g, '').replace(/^\s+|\s+$/gm, '');
    }

    // Slurp spaces and tabs before <%_ and after _%>
    this.templateText =
      this.templateText.replace(/[ \t]*<%_/gm, '<%_').replace(/_%>[ \t]*/gm, '_%>');

    var self = this;
    var matches = this.parseTemplateText();
    var d = this.opts.delimiter;

    if (matches && matches.length) {
      matches.forEach(function (line, index) {
        var opening;
        var closing;
        var include;
        var includeOpts;
        var includeObj;
        var includeSrc;
        // If this is an opening tag, check for closing tags
        // FIXME: May end up with some false positives here
        // Better to store modes as k/v with '<' + delimiter as key
        // Then this can simply check against the map
        if ( line.indexOf('<' + d) === 0        // If it is a tag
          && line.indexOf('<' + d + d) !== 0) { // and is not escaped
          closing = matches[index + 2];
          if (!(closing == d + '>' || closing == '-' + d + '>' || closing == '_' + d + '>')) {
            throw new Error('Could not find matching close tag for "' + line + '".');
          }
        }
        // HACK: backward-compat `include` preprocessor directives
        if ((include = line.match(/^\s*include\s+(\S+)/))) {
          opening = matches[index - 1];
          // Must be in EVAL or RAW mode
          if (opening && (opening == '<' + d || opening == '<' + d + '-' || opening == '<' + d + '_')) {
            includeOpts = utils.shallowCopy({}, self.opts);
            includeObj = includeSource(include[1], includeOpts);
            if (self.opts.compileDebug) {
              includeSrc =
                  '    ; (function(){' + '\n'
                  + '      var __line = 1' + '\n'
                  + '      , __lines = ' + JSON.stringify(includeObj.template) + '\n'
                  + '      , __filename = ' + JSON.stringify(includeObj.filename) + ';' + '\n'
                  + '      try {' + '\n'
                  + includeObj.source
                  + '      } catch (e) {' + '\n'
                  + '        rethrow(e, __lines, __filename, __line, escapeFn);' + '\n'
                  + '      }' + '\n'
                  + '    ; }).call(this)' + '\n';
            }else{
              includeSrc = '    ; (function(){' + '\n' + includeObj.source +
                  '    ; }).call(this)' + '\n';
            }
            self.source += includeSrc;
            self.dependencies.push(exports.resolveInclude(include[1],
                includeOpts.filename));
            return;
          }
        }
        self.scanLine(line);
      });
    }

  },

  parseTemplateText: function () {
    var str = this.templateText;
    var pat = this.regex;
    var result = pat.exec(str);
    var arr = [];
    var firstPos;

    while (result) {
      firstPos = result.index;

      if (firstPos !== 0) {
        arr.push(str.substring(0, firstPos));
        str = str.slice(firstPos);
      }

      arr.push(result[0]);
      str = str.slice(result[0].length);
      result = pat.exec(str);
    }

    if (str) {
      arr.push(str);
    }

    return arr;
  },

  _addOutput: function (line) {
    if (this.truncate) {
      // Only replace single leading linebreak in the line after
      // -%> tag -- this is the single, trailing linebreak
      // after the tag that the truncation mode replaces
      // Handle Win / Unix / old Mac linebreaks -- do the \r\n
      // combo first in the regex-or
      line = line.replace(/^(?:\r\n|\r|\n)/, '');
      this.truncate = false;
    }
    else if (this.opts.rmWhitespace) {
      // rmWhitespace has already removed trailing spaces, just need
      // to remove linebreaks
      line = line.replace(/^\n/, '');
    }
    if (!line) {
      return line;
    }

    // Preserve literal slashes
    line = line.replace(/\\/g, '\\\\');

    // Convert linebreaks
    line = line.replace(/\n/g, '\\n');
    line = line.replace(/\r/g, '\\r');

    // Escape double-quotes
    // - this will be the delimiter during execution
    line = line.replace(/"/g, '\\"');
    this.source += '    ; __append("' + line + '")' + '\n';
  },

  scanLine: function (line) {
    var self = this;
    var d = this.opts.delimiter;
    var newLineCount = 0;

    newLineCount = (line.split('\n').length - 1);

    switch (line) {
    case '<' + d:
    case '<' + d + '_':
      this.mode = Template.modes.EVAL;
      break;
    case '<' + d + '=':
      this.mode = Template.modes.ESCAPED;
      break;
    case '<' + d + '-':
      this.mode = Template.modes.RAW;
      break;
    case '<' + d + '#':
      this.mode = Template.modes.COMMENT;
      break;
    case '<' + d + d:
      this.mode = Template.modes.LITERAL;
      this.source += '    ; __append("' + line.replace('<' + d + d, '<' + d) + '")' + '\n';
      break;
    case d + d + '>':
      this.mode = Template.modes.LITERAL;
      this.source += '    ; __append("' + line.replace(d + d + '>', d + '>') + '")' + '\n';
      break;
    case d + '>':
    case '-' + d + '>':
    case '_' + d + '>':
      if (this.mode == Template.modes.LITERAL) {
        this._addOutput(line);
      }

      this.mode = null;
      this.truncate = line.indexOf('-') === 0 || line.indexOf('_') === 0;
      break;
    default:
        // In script mode, depends on type of tag
      if (this.mode) {
          // If '//' is found without a line break, add a line break.
        switch (this.mode) {
        case Template.modes.EVAL:
        case Template.modes.ESCAPED:
        case Template.modes.RAW:
          if (line.lastIndexOf('//') > line.lastIndexOf('\n')) {
            line += '\n';
          }
        }
        switch (this.mode) {
            // Just executing code
        case Template.modes.EVAL:
          this.source += '    ; ' + line + '\n';
          break;
            // Exec, esc, and output
        case Template.modes.ESCAPED:
          this.source += '    ; __append(escapeFn(' + stripSemi(line) + '))' + '\n';
          break;
            // Exec and output
        case Template.modes.RAW:
          this.source += '    ; __append(' + stripSemi(line) + ')' + '\n';
          break;
        case Template.modes.COMMENT:
              // Do nothing
          break;
            // Literal <%% mode, append as raw output
        case Template.modes.LITERAL:
          this._addOutput(line);
          break;
        }
      }
        // In string mode, just add the output
      else {
        this._addOutput(line);
      }
    }

    if (self.opts.compileDebug && newLineCount) {
      this.currentLine += newLineCount;
      this.source += '    ; __line = ' + this.currentLine + '\n';
    }
  }
};

/**
 * Escape characters reserved in XML.
 *
 * This is simply an export of {@link module:utils.escapeXML}.
 *
 * If `markup` is `undefined` or `null`, the empty string is returned.
 *
 * @param {String} markup Input string
 * @return {String} Escaped string
 * @public
 * @func
 * */
exports.escapeXML = utils.escapeXML;

/**
 * Express.js support.
 *
 * This is an alias for {@link module:ejs.renderFile}, in order to support
 * Express.js out-of-the-box.
 *
 * @func
 */

exports.__express = exports.renderFile;

// Add require support
/* istanbul ignore else */
if (require.extensions) {
  require.extensions['.ejs'] = function (module, flnm) {
    var filename = flnm || /* istanbul ignore next */ module.filename;
    var options = {
      filename: filename,
      client: true
    };
    var template = fileLoader(filename).toString();
    var fn = exports.compile(template, options);
    module._compile('module.exports = ' + fn.toString() + ';', filename);
  };
}

/**
 * Version of EJS.
 *
 * @readonly
 * @type {String}
 * @public
 */

exports.VERSION = _VERSION_STRING;

/**
 * Name for detection of EJS.
 *
 * @readonly
 * @type {String}
 * @public
 */

exports.name = _NAME;

/* istanbul ignore if */
if (typeof window != 'undefined') {
  window.ejs = exports;
}

},{"../package.json":13,"./utils":12,"fs":10,"path":14}],12:[function(require,module,exports){
/*
 * EJS Embedded JavaScript templates
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/

/**
 * Private utility functions
 * @module utils
 * @private
 */

'use strict';

var regExpChars = /[|\\{}()[\]^$+*?.]/g;

/**
 * Escape characters reserved in regular expressions.
 *
 * If `string` is `undefined` or `null`, the empty string is returned.
 *
 * @param {String} string Input string
 * @return {String} Escaped string
 * @static
 * @private
 */
exports.escapeRegExpChars = function (string) {
  // istanbul ignore if
  if (!string) {
    return '';
  }
  return String(string).replace(regExpChars, '\\$&');
};

var _ENCODE_HTML_RULES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&#34;',
  "'": '&#39;'
};
var _MATCH_HTML = /[&<>\'"]/g;

function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
}

/**
 * Stringified version of constants used by {@link module:utils.escapeXML}.
 *
 * It is used in the process of generating {@link ClientFunction}s.
 *
 * @readonly
 * @type {String}
 */

var escapeFuncStr =
  'var _ENCODE_HTML_RULES = {\n'
+ '      "&": "&amp;"\n'
+ '    , "<": "&lt;"\n'
+ '    , ">": "&gt;"\n'
+ '    , \'"\': "&#34;"\n'
+ '    , "\'": "&#39;"\n'
+ '    }\n'
+ '  , _MATCH_HTML = /[&<>\'"]/g;\n'
+ 'function encode_char(c) {\n'
+ '  return _ENCODE_HTML_RULES[c] || c;\n'
+ '};\n';

/**
 * Escape characters reserved in XML.
 *
 * If `markup` is `undefined` or `null`, the empty string is returned.
 *
 * @implements {EscapeCallback}
 * @param {String} markup Input string
 * @return {String} Escaped string
 * @static
 * @private
 */

exports.escapeXML = function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
        .replace(_MATCH_HTML, encode_char);
};
exports.escapeXML.toString = function () {
  return Function.prototype.toString.call(this) + ';\n' + escapeFuncStr;
};

/**
 * Naive copy of properties from one object to another.
 * Does not recurse into non-scalar properties
 * Does not check to see if the property has a value before copying
 *
 * @param  {Object} to   Destination object
 * @param  {Object} from Source object
 * @return {Object}      Destination object
 * @static
 * @private
 */
exports.shallowCopy = function (to, from) {
  from = from || {};
  for (var p in from) {
    to[p] = from[p];
  }
  return to;
};

/**
 * Naive copy of a list of key names, from one object to another.
 * Only copies property if it is actually defined
 * Does not recurse into non-scalar properties
 *
 * @param  {Object} to   Destination object
 * @param  {Object} from Source object
 * @param  {Array} list List of properties to copy
 * @return {Object}      Destination object
 * @static
 * @private
 */
exports.shallowCopyFromList = function (to, from, list) {
  for (var i = 0; i < list.length; i++) {
    var p = list[i];
    if (typeof from[p] != 'undefined') {
      to[p] = from[p];
    }
  }
  return to;
};

/**
 * Simple in-process cache implementation. Does not implement limits of any
 * sort.
 *
 * @implements Cache
 * @static
 * @private
 */
exports.cache = {
  _data: {},
  set: function (key, val) {
    this._data[key] = val;
  },
  get: function (key) {
    return this._data[key];
  },
  reset: function () {
    this._data = {};
  }
};

},{}],13:[function(require,module,exports){
module.exports={
  "_args": [
    [
      {
        "raw": "ejs",
        "scope": null,
        "escapedName": "ejs",
        "name": "ejs",
        "rawSpec": "",
        "spec": "latest",
        "type": "tag"
      },
      "C:\\Users\\Anastasiya\\Documents\\GitHub\\JS-TestingProject"
    ]
  ],
  "_from": "ejs@latest",
  "_id": "ejs@2.5.7",
  "_inCache": true,
  "_location": "/ejs",
  "_nodeVersion": "6.9.1",
  "_npmOperationalInternal": {
    "host": "s3://npm-registry-packages",
    "tmp": "tmp/ejs-2.5.7.tgz_1501385411193_0.3807816591579467"
  },
  "_npmUser": {
    "name": "mde",
    "email": "mde@fleegix.org"
  },
  "_npmVersion": "3.10.8",
  "_phantomChildren": {},
  "_requested": {
    "raw": "ejs",
    "scope": null,
    "escapedName": "ejs",
    "name": "ejs",
    "rawSpec": "",
    "spec": "latest",
    "type": "tag"
  },
  "_requiredBy": [
    "#DEV:/",
    "#USER"
  ],
  "_resolved": "https://registry.npmjs.org/ejs/-/ejs-2.5.7.tgz",
  "_shasum": "cc872c168880ae3c7189762fd5ffc00896c9518a",
  "_shrinkwrap": null,
  "_spec": "ejs",
  "_where": "C:\\Users\\Anastasiya\\Documents\\GitHub\\JS-TestingProject",
  "author": {
    "name": "Matthew Eernisse",
    "email": "mde@fleegix.org",
    "url": "http://fleegix.org"
  },
  "bugs": {
    "url": "https://github.com/mde/ejs/issues"
  },
  "contributors": [
    {
      "name": "Timothy Gu",
      "email": "timothygu99@gmail.com",
      "url": "https://timothygu.github.io"
    }
  ],
  "dependencies": {},
  "description": "Embedded JavaScript templates",
  "devDependencies": {
    "browserify": "^13.0.1",
    "eslint": "^3.0.0",
    "git-directory-deploy": "^1.5.1",
    "istanbul": "~0.4.3",
    "jake": "^8.0.0",
    "jsdoc": "^3.4.0",
    "lru-cache": "^4.0.1",
    "mocha": "^3.0.2",
    "uglify-js": "^2.6.2"
  },
  "directories": {},
  "dist": {
    "shasum": "cc872c168880ae3c7189762fd5ffc00896c9518a",
    "tarball": "https://registry.npmjs.org/ejs/-/ejs-2.5.7.tgz"
  },
  "engines": {
    "node": ">=0.10.0"
  },
  "homepage": "https://github.com/mde/ejs",
  "keywords": [
    "template",
    "engine",
    "ejs"
  ],
  "license": "Apache-2.0",
  "main": "./lib/ejs.js",
  "maintainers": [
    {
      "name": "mde",
      "email": "mde@fleegix.org"
    }
  ],
  "name": "ejs",
  "optionalDependencies": {},
  "readme": "ERROR: No README data found!",
  "repository": {
    "type": "git",
    "url": "git://github.com/mde/ejs.git"
  },
  "scripts": {
    "coverage": "istanbul cover node_modules/mocha/bin/_mocha",
    "devdoc": "jake doc[dev]",
    "doc": "jake doc",
    "lint": "eslint \"**/*.js\" Jakefile",
    "test": "jake test"
  },
  "version": "2.5.7"
}

},{}],14:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":15}],15:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[4]);
