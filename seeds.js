var mongoose = require("mongoose");
var Prodct = require("./models/product");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Nike", 
        image: "https://www.backalleymusic.ca/images/large/nike%20shoes-337ays.jpg",
        description: "nice"
    },
    {
        name: "Nike", 
        image: "https://c.static-nike.com/a/images/t_PDP_1280_v1/f_auto/hfs07wimap5poyqftxsa/air-force-1-high-07-mens-shoe-xqTP3zzb.jpg",
        description: "nice"
    },
    {
        name: "Nike", 
        image: "https://www.backalleymusic.ca/images/large/nike%20shoes-337ays.jpg",
        description: "nice"
    }
]

function seedDB(){
   //Remove all campgrounds
   Prodct.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed shoes!");
         //add a few campgrounds
         Comment.deleteMany({}, function(err){
             if(err){console.log(err);
             }
             console.log("removed comments!");
       
          data.forEach(function(seed){
            Prodct.create(seed, function(err, product){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a shoe");
                    //create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                product.comments.push(comment);
                                product.save();
                                console.log("Created new comment");
                            }
                        });
                  }
              });
          });
      }); 
   });
    //add a few comments
}


module.exports = seedDB;
