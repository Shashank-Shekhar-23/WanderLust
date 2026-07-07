if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const { nextTick } = require('process');
const session = require('express-session');
const MongoStore = require('connect-mongo').MongoStore;
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./Models/user.js');


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbURL = process.env.ATLASDB_URL;
// const dbURL = 'mongodb://127.0.0.1:27017/WanderLust';

const secret = process.env.SECRET;

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
  await mongoose.connect(dbURL);
}

const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: secret,
  },
  touchAfter: 24 * 3600
});

store.on("error", (err) => {
  console.log("Error in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: secret,
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

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* app.get('/', (req, res) => {
  res.send('Server is working well.');
}); */

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

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//Demo User
/* app.get("/demouser", async(req, res) => {
  let fakeUser = new User({
    email: "student@gmail.com",
    username: "student",
  });

  let registeredUser = await User.register(fakeUser, "helloworld");
  res.send(registeredUser);
}) */

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

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
  console.log(`Server listening on port ${port}`);
});