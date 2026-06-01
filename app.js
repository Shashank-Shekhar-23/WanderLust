const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const { nextTick } = require('process');
const session = require('express-session');
const flash = require('connect-flash');


const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


//Error
const ExpressError = require('./ExpError.js');

app.use(methodOverride("_method"))

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.engine('ejs', ejsMate);

main()
  .then(() => {
    console.log('Connection successful');
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');
}

const sessionOptions = {
  secret: "Code",
  resave: false,
  saveUnintialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  }
};

app.use(session(sessionOptions));
app.use(flash());

app.get('/', (req, res) => {
  res.send('Server is working well.');
});

//Api
const checkToken = (req, res, next) => {
  let { token } = req.query;
  if (token === 'giveaccess')
    next();
  else
    throw new ExpressError(401, "Access Denied!!");
};

app.get('/api', checkToken, (req, res) => {
  res.send("Data");
});

//Error Handling
/* app.get('/err', (req, res) => {
  a = a;
}); */

/* app.use((err,req,res,next) => {
  console.log("-----ERROR------");
  next(err);
}); */

app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

/* app.get('/testListing', async (req, res) => {
  let sampleListing = new Listing({
    title: "Apna Villa",
    price: 1200,
    description: "Our beautiful Villa.",
    location: "New York",
    country: "USA",
    });
    
    await sampleListing.save()
    .then(() => {
      console.log("Data saved in DataBase.");
      })
      .catch((err) => {
        console.log(err);
        });
        
        res.send("Testing Successfull");
        }); */


/* app.use((err, req, res, next) => {
  res.send("Something went wrong!!!");
}) */

//404 Handler
/* app.use('/', (req, res, next) => {
  res.send("Page not found!!!");
  next();
});
 */

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!!"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong!!!" } = err;
  res.status(status).render("error.ejs", { message });
  // res.status(status).send(message);
});

app.listen(port, () => {
  console.log(`Server listening on port port`);
});