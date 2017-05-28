'use strict'

var EventEmitter = require('events');
var mongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var url = 'mongodb://localhost:27017/data';

class MyEmitter extends EventEmitter{}

exports = module.exports = DBManager;

function DBManager(){
    this.emitter = new MyEmitter();
}
DBManager.prototype.findDoc = function(query,callback,nfCallback){
    var emitter = this.emitter;
    if(emitter.listenerCount('found')==0){
        emitter.on('found',callback);
    }
    if(emitter.listenerCount('notFound') == 0){
        emitter.on('notFound',nfCallback);
    }
    console.log('in find one emitter Now has %s found listeners.',emitter.listenerCount('found'));
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
                    emitter.emit('found',docs);
                }else{
                    emitter.emit('notFound');
                }
                db.close();
            })
        })
        
    }else{
        console.log('DBManager:invalid query');
    }

}

DBManager.prototype.listDocs = function(callback,nfCallback){
    var emitter = this.emitter;
    if(emitter.listenerCount('listFound')==0){
        emitter.on('listFound',callback);
    }
    if(emitter.listenerCount('noList') == 0){
        emitter.on('noList',nfCallback);
    }
    //console.log('in list emitter Now has %s found listeners.',emitter.listenerCount('found'));

    mongoClient.connect(url,function(err,db){
        assert.equal(err,null);
        var shorts = db.collection('shorts');
        shorts.find({}).toArray(function(err,docs){
            assert.equal(err,null);
            if(docs.length>0){
                emitter.emit('listFound',docs);
            }else{
                emitter.emit('noList');
            }
            db.close();
        })
    })

}

DBManager.prototype.insertOne = function(doc,callback,nfCallback){
    
    var emitter = this.emitter;
    if(emitter.listenerCount('success')==0){
        emitter.on('success',callback);
    }
    if(emitter.listenerCount('fail') == 0){
        emitter.on('fail',nfCallback);
    }

    mongoClient.connect(url,function(err,db){
        assert.equal(err,null);
        var shorts = db.collection('shorts');
        shorts.insertOne(doc,function(err,result){
            if(err){
                emitter.emit('fail');
            }else{
                emitter.emit('success');
            }
            db.close();
        })
    })    
    
}