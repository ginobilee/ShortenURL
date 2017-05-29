'use strict'

var express = require('express'),
    http = require('http'),
    DBManager = require('./DBManager');
    
var dbManager = new DBManager();
    
var router = exports = module.exports = express.Router();

router.use(function(req,res,next){//check if the url is valid
    var url = req.url.slice(1),re1 = /^http[s]?:\/\/[\S]+.[A-Za-z]+/;
    console.log(url);
    
    var valid = re1.test(url);
    if(valid){
                var protocol = url.match(/http[s]?:/)[0],original = url.slice(url.indexOf('//')+2);
                console.log(protocol+'+' +original);
                if(protocol == 'http:'){//check for http
                    
                    var opt = {
                        protocol:protocol,
                        hostname:original,
                        method:'GET'
                    };        
                    //var reqHTTP = http.request(opt,function(response){
                    var reqHTTP = http.request(opt,function(response){
                      if(response.statusCode >= 200 && response.statusCode < 400){  
                        console.log('Got response from original url!');
                        req.mine_original = original,req.mine_proto = protocol;
                        next();
                      }else{
                        res.end('Can not access this webpage!Please enter a new one.')  
                      }
                    });
                    reqHTTP.setTimeout(2500,function(){
                        console.log('timeout');
                        reqHTTP.abort();
                        res.end('Can not access this webpage!Please enter a new one.')
                    })
                    reqHTTP.on('error',function(e){
                        console.log('got error:'+e);
                        res.end('Can not access this webpage!Please enter a new one.')
                    });
                    reqHTTP.end();  
                }else{
                    req.mine_original = original,req.mine_proto = protocol;
                    next();//if https,not check
                    return;
                }
    }else{
                res.end('Invalid url,please add a valid url!')
    }
});

router.use(function(req,res,next){//check if db has the document,yes then return the record

    console.log('come to check if the record is in database');
    var orig = req.mine_original,proto = req.mine_proto;
    dbManager.findDoc({'originalURL':proto+'//'+orig},(docs) => {

            console.log('Found one matched record.I dont need to generate .');
            var rand = docs[0].shortID,
                ori = docs[0].originalURL,
                o = {original_url:ori,
                        short_url:req.protocol+'://'+req.hostname+'/'+rand
                };
            var result = JSON.stringify(o);
            try{
                console.log('Is headers sent?:'+res.headersSent);
                res.end(result);
                return ;
            }
            catch(e){
                console.log(e);
            }
            
    },function(){
            console.log('router:not found the url in db')
            next();//go on to generate one record
    });
    
});
    
router.use(function(req,res){//insert into db,return shorted and original url
    console.log('begin generate new record');
    var rand = geneRand();
    var message = {
        original_url:req.mine_proto + '//' + req.mine_original,
        short_url:req.protocol+'://'+req.hostname+'/'+rand
    };
    console.log(JSON.stringify(message));
    var doc = {
        shortID:rand,
        originalURL:req.mine_proto + '//' + req.mine_original
    }
    dbManager.insertOne(doc,function(){
        console.log('router:insert successful');
        var result = JSON.stringify(message);
        res.end(result);
        return;
    },function(){
        console.log('router:insert failed')
        res.end('insert failed.try agian.')
        return;
    });
})

function geneRand(val){
    var rand = 1000 + Math.floor(9000 * Math.random());
    return rand;
}