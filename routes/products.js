var express    = require("express");
var router     = express.Router();
var Product    = require("../models/product");
var middleware = require("../middleware/index");

//index - show all Shoes
router.get("/", function(req, res){
    // Get all Shoes from DB
    Product.find({}, function(err, allProducts){
       if(err){
           console.log(err);
       } else {
          res.render("products/index",{products:allProducts});
       }
    });
});

//CREATE   
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to shop array
    var name = req.body.name;
    var price= req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id:req.user._id,
        username:req.user.username
    } 
    var newProduct = {name: name, price: price, image: image, description: desc, author: author}
    // Create a new shoe and save to DB
    Product.create(newProduct, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to shoe page
            console.log(newlyCreated);
            res.redirect("/products");
        }
    });
});

//NEW - show form to create new shoe
router.get("/new" ,middleware.isLoggedIn, function(req, res) {
    res.render("products/new");
});
// SHOW - shows more info about one shoe
router.get("/:id", function(req, res){
    //find the shoe with provided ID
    Product.findById(req.params.id).populate("comments").exec(function(err, foundProduct){
        if(err || !foundProduct){
          console.log(err);
          req.flash('error', 'Sorry, that product does not exist!');
          res.redirect('/products');
        } else {
            console.log(foundProduct)
            //render show template with that shoe
            res.render("products/show", {product: foundProduct});
        }
    });
});

router.get("/:id/edit",middleware.checkProductOwnership, function(req, res) {
    Product.findById(req.params.id, function(err, foundProduct){
            res.render("products/edit", {product: foundProduct})
    })
});

router.put("/:id",middleware.checkProductOwnership, function(req,res){
    Product.findByIdAndUpdate(req.params.id, req.body.product, function(err, updatedProduct){
        if(err){
            res.redirect("/products")
        } else {
            res.redirect("/products/" + req.params.id)
        }
    })
});

router.delete("/:id",middleware.checkProductOwnership, function(req, res){
    Product.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/products");
        } else {
            res.redirect("/products")
        }
    })
});


module.exports= router;