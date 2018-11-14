var express       = require("express"),
    router        = express.Router(),
    passport      = require("passport"),
    Comment       = require("../models/comment"),
    User          = require("../models/user");



router.get("/" , function(req, res){
    res.render("landing");
});

//===================
//Auth Routes 
//===================
router.get("/register",function(req, res){
   res.render("register");
 });

router.post("/register", function(req, res){
var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to Mates " + user.username);
           res.redirect("/products"); 
        });
    });
});

//Login
router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
     successRedirect: "/products",
     failureRedirect: "/login"
 }),function(req,res){
     
 });
 
 //LogOut
 router.get("/logout", function(req, res) {
     req.logout();
     req.flash("success", "Logged you out!");
     res.redirect("/products");
 });
 
 
 function isLoggedIn(req,res,next) {
     if(req.isAuthenticated()){
         return next();
     }
     res.redirect("/login");
 }
 
  module.exports= router;