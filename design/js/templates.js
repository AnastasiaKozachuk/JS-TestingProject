var fs = require('fs');
var ejs = require('ejs');


exports.Question_Template = ejs.compile(fs.readFileSync('./design/ejs/questionTemplate.ejs', "utf8"));
exports.Variant_Template = ejs.compile(fs.readFileSync('./design/ejs/variantsQuestTempl.ejs', "utf8"));
exports.Answers_Template = ejs.compile(fs.readFileSync('./design/ejs/answersTempl.ejs', "utf8"));
exports.Checkbox_Template = ejs.compile(fs.readFileSync('./design/ejs/checkboxAnsTemp.ejs', "utf8"));
exports.Radio_Template = ejs.compile(fs.readFileSync('./design/ejs/radioAnsTemp.ejs', "utf8"));
exports.Text_Template = ejs.compile(fs.readFileSync('./design/ejs/textAnsTemp.ejs', "utf8"));

