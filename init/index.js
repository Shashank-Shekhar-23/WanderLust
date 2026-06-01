const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../Models/listing.js');

main()
  .then(() => {
    console.log('Connection successful');
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');
}

/* const modelNameSchema = new mongoose.Schema({


const modelName = mongoose.model('modelName', modelNameSchema); */

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);

    console.log("Data was initialized");

}

initDB();

/* doc.save()
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  }); */