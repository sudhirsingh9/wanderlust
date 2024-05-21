const { model } = require("mongoose");

          //code for map
//const mbxClient = require('@mapbox/mapbox-sdk');
//const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
//const mapToken= process.env.MAP_TOKEN;
//const geocodingClient = mbxGeocoding({ accessToken:mapToken });

const Listing=require("../models/listing");

module.exports.index=async(req,res,)=>{
    const allListings =await Listing.find({});
    res.render("listings/index.ejs",{allListings});   ;

};

module.exports.renderNewForm=(req,res)=>{
  
    res.render("listings/new.ejs");
 };

 module.exports.showListing=async(req,res)=> {
    let {id}=req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews",
     populate:{
      path:"author"}}).populate("owner");
    if(!listing){
      req.flash("error", "Listing you requested for does not exist!"); 
      res.redirect("/listings")
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing=async(req,res)=>{
    //let result=listingSchema.validate(req.body);
        //map
    //let response =geocodingClient.forwardGeocode({
    //query:"New Delhi, India",
    //limit:1,
    //})    
    //.send()
    //.then(response=> {
    //const match =response.body;
    //})
    //console.log(response);
    //res.send("done!");
    let url=req.file.path;
    let filename=req.file.filename;
    const newlisting=new Listing (req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    await newlisting.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing you requested for does not exist!"); 
      res.redirect("/listings")
    }
    let originalImageUrl= listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload", "/upload/e_blur,w_250");
    res.render("listings/edit.ejs", { listing,originalImageUrl });

};

module.exports.updateListing=async(req,res)=>{
      let {id}=req.params;
      let listing = await Listing.findByIdAndUpdate(id,{ ...req.body.listing});
      if(typeof req.file !="undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image= {url,filename};
      await listing.save();
      }
      req.flash("success", "Listing Updated!");
      res.redirect(`/listings/${id}`)
};

module.exports.destroyListing= async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};