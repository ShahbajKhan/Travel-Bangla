var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

//root route
router.get("/",function(req,res){
	res.render("landing");
});

//show register form
router.get("/register",function(req, res){
	res.render("register", {page: "register"});
});

//handles sign up logic 
router.post("/register",function(req, res){
	var newUser = new User(
		{
			username: req.body.username,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			avatar: req.body.avatar
		});
	if(req.body.adminCode === 'secretcode123'){
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("error", "Welcome to TravelBangla " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

//show login form
router.get("/login",function(req, res){
	 res.render("login", {page: "login"});
});

//handle login logic
// router.post("/login",passport.authenticate("local",
// 	{
// 		successRedirect: "/campgrounds",
// 		failureRedirect: "/login",
// 		failureFlash: true,
// 		successFlash: "Welcome to YelpCamp, " + req.body.username + "!"
// 	}), function(req, res){
// });
router.post("/login", function (req, res, next) {
	passport.authenticate("local",
	  {
		successRedirect: "/campgrounds",
		failureRedirect: "/login",
		failureFlash: true,
		successFlash: "Welcome to TravelBangla, " + req.body.username + "!"
	  })(req, res);
});

//USER PROFILE
router.get("/users/:id",function(req,res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			req.flash("error", "Something went wrong!");
			res.redirect("back");
		}
		Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds){
			if(err){
				req.flash("error", "Something went wrong!");
				res.redirect("back");
			}
			res.render("users/show", {user: foundUser, campgrounds: campgrounds});
		});
		
	});
});


//LOG OUT ROUTE
router.get("/logout",function(req, res){
	req.logout();
	req.flash("success", "Logged You Out!");
	res.redirect("/campgrounds");
});



module.exports = router;