exports.mainPage = function(req, res) {
    res.render('mainPage', {
      //  pageTitle: 'Quizzy learning'
    });
};

exports.createPage = function(req, res) {
    res.render('createPage', {
       // pageTitle: 'Create quiz'
    });
};