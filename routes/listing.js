const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../Models/listing.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');

const ListingController = require('../controllers/listings.js');
const { listenerCount } = require('../Models/review.js');

const multer = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({storage})

//Index Route
router.get('/', wrapAsync(ListingController.index));

router.route('/new')
    //New Route
    .get(isLoggedIn, wrapAsync(ListingController.renderNewForm))
    //Create Route
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(ListingController.createListing));

//edit Route
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(ListingController.editListing));

router.route('/:id')
    //Update Route
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(ListingController.updateListing))

    //Delete Route
    .delete(isLoggedIn, isOwner, wrapAsync(ListingController.destroyListing))

    //Show Route
    .get(wrapAsync(ListingController.showListing));

module.exports = router;