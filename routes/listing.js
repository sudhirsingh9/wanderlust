const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
//const {listingSchema,reviewSchema}=require("../schema.js");
//const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../midddleware.js");
//const flash=require("connect-flash");

//validate
const listingController=require("../controllers/listings.js");
const multer  = require("multer");
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });


//index route
 router.get("/",wrapAsync(listingController.index));

//new route
router.get("/new", isLoggedIn,listingController.renderNewForm);

// show route
router.get("/:id", wrapAsync(listingController.showListing));

// create route
router.post("/", isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));
//router.post("/",upload.single("listing[image]"),(req,res)=>{
  //res.send(req.file);
//});
//edit route
router.get("/listings/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

//update route
router.put("/:id", isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing));

//delete route
router.delete("/:id", isLoggedIn, isOwner,wrapAsync(listingController.destroyListing));

module.exports=router;