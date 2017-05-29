'use strict'

var express = require('express'),
    DBManager = require('./DBManager');
    
var dbManager = new DBManager();

var router = exports = module.exports = express.Router();

router.use(function(req,res){
    console.log('listRouter');
    //console.log('router headersSent1?:'+res.headersSent);
    dbManager.listDocs((docs) => {
      console.log('router:Successfully get all documents!');
      //console.log('router:headerseng2?:'+res.headersSent);
      res.end(JSON.stringify(docs));
      return ;
    },function(){
        console.log('router:no record');
        res.end('There is no record in database now,Please request /add/url to insert one!');
        return;
    },res);
    return ;
})