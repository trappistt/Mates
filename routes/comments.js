var express    = require("express");
var router     = express.Router({mergeParams: true});
var Product    = require("../models/product");
var Comment    = require("../models/comment");
var middleware = require("../middleware/index");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find campground by id
    console.log(req.params.id);
    Product.findById(req.params.id, function(err, product){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {product: product});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup campground using ID
   Product.findById(req.params.id, function(err, product){
       if(err){
           console.log(err);
           res.redirect("/products");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username
               comment.author.id = req.user._id;
               comment.author.username= req.user.username;
               comment.save();
               //save cm
               product.comments.push(comment);
               product.save();
               console.log(comment);
               res.redirect('/products/' + product._id);
           }
        });
       }
   });
});


router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res) {
    Product.findById(req.params.id, function(err, foundProduct) {
        if(err || !foundProduct){
          req.flash('error', 'No, Product found!');
          return res.redirect("/products");
    }
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {product_id: req.params.id, comment: foundComment});
      }
   });
});
});


router.put("/:comment_id",middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/products/" + req.params.id );
      }
   });
});



router.delete("/:id",middleware.checkCommentOwnership, function(req, res){
    Product.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/products" + req.params.id)
        }
    })
});

module.exports = router;