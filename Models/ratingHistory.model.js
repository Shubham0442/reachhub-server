const mongoose = require("mongoose");

const ratingHistorySchema = mongoose.Schema({
  username: { type: String, required: true },
  rating_history: { type: Array, required: true }
});

const RatingHistory = mongoose.model("ratingHistory", ratingHistorySchema);

module.exports = { RatingHistory };
