var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var fs = require('fs');


var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('mockup', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'files' database");
        db.collection('files', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'files' collection doesn't exist. Creating it with sample data...");
                //populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    var img = fs.readFileSync(__dirname + "/../contents/images/" + id);
    console.log(img);
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
};

exports.addFiles = function(req, res) {
    var file = req.files.files[0];
    console.log("image",file );
    fs.readFile(file.path, function (err, data) {
        var imageName = file.name;
        /// If there's an error
        if(!imageName){
            console.log("There was an error")
            res.redirect("/");
            res.end();
        } else {
            console.log("read");
          var newPath = __dirname + "/../contents/images/" + imageName;
          console.log("data", newPath);

          /// write file to uploads/fullsize folder
          fs.writeFile(newPath, data, function (err) {

            /// let's see it
           // res.redirect("/uploads/fullsize/" + imageName);
            res.send("{ name:"+imageName+ "}");
          });
        }
    });
};
