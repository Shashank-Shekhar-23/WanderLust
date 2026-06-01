const express = require('express');
const router = express.Router({mergeParams: true});

const wrapAsync = require('../utils/wrapAsync.js');
const { reviewSchema } = require('../schema.js');
const ExpressError = require('../ExpError.js');
const Listing = require('../Models/listing.js');
const Review = require('../Models/review.js');


//Validate Review
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.detals.map((el) => el.message).join(",");
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

//Post route
router.post("/", validateReview, wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success","New review created!!");

  res.redirect(`/listings/${listing._id}`);
}));

// Delete Review Route
router.delete("/:reviewID", wrapAsync(async (req, res) => {
  let { id, reviewID } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
  await Review.findByIdAndDelete(reviewID);

  req.flash("success","New review deleted!!");

  res.redirect(`/listings/${id}`);
}));

module.exports = router;