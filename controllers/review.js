const Listing=require("../models/listing");
const Review=require("../models/review.js");


module.exports.addnew=async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved!");
    // res.send("new review saved");
    req.flash("success","New Review Created!!");
    console.log(listing._id);
    res.redirect(`/listings/${id}`);
  }

  module.exports.delete=async(req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review Deleted!!");
    res.redirect(`/listings/${id}`);
  }