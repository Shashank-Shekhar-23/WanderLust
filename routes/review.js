const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../Models/listing.js');
const Review = require('../Models/review.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');

const ReviewController = require('../controllers/reviews.js');

//Post route
router.post("/",isLoggedIn , validateReview, wrapAsync(ReviewController.createReview));

// Delete Review Route
router.delete("/:reviewID", isLoggedIn, isReviewAuthor, wrapAsync(ReviewController.destroyReview));

module.exports = router;