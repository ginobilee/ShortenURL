'use strict'

var express = require('express'),
    DBManager = require('./DBManager');

var router = exports = module.exports = express.Router();
var dbManager = new DBManager();

router.use('/:pid',function(req,res){
    var re = /^[0-9]{4}$/,pid = req.params.pid;
    console.log('got the pid and is:'+pid);
    
    if(re.test(pid)){
        var query = {
            shortID:+pid
        }
        dbManager.findDoc(query,function(doc){
            console.log('router got the found event and doc is :');
            var result = {
                original_url:req.url,
                short_url:req.hostname+doc[0].shortID
            };
            console.log(result.original_url+result.short_url);
            res.end(JSON.stringify(result));
        },function(){
            console.log('router:not found');
            res.end('url not found ,Please attach a new one!')
        });//get record
        
    }else{
        console.log('router:invalid query ,attach a four-number string')
        res.end('test it')
    }    
})