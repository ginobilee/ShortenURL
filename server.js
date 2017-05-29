var express = require('express'),
    addRouter = require('./addRouter'),
    listDocs = require('./listDocs'),
    urlRouter = require('./urlRouter'),
    ejs = require('ejs'),
    app = express();
    
app.use(express.static(__dirname+'/public'));
app.set('views',__dirname+'/views');
app.set('view engine','html');
app.engine('html',ejs.renderFile);
//app.engine('')
app.use('/add',addRouter);
app.use('/list',listDocs);
app.use(urlRouter);

app.listen('8080');