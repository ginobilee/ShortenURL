'use strict'

var express = require('express'),
    DBManager = require('./DBManager');

var router = exports = module.exports = express.Router();
var dbManager = new DBManager();

router.use('/:pid',function(req,res,next){
    if(req.params.pid == 'favicon.ico' || req.params.pid == 'style.css'){
        console.log('favicon here?')
        res.end();
        return;
    }
    console.log('urlRouter');
    
    var re = /^[0-9]{4}$/,pid = req.params.pid;
    console.log('got the pid and is:'+pid);
    
    if(re.test(pid)){
        var query = {
            shortID:+pid
        }
        dbManager.findDoc(query,function(docs){
            console.log('router: got the doc ');
            var hostProto = req.headers['x-forwarded-proto'];
            var newURL = docs[0].originalURL;
            res.redirect(newURL);
        },function(){
            console.log('router:not found');
            res.end('Shorten url not found ,Please attach a new one!')
        });//get record
        
    }else{
        console.log('router:invalid query ,attach a four-number string');
        next();
        //res.end('Shorten url not found ,Please request /add/[url] to get a shorten url!')
    }    
})

router.use(function(req,res){
    res.render('index');
})