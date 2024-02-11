const { Router } = require("express");
const { Player } = require("../Models/players.model");
const { authentication } = require("../Middlewares/authentication");
require("dotenv").config();

const playerController = Router();

playerController.post("/top-players/add", authentication, async (req, res) => {
  const resp = await fetch(`${process.env.api}/player/top/50/classical`);
  const data = await resp.json();
  if (data) {
    const required = data?.users?.map((el) => {
      return { username: el.username };
    });

    const list = await Player.insertMany(required);

    res.status(201).send({ success: true, players: required });
  }
});

playerController.get("/top-players", authentication, async (req, res) => {
  try {
    const players = await Player.find();
    if (players?.length === 0) {
      res.status(404).send({ success: false });
    }
    res.status(201).send({ success: true, players });
  } catch (error) {
    res.status(404).send({ success: false });
  }
});

playerController.delete("/del", async (req, res) => {
  const del = await Player.deleteMany({});
  res.send("deleted");
});

module.exports = { playerController };
