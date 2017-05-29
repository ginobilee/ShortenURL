'use strict'

var mongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var url = 'mongodb://localhost:27017/data';


exports = module.exports = DBManager;

function DBManager(){
}
DBManager.prototype.findDoc = function(query,callback,nfCallback){
    
    if(query){
        
        mongoClient.connect(url,function(err,db){
            assert.equal(err,null);
            var shorts = db.collection('shorts');
            console.log(query);
            shorts.find(query).toArray(function(err,docs){
                console.log('find complete in db')
                assert.equal(err,null);
                //console.log(docs);
                if(docs.length>0){
                    callback(docs);
                }else{
                    nfCallback();
                }
                db.close();
            })
        })
        
    }else{
        console.log('DBManager:invalid query');
    }

}

DBManager.prototype.listDocs = function(callback,nfCallback){
    //console.log('manager:headersSent1?:'+myres.headersSent);

    mongoClient.connect(url,function(err,db){
        assert.equal(err,null);
        var shorts = db.collection('shorts');
        shorts.find({}).toArray(function(err,docs){
            assert.equal(err,null);
            if(docs.length>0){
                //console.log('manager:headersSent1.5?:'+myres.headersSent);
                callback(docs);
            }else{
                nfCallback();
            }
            db.close();
            return;
        })
    })

}

DBManager.prototype.insertOne = function(doc,callback,nfCallback){

    mongoClient.connect(url,function(err,db){
        assert.equal(err,null);
        var shorts = db.collection('shorts');
        shorts.insertOne(doc,function(err,result){
            if(err){
                nfCallback();
            }else{
                callback();
            }
            db.close();
        })
    })    
    
}