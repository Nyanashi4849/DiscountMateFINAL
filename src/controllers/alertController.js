const alertModel = require("../models/alertModel");

exports.createAlert = async (req, res) => {

  try {

    const { user_id, product_id, target_price } = req.body;

    const alert = await alertModel.createAlert(
      user_id,
      product_id,
      target_price
    );

    res.status(201).json(alert);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
};

exports.getAlerts = async (req, res) => {

  try {

    const alerts = await alertModel.getAllAlerts();

    res.json(alerts);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
};