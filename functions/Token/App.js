const functions = require("firebase-functions");
const Razorpay = require("razorpay");
const cors = require("cors");
var express = require("express");
const app = express();
app.use(cors({ origin: true, credentials: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/getOrderId", async (req, res) => {
  const amount = req.body.amount;
  const receipt = req.body.receipt;
  var options = {
    amount: amount,
    currency: "INR",
    receipt: receipt,
  };
  var instance = new Razorpay({
    key_id: "rzp_test_GMAsUzcXCovkxO",
    key_secret: "WWcHJzjYLrpbYYN198nNe8Qf",
  });

  var order = await instance.orders.create(options);
  res.send(order);
});

module.exports = app;
