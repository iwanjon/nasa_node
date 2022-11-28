const http = require("http");
// const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./app");
const { MongoCOnnect } = require("./services/mongo");
const { LoadPlanetData } = require("./models/planets.model");
const { LoadLaunchData } = require("./models/launch.model");

const PORT = process.env.PORT || 8000;

// const MONGO_URL = "mongodb://localhost:27017/nasa";

// mongoose.connection.once("open", () => {
//   console.log("mongo db is connected");
// });
// mongoose.connection.on("error", (err) => {
//   console.log("error happend");
//   console.log(err);
// });

async function runserver() {
  await MongoCOnnect();
  await LoadPlanetData();
  await LoadLaunchData();
  // LoadPlanetData().then(()=>{
  //     console.log("ready stream data planet")
  // }).catch((err)=>{
  //     console.log(err)
  // });
  server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`listern on http:localhost:${PORT} ....`);
  });
}
runserver();
