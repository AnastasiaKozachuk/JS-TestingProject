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


    if(quiz_info.id==""){

        var idQuiz=randomInteger(1000000, 9999999);

        var newQuiz = new Quiz({
            id:idQuiz,
            quiz:quiz_info
        });

        newQuiz.save(function (err, newQz) {
            if (err){
                console.log("Something goes wrong with user " + newQz._id);
            }
        });


        res.send(String(newQuiz.id));
    }else{
        Quiz.update(
            { id:	quiz_info.id },
            { quiz:quiz_info },
            function(err,	quiz){} );

        res.send(String(quiz_info.id));
    }



    /*function getArray() {
     var idQuiz=randomInteger(1,5);
     Quiz.find({ name: idQuiz }, function(err,	quiz){
         console.log(quiz);
             if(quiz.length>0){
                 getArray();
             }

     });
 }*/


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
   // res.send(Pizza_List);
};