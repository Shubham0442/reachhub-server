const express = require("express");
const cors = require("cors");
const { connection } = require("./Config/db");
const { signupController } = require("./Controllers/signup.controller");
const { loginController } = require("./Controllers/login.controller");
const { playerController } = require("./Controllers/player.controller");
const {
  ratingHistoryController
} = require("./Controllers/ratingHistory.controller");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(cors());

app.use("/", signupController);
app.use("/", loginController);
app.use("/", playerController);
app.use("/", ratingHistoryController);

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  try {
    await connection;
    console.log(`app is running on http://localhost:${PORT}`);
  } catch (error) {
    console.log("err:", error);
  }
});
