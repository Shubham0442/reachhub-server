const { Router } = require("express");
const { User } = require("../Models/user.model");
const bcrypt = require("bcrypt");

const signupController = Router();

signupController.post("/signup", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    const user = await User.find({ email: email });

    if (user.length !== 0) {
      res.status(404).send({ msg: "User already exist" });
    } else {
      bcrypt.hash(password, 8, async (err, hash) => {
        if (err) res.status(404).send({ msg: "something went wrong" });
        else {
          const newUser = new User({
            firstname,
            lastname,
            email,
            password: hash
          });
          await newUser.save();
          res.send({ msg: "signup successful" });
        }
      });
    }
  } catch (error) {
    res.status(404).send({ msg: "something went wrong" });
  }
});

module.exports = { signupController };
