const { Router } = require("express");
const { RatingHistory } = require("../Models/ratingHistory.model");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
require("dotenv").config();
const fs = require("fs");
const { authentication } = require("../Middlewares/authentication");

const ratingHistoryController = Router();

const getRequiredRatingHistory = (rating) => {
  const months = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December"
  };

  const rate = rating
    ?.slice()
    ?.reverse()
    ?.map(
      (el, index) =>
        index < 30 && {
          date: `${months[el[1]]} ${el[2]}, ${el[0]}`,
          rating: el[3]
        }
    );

  const requiredHistoryRating = rate?.filter((el, i) => el.date);
  return requiredHistoryRating;
};

ratingHistoryController.get(
  "/players/:username/rating-history", authentication,
  async (req, res) => {
    try {
      const { username } = req.params;
      console.log(username);

      const currentRating = await RatingHistory.findOne({ username });

      const ratingHostoryResp = await fetch(
        `${process.env.api}/user/${username}/rating-history`
      );

      const data = await ratingHostoryResp.json();

      const ratingHistory = getRequiredRatingHistory(data[3]?.points);

      if (currentRating) {
        const userRatingHistory = await RatingHistory.findByIdAndUpdate(
          { _id: currentRating?._id },
          { rating_history: ratingHistory }
        );

        res.send({ success: true, rating_history: ratingHistory });
      } else {
        const ratingHistoryOfUser = new RatingHistory({
          username: username,
          rating_history: ratingHistory
        });

        await ratingHistoryOfUser.save();
        res.send({ success: true, rating_history: ratingHistory });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

ratingHistoryController.get("/players/rating-history-csv", authentication, async (req, res) => {
  try {
    const data = await RatingHistory.find();

    const header = [
      { id: "username", title: "Username" },
      ...data[0].rating_history.map((entry) => ({
        id: entry.date,
        title: entry.date
      }))
    ];

    const csvWriter = createCsvWriter({
      path: "output.csv",
      header
    });

    const records = data.map((item) => {
      const record = { username: item.username };

      item.rating_history.forEach((entry) => {
        record[entry.date] = entry.rating;
      });

      return record;
    });

    csvWriter
      .writeRecords(records)
      .then(() => {
        console.log("CSV file created successfully");
        res.download("output.csv", "output.csv", (err) => {
          if (err) {
            console.error("Error sending file:", err);
            res.status(500).end({ msg: "something went wrong" });
          } else {
            fs.unlinkSync("output.csv");
          }
        });
      })
      .catch((error) => console.error("Error writing CSV:", error));
  } catch (error) {
    res.status(400).send({ msg: "something went wrong" });
  }
});

module.exports = { ratingHistoryController };
