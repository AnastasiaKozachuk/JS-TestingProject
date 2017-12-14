var Templates = require('./templates');

var markOfUser=0;
var  intervalID;

var hour=0;
var minute=0;
var second =60;
function startQuiz(data){

    console.log(data);
    setQuizName(data.nameQuiz);
    setQuestion(data.quiz);

    if(parseInt(data.time)!=0){
        hour = Math.floor(parseInt(data.time)/60);
        minute =(parseInt( data.time)-(hour*60))-1;
        setStartTime(parseInt( data.time));
        intervalID = setTimeout(timer, 1000);
    }
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



function getLenght(object){
    var i=0;
    for(var key in  object){
        i++;
    }
    return i;
}

function setCheckboxQuest(objQuest,count){
    var $answer = $(Templates.Answers_Template());

    $answer.find("#answersName").text(objQuest.questionName);
    $answer.find("#answerMark").text(objQuest.mark+" б.");


    for(var key in  objQuest.answers){
        addVariantCheckBox(key, $answer,count,objQuest);
    }



    $("#main-show").append($answer);
}




function addVariantCheckBox(key, $answer,count,objQuest){
    var $checkQs =$(Templates.Checkbox_Template());
    var numberOfCorAnsvers = getLenght(objQuest.correctAnswers);
    var nameAttrib = String($checkQs.find("#checkboxAns").attr("name"))+count;
    $checkQs.find("#checkboxAns").attr("name",nameAttrib);
    $checkQs.find("#variantCheckBox").text(objQuest.answers[key]);
    $answer.find("#answersArea").append($checkQs);

    $checkQs.find("#checkboxAns").change(function () {
        if(this.checked){
            if ( existInObject($checkQs.find("#variantCheckBox").text(),objQuest.correctAnswers)) {
                markOfUser+= objQuest.mark/numberOfCorAnsvers;
            }
        }
        else{
            if ( existInObject($checkQs.find("#variantCheckBox").text(),objQuest.correctAnswers)) {
                markOfUser-= objQuest.mark/numberOfCorAnsvers;
            }
        }
        console.log(markOfUser);
    });
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

        if(existInObject($textQs.find("#textVariantAns").val(),objQuest.correctAnswers)&&$answer.find("#answersArea").attr("answer")=="no"){
            markOfUser+= parseInt(objQuest.mark);
            $answer.find("#answersArea").attr("answer","yes");
        }else if(!existInObject($textQs.find("#textVariantAns").val(),objQuest.correctAnswers)&&$answer.find("#answersArea").attr("answer")=="yes"){
            markOfUser-= parseInt(objQuest.mark);
            $answer.find("#answersArea").attr("answer","no");
        }


        console.log(markOfUser);

    });


    $answer.find("#answersArea").append($textQs);



    $("#main-show").append($answer);
}



$("#endQuize").click(function () {
    clearInterval(intervalID);
    alert(localStorage.getItem("NameUser")+" : "+markOfUser);
});


/*$(function(){
    $("#timer").draggable();
});*/


function timer(){


        var end = false;

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

            alert(localStorage.getItem("NameUser")+" : "+markOfUser);
        }else{
            setTime();
            setTimeout(timer, 1000);
        }
    }


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