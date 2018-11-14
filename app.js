var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    flash          = require("connect-flash"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    Product        = require("./models/product"),
    Comment        = require("./models/comment"),
    User           = require("./models/user"),
    seedDB         = require("./seeds");
    
    
var commentRoutes = require("./routes/comments"),
    productRoutes   = require("./routes/products"),
    indexRoutes   = require("./routes/index")
    
mongoose.connect("mongodb://mates:illkillyouwiththe$1924@ds163013.mlab.com:63013/mates");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//express session configuration

app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use("/", indexRoutes);
app.use("/products", productRoutes);
app.use("/products/:id/comments", commentRoutes);




app.listen(process.env.PORT , process.env.IP , function(){
    console.log("SERVER HAS STARTED!!!");
});
