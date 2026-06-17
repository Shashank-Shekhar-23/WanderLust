const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../Models/listing.js');
const Review = require('../Models/review.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');

//Post route
router.post("/",isLoggedIn , validateReview, wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success","New review created!!");

  res.redirect(`/listings/${listing._id}`);
}));

// Delete Review Route
router.delete("/:reviewID", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
  let { id, reviewID } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
  await Review.findByIdAndDelete(reviewID);

  req.flash("success","Review deleted!!");

  res.redirect(`/listings/${id}`);
}));

module.exports = router;