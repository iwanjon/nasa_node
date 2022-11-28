const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_URL = process.env.MONGO_URL;
// const MONGO_URL = "mongodb://localhost:27017/nasa";

mongoose.connection.once("open", () => {
  console.log("mongo db is connected");
});
mongoose.connection.on("error", (err) => {
  console.log("error happend");
  console.log(err);
});

async function MongoCOnnect() {
  return await mongoose.connect(MONGO_URL);
}
async function MongoDIsconnesct() {
  return await mongoose.disconnect(MONGO_URL);
}

module.exports = { MongoCOnnect, MongoDIsconnesct };
