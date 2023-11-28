const Listing = require("../models/listing");
const listingSchema = require("../schema.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.newForm = async (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found!!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.create = async (req, res, next) => {


  let response =await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
    .send();
  

  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url, "...", filename);
  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };
  newlisting.geometry=response.body.features[0].geometry;
  let savedListing=await newlisting.save();
  console.log(savedListing);
  req.flash("success", "New Listing Created!!");
  res.redirect("/listings");
};
module.exports.edit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!!");
    res.redirect("/listings");
  }
  let orimgurl=listing.image.url;
  orimgurl= orimgurl.replace("/uploads","/upload/h_300,w_250")
  res.render("listings/edit.ejs", { listing,orimgurl });
};
module.exports.update = async (req, res) => {
  let { id } = req.params;
  let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file!=="undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", " Listing Updated!!");
  res.redirect(`/listings/${id}`);
};
module.exports.delete = async (req, res) => {
  let { id } = req.params;
  let dele = await Listing.findByIdAndDelete(id);
  console.log(dele);
  req.flash("success", " Listing Deleted!!");
  res.redirect(`/listings`);
};
