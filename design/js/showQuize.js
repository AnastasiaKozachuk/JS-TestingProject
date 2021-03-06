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