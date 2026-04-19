const express = require("express");
const router = express.Router();

const {
  createAlert,
  getAlerts
} = require("../controllers/alertController");

router.post("/", createAlert);

router.get("/", getAlerts);

module.exports = router;