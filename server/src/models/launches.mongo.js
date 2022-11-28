const mongoose = require("mongoose");

const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
    max: 9999,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  target: {
    // type: mongoose.ObjectId,
    // required: true,
    // ref:"Planet"
    type: String,
    required: true,
  },
  upcoming: {
    type: Boolean,
    required:  true,
    // required:  function() {
    //   console.log("madang sik");
    // }
    // default: true,
  },
  success: {
    type: Boolean,
    required: true,
    // nullable: true,
    // default: true,
  },
  customers: {
    type: [String],
    // required: true,
  },
});

// flightNumber: 100,
// mission: "Kepler Exploration X",
// rocket: "Explorer Is1",
// launchDate: new Date("December 27, 2030"),
// target: "Kepler-442 b",
// customer: ["ZTM", "NASA"],
// upcoming: true,
// success: true,

// launchesSchema.pre('findOneAndUpdate', function(next) {
//   this.options.runValidators = true;
//   next();
// });
module.exports = mongoose.model("launch", launchesSchema);
