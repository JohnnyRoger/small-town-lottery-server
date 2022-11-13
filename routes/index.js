const express = require('express');
const router = express.Router();
//const connection = require('../database/config');

//* Get home page
router.get("/", function (req, res, next) {
  res.render("index", { title: "Node Server 2.0.0" });

});

module.exports = router;