const mongoose=require("mongoose");
const review = require("./review");
const Schema =mongoose.Schema;
const Review=require("./review.js");
const { required } = require("joi");
const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
       url:String,
       filename:String,
        
    },
    price:Number,
    location:String,
    country:String,
     reviews:[
        {
          type:Schema.Types.ObjectId,  
          ref:"Review",
        }
     ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    //for map
    /*coordinates:{
      type:[Number],
      required:true,
   },*/
   /*category:{
    type:String,
    enum:["mountains","arctic","farms","deserts"]
   }*/
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})
const listing=mongoose.model("listing",listingSchema);
module.exports=listing;