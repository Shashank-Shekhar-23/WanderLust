const Listing = require("./Models/listing");
const Review = require("./Models/review");
const { listingSchema, reviewSchema } = require('./schema.js');
const ExpressError = require('./ExpError.js');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in for this action!!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission for this action!!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewID } = req.params;
    let review = await Review.findById(reviewID);

    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission for this action!!");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, error);
  } else {
    next();
  }
};