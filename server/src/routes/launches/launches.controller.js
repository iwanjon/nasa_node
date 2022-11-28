const { json } = require("express");
const {
  getallLaunch,
  addNewLaunch,
  isExistLaunch,
  AbortLaunchModel,
} = require("../../models/launch.model");

const {getPagination} = require("../../services/query")

async function GetAllLaunchers(req, res) {
  const {skip, limit} = getPagination(req.query)
  res.status(200).json(await getallLaunch(skip, limit));
}

async function PostNewLaunch(req, res) {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.target ||
    !launch.launchDate
  ) {
    return res.status(400).json({
      error: "invalid input",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  // if (launch.launchDate.toString() == "Invalid Date"){
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "invalid date input",
    });
  }

  await addNewLaunch(launch);
  return res.status(201).json(launch);
}

async function AbortLaunch(req, res) {
  const id = Number(req.params.id);
  const existing = await  isExistLaunch(id)
  if (!existing) {
    return res.status(400).json({
      error: "launch id not found",
    });
  } else {
    const abborted = await AbortLaunchModel(id)
    if (!abborted){
      return res.status(500).json({
        "error":"ther is a problem in delteing data"
      });
    }

    return res.status(200).json({
      "ok": true
    });
  }
}

module.exports = {
  GetAllLaunchers,
  PostNewLaunch,
  AbortLaunch,
};
