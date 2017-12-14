var mongoose	=	require('mongoose');
var quizSchema=	new	mongoose.Schema({
    id: Number,
    quiz:	Object,
});

var Quiz = mongoose.model('Quiz',quizSchema);

exports.getID = function(req, res) {
    var quiz_info = req.body;

    function randomInteger(min, max) {
        var rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand;
    }

    var numberOfID=0;
    function sendQuiz() {
        var idQuiz = randomInteger(1000000, 9999999);
        Quiz.find({id: idQuiz}, function (err, quiz) {
            numberOfID ++;
            console.log(quiz);
            if (quiz.length > 0) {
                if(numberOfID>8999999){
                    res.send(String(-1));
                }else{
                    sendQuiz();
                }
            } else {
                var newQuiz = new Quiz({
                    id:idQuiz,
                    quiz:quiz_info
                });

                newQuiz.save(function (err, newQz) {
                    if (err){
                        console.log("Something goes wrong with quiz" + newQz._id);
                    }
                });

                Quiz.find(function (err, allquiz) {
                    if(err){
                        console.log("err");
                    }else{
                        console.log(allquiz);
                    }
                });

                res.send(String(newQuiz.id));

            }


        });
    }


    if(quiz_info.id==""){

        sendQuiz();

    }else{
        Quiz.update(
            { id:	quiz_info.id },
            { quiz:quiz_info },
            function(err,	quiz){} );

        res.send(String(quiz_info.id));
    }





    /*Quiz.find(function (err, allquiz) {
                if(err){
                    console.log("err");
                }else{
                    allquiz.forEach(function (t) {
                        t.remove();
                    });
                }
            });*/


   /* Quiz.find(function (err, allquiz) {
        if(err){
            console.log("err");
        }else{
            console.log(allquiz);
        }
    });*/

};



exports.getQuiz = function(req, res) {

    var quizAns={
        nameQuiz:"",
        quiz:"",
        time:""
    }

    Quiz.find({ id: req.body.id }, function(err,quiz){
        if(quiz[0]!==undefined){
            quizAns.nameQuiz=quiz[0].quiz.nameQuiz;
            quizAns.quiz=quiz[0].quiz.quiz;
            quizAns.time=quiz[0].quiz.time;
        }
        res.send(quizAns);
    });

};