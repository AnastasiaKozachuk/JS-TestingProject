var Templates = require('./templates');

var markOfUser=0;

function startQuiz(data){

    console.log(data);
    setQuizName(data.nameQuiz);
    setQuestion(data.quiz);
    //must be ended
    setTime(data.time);
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
    alert(markOfUser);
});



var hour;
var minute;
var second =60;
function timer(){


        var end = false;

        if( second > 0 ) second--;
        else{
            second = 60;

            if( minute > 0 ) minute--;
            else{
                second = 60;

                if( hour > 0 ) hour--;
                else end = true;
            }
        }

        if(end){
            clearInterval(intervalID);
            alert("Таймер сработал!");
        }else{

            setTimeout(timer, 1000);
        }
    }




function setTime(time){
    $("#timer").text(time);
    minutes=time;
}

exports.startQuiz = startQuiz;