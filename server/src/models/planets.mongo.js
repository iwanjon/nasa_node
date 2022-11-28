const mongoose = require("mongoose");

const plannetSchema = new mongoose.Schema({
  keplerName: {
    type: "string",
    required: true,
  },
});


module.exports = mongoose.model("Planet", plannetSchema);