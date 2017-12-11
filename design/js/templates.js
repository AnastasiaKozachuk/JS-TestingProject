var fs = require('fs');
var ejs = require('ejs');


exports.Question_Template = ejs.compile(fs.readFileSync('./design/ejs/questionTemplate.ejs', "utf8"));
exports.Variant_Template = ejs.compile(fs.readFileSync('./design/ejs/variantsQuestTempl.ejs', "utf8"));

