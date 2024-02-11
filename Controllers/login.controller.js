const { Router } = require("express");
const { User } = require("../Models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const loginController = Router();

loginController.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      bcrypt.compare(password, user?.password, async (_err, result) => {
        if (result === true) {
          const token = jwt.sign({ userId: user?._id }, process.env.KEY);

          const payload = {
            msg: "login successful",
            token: token,
            userData: {
              id: user._id,
              firstname: user.firstname,
              lastname: user.lastname,
              email: user?.email
            }
          };
          res.send(payload);
        } else res.status(404).send({ msg: "something went wrong" });
      });
    } else res.status(404).send({ msg: "user not found" });
  } catch (error) {
    res.status(404).send({ msg: "Something went wrong" });
  }
});

module.exports = { loginController };
