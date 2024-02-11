const mongoose = require("mongoose");

const playersSchema = mongoose.Schema({
  username: { type: String, required: true }
});

const Player = mongoose.model("player", playersSchema);

module.exports = { Player };
