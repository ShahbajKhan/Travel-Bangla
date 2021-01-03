var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


//index-SHOW ALL THE AVAILABLE CAMPGROUNDS
router.get("/", function(req, res){
	if(req.query.search){
		var regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Campground.find({name: regex},function(err,allCampgrounds){
			if(err){
				console.log(err);
			}else{
				
				if(allCampgrounds.length < 1){
					req.flash("error", "No Campgrounds Match That Search. Please Try Again!");
					return res.redirect("back");
				}
				res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
			}
		});
	} else{
		Campground.find({},function(err,allCampgrounds){
			if(err){
				console.log(err);
			}else{
				res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
			}
		});
	}
	//GET ALL CAMPGROUNDS FROM DB
	
});


//Create-ADD A NEW CAMPGROUND TO DB
router.post("/", middleware.isLoggedIn, function(req,res){
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author ={
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, price: price, image: image, description: desc, author: author};
	
	//CREATE A NEW CAMPGROUND AND SAVE TO DB
	Campground.create(newCampground,function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			//REDIRECT BACK TO CAMPGROUNDS PAGE
			console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
	});
	
});

//New- SHOW FORM TO CREATE NEW CAMPGROUND
router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});

//Show- SHOWS MORE INFO ABOUT ONE CAMPGROUND
router.get("/:id",function(req,res){
	//find the campground with provide id
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
	
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground : foundCampground});	
	});
});

//UPDATE campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//DESTROY campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndDelete(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	})
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};




module.exports = router;