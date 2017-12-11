
var Pizza_List = require('./data/Pizza_List');
exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};