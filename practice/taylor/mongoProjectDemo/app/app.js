/**
 * Created by taylor on 12/12/16.
 */
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log('Connected successfully to server!');

    insertDocuments(db, function() {
        removeDocument(db, function() {
            findDocuments(db, function() {
                indexCollection(db, function() {
                    db.close();
                });
            });
        });
    });
});


/*
  result: Contains the result document from MongoDB
  ops: Contains the documents inserted with added _id fields
  connection: Contains the connection used to perform the insert
*/
var insertDocuments = function(db, callback) {
    // Get the document collection
    var collection = db.collection('documents');
    // Insert some documents
    collection.insertMany([{a : 1}, {a : 2}, {a : 3}], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
        callback(result);
    });
}

var findDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Find some documents，{} => filter=all, {'a':3} => filter={'a':3}
    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs);
        callback(docs);
    });
}

var updateDocument = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');

    // Update document where a is 2, set b equal to 1
    collection.updateOne({a : 2}, {$set : {b : 1}}, function(err, result){
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Updated the document with the field a equal to 2");
        callback(result);
    });
}

var removeDocument = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');

    // Insert some documents
    collection.deleteOne({a : 3}, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Removed the document with the field a equal to 3");
        callback(result);
    });
}

var indexCollection = function(db, callback) {
    db.collection('documents').createIndex(
        {a : 1},
        null,
        function(err, results) {
            console.log(results);
            callback();
        }
    );
}