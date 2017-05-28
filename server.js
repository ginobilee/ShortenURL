var express = require('express'),
    addRouter = require('./addRouter'),
    listDocs = require('./listDocs'),
    urlRouter = require('./urlRouter'),
    app = express();
    
app.use('/add',addRouter);
app.use('/list',listDocs);
app.use('',urlRouter);

app.listen('8080');