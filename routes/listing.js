const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../Models/listing.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');

//Index Route
router.get('/', async (req, res) => {
  const allListings = await Listing.find();

  res.render('./listings/index.ejs', { allListings });
});

//New Route
router.get('/new', isLoggedIn, async (req, res) => {
  res.render('./listings/new.ejs');
});

//Create Route
router.post('/new', isLoggedIn, validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New listing created!!");
  res.redirect("/listings");
}));

//edit Route
router.get('/:id/edit', isLoggedIn, isOwner, async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "No such listing found!!");
    return res.redirect("/listings");
  } 
  
  res.render('./listings/edit.ejs', { listing });

  // res.redirect('/listings');
});

//Update Route
router.put('/:id/', isLoggedIn, isOwner, validateListing, async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated!!");
  res.redirect(`/listings/${id}`);
});

//Delete Route
router.delete('/:id', isLoggedIn, isOwner, async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  // console.log(deletedListing);
  req.flash("success", "New listing deleted!!");

  res.redirect('/listings');
});


//Show Route
router.get('/:id', async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path: "reviews", populate: "author"}).populate("owner");

  if (!listing) {
    req.flash("error", "No such listing found!!");
    return res.redirect("/listings");
  }
  res.render('./listings/show.ejs', { listing });
});

module.exports = router;