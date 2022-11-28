const express = require("express");
const { GetAllLaunchers, PostNewLaunch, AbortLaunch } = require("./launches.controller");
const launchRoute = express.Router();

launchRoute.get("/", GetAllLaunchers);
launchRoute.post("/", PostNewLaunch);
launchRoute.delete("/:id", AbortLaunch);

module.exports = launchRoute;
