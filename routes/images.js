const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Image } = require("../models/image");

router.get("/:id", async (req, res) => {
  const image = await Image.findById(req.params.id);

  if (!image)
    return res.status(404).send("The image with the given ID was not found.");

  res.send(image);
});

router.get("/", [auth, admin], async (req, res) => {
  const images = await Image.find().sort("_id");
  res.send(images);
});

router.post("/upload", async (req, res) => {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No files were uploaded.");
  }

  let sampleFile = req.files.sampleFile;
  const path = `${__dirname}/../images/${sampleFile.name}`;

  sampleFile.mv(path, function(err) {
    if (err) return res.status(500).send(err);
  });

  let image = new Image({ path });
  image = await image.save();

  res.send(image.id);
});

router.get("/:id", async (req, res) => {
  const image = await Image.findById(req.params.id);

  if (!image)
    return res.status(404).send("The image with the given ID was not found.");

  res.send(image);
});

module.exports = router;
