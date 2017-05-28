'use strict'

var express = require('express'),
    DBManager = require('./DBManager');
    
var dbManager = new DBManager();

var router = exports = module.exports = express.Router();

router.use(function(req,res){
    dbManager.listDocs((docs) => {
      console.log('router:Successfully get all documents!');
      console.log(req.fresh);
      console.log(res.headersSent);
      res.end(JSON.stringify(docs));
    },function(){
        console.log('router:no record');
        console.log(req.fresh);
        res.end('There is no record in database now,Please request /add/url to insert one!');
    });
    return ;
})