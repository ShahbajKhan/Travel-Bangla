var express    = require("express"),
    app 	   = express(),
	bodyParser = require("body-parser"),
	mongoose   = require("mongoose"),
	flash	   = require("connect-flash"),
	passport   = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Campground = require("./models/campground"),
	Comment    = require("./models/comment"),
	User 	   = require("./models/user"),
	seedDB 	   = require("./seed");

//Requiring route
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes		 = require("./routes/index");


//seedDB(); //seed the database
//CONNECTING AND CREATING DATBASE
mongoose.connect("mongodb://localhost/app-database", { useNewUrlParser: true, useUnifiedTopology: true  });



//body parsing middleware.
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname+ "/public"));
app.use(methodOverride("_method"));
// Node Flash message
app.use(flash());

app.locals.moment = require('moment');

//PASSPORT Configuration
app.use(require("express-session")({
	secret: "Rusty wins",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Authentication and Authorization config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// Setting Routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// LocalHost
app.listen(3000,function(){
	console.log("The YelpCamp Started!!");
});

