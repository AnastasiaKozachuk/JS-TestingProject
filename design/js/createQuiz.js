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
