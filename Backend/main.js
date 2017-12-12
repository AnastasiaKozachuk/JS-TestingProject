
var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose	=	require('mongoose');
function configureEndpoints(app) {
    var pages = require('./pages');
    var api = require('./api');



    mongoose.connect('mongodb://localhost/DBName');
    var db=	mongoose.connection;

    db.on('error',function(err){
        console.log('connection	error:',err.message);
    });

    db.once('open',function callback(){
        console.log("Connected to	DB!");
    });



    //Налаштування URL за якими буде відповідати сервер
    //Отримання списку піц
    app.get('/api/get-Quiz/', api.getQuiz);
    app.post('/api/get-ID/', api.getID);

    //Сторінки
    //Головна сторінка
    app.get('/', pages.mainPage);

    //Сторінка замовлення
    app.get('/create-page.html', pages.createPage);

    //Якщо не підійшов жоден url, тоді повертаємо файли з папки www
    app.use(express.static(path.join(__dirname, '../design')));
}

function startServer(port) {
    //Створюється застосунок
    var app = express();

    //Налаштування директорії з шаблонами
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    //Налаштування виводу в консоль списку запитів до сервера
    app.use(morgan('dev'));

    //Розбір POST запитів
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    //Налаштовуємо сторінки
    configureEndpoints(app);

    //Запуск додатка за вказаним портом
    app.listen(port, function () {
        console.log('My Application Running on http://localhost:'+port+'/');
    });
}

exports.startServer = startServer;