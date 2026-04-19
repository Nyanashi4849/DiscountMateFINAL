const express = require("express");

const productRoutes = require("./routes/productRoutes");
const priceRoutes = require("./routes/priceRoutes");
const alertRoutes = require("./routes/alertRoutes");
const alertsRoutes = require("./routes/alerts");


const app = express();

app.use("/alerts", alertsRoutes);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("DiscountMate API Running");
});

app.use("/products", productRoutes);
app.use("/price", priceRoutes);
app.use("/alerts", alertRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});