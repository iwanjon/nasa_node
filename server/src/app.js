const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

// const planetsRouter = require('./routes/planets/planets.router')
// const launchsRouter = require('./routes/launches/launches.router')
const { api } = require("../src/routes/api");

const app = express();
// console.log(planetsRouter, "dfdf");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(morgan("combined"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/v1", api);
// app.use(planetsRouter);
// app.use("/launches",launchsRouter);
app.get("/*", (req, res) => {
  // console.log(path.join(__dirname,"..","public"), "lll")
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
module.exports = app;
